const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const ROOT = path.resolve(__dirname);

app.use(express.json());
app.use(express.static(path.join(ROOT, 'public')));

// Prevent path traversal
function safe(...parts) {
  const resolved = path.resolve(ROOT, ...parts);
  if (!resolved.startsWith(ROOT)) throw new Error('Invalid path');
  return resolved;
}

function isDomain(name) { return /^\d{2}-/.test(name); }

// Words that are always uppercased regardless of position
const ACRONYMS = new Set([
  'gdpr','bcp','dr','iam','pki','ssl','tls','vpn','ids','ips','siem',
  'dlp','mfa','soc','grc','rbac','dac','mac','acl','ccpa','hipaa','pci',
  'dss','nist','iso','bia','rpo','rto','mtd','mto','dpo','eu','us','uk',
  'api','sdk','dns','http','https','ip','tcp','udp','osi','lan','wan',
  'wlan','ssh','ftp','sftp','smtp','ldap','saml','oauth','jwt',
]);

// Words lowercased when not the first word in a label
const SMALL = new Set(['and','or','of','the','in','a','an','for','to','with','at','by','from','on','vs']);

function cap(word, isFirst = true) {
  const lo = word.toLowerCase();
  if (ACRONYMS.has(lo)) return lo.toUpperCase();
  if (!isFirst && SMALL.has(lo)) return lo;
  return lo.charAt(0).toUpperCase() + lo.slice(1);
}

function labelFromSlug(slug) {
  return slug.split('-').map((w, i) => cap(w, i === 0)).join(' ');
}

function domainLabel(id) {
  const m = id.match(/^(\d+)-(.+)$/);
  if (!m) return id;
  return `Domain ${parseInt(m[1], 10)}: ${labelFromSlug(m[2])}`;
}

function setLabel(id) {
  return labelFromSlug(id);
}

function parseFrontMatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return {};
    const fm = {};
    for (const line of m[1].split(/\r?\n/)) {
      const colon = line.indexOf(':');
      if (colon < 0) continue;
      const key = line.slice(0, colon).trim();
      let val = line.slice(colon + 1).trim();
      // Strip leading/trailing quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[key] = val;
    }
    return fm;
  } catch { return {}; }
}

function countCards(dir) {
  try {
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.tsv'))
      .reduce((n, f) => {
        const lines = fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n');
        return n + Math.max(0, lines.length - 1);
      }, 0);
  } catch { return 0; }
}

function countMcq(dir) {
  try {
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .reduce((n, f) => {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        return n + (Array.isArray(data) ? data.length : 0);
      }, 0);
  } catch { return 0; }
}

// Progress is stored in a single root-level progress.json, keyed by "domainId/setId".
// This keeps it completely outside the content folders so git operations never touch it.
const PROGRESS_FILE     = path.join(ROOT, 'progress.json');
const ACTIVITY_FILE     = path.join(ROOT, 'activity.json');
const MCQ_PROGRESS_FILE = path.join(ROOT, 'mcq-progress.json');
const SESSIONS_FILE     = path.join(ROOT, 'quiz-sessions.json');

function loadSessions() {
  try { return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8')); }
  catch { return []; }
}
function saveSessions(data) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function loadAllProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); }
  catch { return {}; }
}

function saveAllProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function localDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Compute current shaky/mostlyWrong counts from progress files.
// Pass domainId to scope to one domain, or null for global.
function computeShakyStats(domainId) {
  let shaky = 0, mostlyWrong = 0;
  for (const data of [loadAllProgress(), loadMcqProgress()]) {
    for (const [key, pData] of Object.entries(data)) {
      if (domainId && !key.startsWith(domainId + '/')) continue;
      for (const p of Object.values(pData)) {
        if (p.right >= 1 && p.wrong >= 1) shaky++;
        if (p.wrong > p.right) mostlyWrong++;
      }
    }
  }
  return { shaky, mostlyWrong };
}

function recordActivity(domainId, isRight) {
  const today = localDateStr();
  const activity = loadActivity();
  if (!activity[today]) activity[today] = { right: 0, wrong: 0, shaky: 0, mostlyWrong: 0 };

  // Global counters (track right + wrong; answered is derived as right+wrong)
  if (isRight) activity[today].right++; else activity[today].wrong++;
  const { shaky: gs, mostlyWrong: gm } = computeShakyStats(null);
  activity[today].shaky       = gs;
  activity[today].mostlyWrong = gm;

  // Domain counters
  if (!activity[today][domainId]) activity[today][domainId] = { right: 0, wrong: 0, shaky: 0, mostlyWrong: 0 };
  if (isRight) activity[today][domainId].right++; else activity[today][domainId].wrong++;
  const { shaky: ds, mostlyWrong: dm } = computeShakyStats(domainId);
  activity[today][domainId].shaky       = ds;
  activity[today][domainId].mostlyWrong = dm;

  saveActivity(activity);
}

function loadActivity() {
  try { return JSON.parse(fs.readFileSync(ACTIVITY_FILE, 'utf8')); }
  catch { return {}; }
}

function saveActivity(data) {
  fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function loadMcqProgress() {
  try { return JSON.parse(fs.readFileSync(MCQ_PROGRESS_FILE, 'utf8')); }
  catch { return {}; }
}

function saveMcqProgress(data) {
  fs.writeFileSync(MCQ_PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/nav  — full tree for the left sidebar (one request on load)
app.get('/api/nav', (req, res) => {
  const domains = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && isDomain(e.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(e => {
      const dp   = path.join(ROOT, e.name);
      const sets = fs.readdirSync(dp, { withFileTypes: true })
        .filter(s => s.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(s => {
          const sp = path.join(dp, s.name);
          const readmePath = path.join(sp, 'README.md');
          const fm = fs.existsSync(readmePath) ? parseFrontMatter(readmePath) : {};
          const t = parseInt(fm.tier, 10);
          return {
            id: s.name, name: setLabel(s.name), cardCount: countCards(sp),
            mcqCount: countMcq(sp),
            tier: isNaN(t) ? null : t, examWeight: fm.exam_weight || null,
          };
        });
      return { id: e.name, name: domainLabel(e.name), sets };
    });
  res.json(domains);
});

// GET /api/domains
app.get('/api/domains', (req, res) => {
  const domains = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && isDomain(e.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(e => {
      const dp = path.join(ROOT, e.name);
      const setDirs = fs.readdirSync(dp, { withFileTypes: true }).filter(s => s.isDirectory());
      const totalCards = setDirs.reduce((n, s) => n + countCards(path.join(dp, s.name)), 0);
      const totalMcq   = setDirs.reduce((n, s) => n + countMcq(path.join(dp, s.name)),   0);
      return { id: e.name, name: domainLabel(e.name), sets: setDirs.length, totalCards, totalMcq };
    });
  res.json(domains);
});

// GET /api/domains/:domain/readme
app.get('/api/domains/:domain/readme', (req, res) => {
  try {
    const p = safe(req.params.domain, 'README.md');
    if (!fs.existsSync(p)) return res.json({ html: null });
    let content = fs.readFileSync(p, 'utf8');
    // Strip frontmatter: everything from the first --- to the second ---
    content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
    res.json({ html: marked(content) });
  } catch { res.status(400).end(); }
});

// GET /api/domains/:domain/sets
app.get('/api/domains/:domain/sets', (req, res) => {
  try {
    const dp = safe(req.params.domain);
    if (!fs.existsSync(dp)) return res.json([]);
    const sets = fs.readdirSync(dp, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(e => {
        const sp = path.join(dp, e.name);
        const readmePath = path.join(sp, 'README.md');
        const fm = fs.existsSync(readmePath) ? parseFrontMatter(readmePath) : {};
        const t = parseInt(fm.tier, 10);
        return {
          id: e.name, name: setLabel(e.name),
          cardCount: countCards(sp), mcqCount: countMcq(sp), hasReadme: fs.existsSync(readmePath),
          tier: isNaN(t) ? null : t, examWeight: fm.exam_weight || null,
        };
      });
    res.json(sets);
  } catch { res.status(400).end(); }
});

// GET /api/domains/:domain/sets/:set/readme
app.get('/api/domains/:domain/sets/:set/readme', (req, res) => {
  try {
    const p = safe(req.params.domain, req.params.set, 'README.md');
    if (!fs.existsSync(p)) return res.json({ html: null });
    let content = fs.readFileSync(p, 'utf8');
    // Strip frontmatter
    content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
    res.json({ html: marked(content) });
  } catch { res.status(400).end(); }
});

// GET /api/domains/:domain/sets/:set/cards
app.get('/api/domains/:domain/sets/:set/cards', (req, res) => {
  try {
    const sp = safe(req.params.domain, req.params.set);
    if (!fs.existsSync(sp)) return res.json([]);
    const cards = fs.readdirSync(sp)
      .filter(f => f.endsWith('.tsv'))
      .sort()
      .flatMap(f => {
        const lines = fs.readFileSync(path.join(sp, f), 'utf8').trim().split('\n');
        return lines.slice(1).flatMap(line => {
          const parts = line.split('\t');
          if (parts.length < 2 || !parts[0].trim()) return [];
          const q = parts[0].trim();
          const a = parts[1].trim();
          const unescape = s => s.replace(/\\n/g, '\n');
          return [{ question: q, questionHtml: marked.parse(unescape(q)), answerHtml: marked.parse(unescape(a)), category: (parts[2] || '').trim() }];
        });
      });
    res.json(cards);
  } catch { res.status(400).end(); }
});

// GET /api/domains/:domain/sets/:set/progress
app.get('/api/domains/:domain/sets/:set/progress', (req, res) => {
  try {
    const key = `${req.params.domain}/${req.params.set}`;
    const all = loadAllProgress();
    res.json(all[key] || {});
  } catch { res.status(400).end(); }
});

// POST /api/domains/:domain/sets/:set/progress
app.post('/api/domains/:domain/sets/:set/progress', (req, res) => {
  try {
    const { question, result } = req.body;
    if (!question || !['right', 'wrong'].includes(result)) {
      return res.status(400).json({ error: 'question and result (right|wrong) required' });
    }
    const key = `${req.params.domain}/${req.params.set}`;
    const all = loadAllProgress();
    if (!all[key]) all[key] = {};
    const entry = all[key][question] || { right: 0, wrong: 0, lastSeen: '' };
    if (result === 'right') entry.right++;
    else entry.wrong++;
    entry.lastSeen = localDateStr();
    all[key][question] = entry;
    saveAllProgress(all);
    recordActivity(req.params.domain, result === 'right');
    res.json({ ok: true, entry });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/activity?all=1[&domain=XX]  — all recorded dates, optionally scoped to a domain
app.get('/api/activity', (req, res) => {
  const activity = loadActivity();
  const domainId = req.query.domain || null;

  const normalize = (dayData) => {
    const src = domainId ? (dayData[domainId] || {}) : dayData;
    const right = src.right ?? 0;
    const wrong = src.wrong ?? (src.answered != null ? src.answered - right : 0);
    return {
      answered:    right + wrong,
      right,
      shaky:       src.shaky       ?? 0,
      mostlyWrong: src.mostlyWrong ?? 0,
    };
  };

  if (req.query.all === '1') {
    const result = Object.entries(activity)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, dayData]) => ({ date, ...normalize(dayData) }));
    return res.json(result);
  }
  const days = Math.min(parseInt(req.query.days, 10) || 7, 90);
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    result.push({ date, ...normalize(activity[date] || {}) });
  }
  res.json(result);
});

// GET /api/progress  — per-set progress summaries for all sets that have data
app.get('/api/progress', (req, res) => {
  const all = loadAllProgress();
  const out = {};
  for (const [key, progress] of Object.entries(all)) {
    let mastered = 0, struggling = 0, shaky = 0, mostlyWrong = 0;
    for (const p of Object.values(progress)) {
      if (p.right > 0 && p.wrong === 0) mastered++;
      else if (p.right === 0 && p.wrong > 0) { struggling++; mostlyWrong++; }
      else if (p.right > 0 && p.wrong > 0) { shaky++; if (p.wrong > p.right) mostlyWrong++; }
    }
    out[key] = { studied: mastered + struggling + shaky, mastered, struggling, shaky, mostlyWrong };
  }
  res.json(out);
});

// GET /api/mcq-progress-summary  — per-set MCQ summaries (same shape as /api/progress)
app.get('/api/mcq-progress-summary', (req, res) => {
  const all = loadMcqProgress();
  const out = {};
  for (const [key, progress] of Object.entries(all)) {
    let mastered = 0, struggling = 0, shaky = 0, mostlyWrong = 0;
    for (const p of Object.values(progress)) {
      if (p.right > 0 && p.wrong === 0) mastered++;
      else if (p.right === 0 && p.wrong > 0) { struggling++; mostlyWrong++; }
      else if (p.right > 0 && p.wrong > 0) { shaky++; if (p.wrong > p.right) mostlyWrong++; }
    }
    out[key] = { studied: mastered + struggling + shaky, mastered, struggling, shaky, mostlyWrong };
  }
  res.json(out);
});

// GET /api/domains/:domain/sets/:set/mcq
app.get('/api/domains/:domain/sets/:set/mcq', (req, res) => {
  try {
    const sp = safe(req.params.domain, req.params.set);
    const files = fs.existsSync(sp) ? fs.readdirSync(sp).filter(f => f.endsWith('.json')) : [];
    const questions = files.flatMap(f => {
      const data = JSON.parse(fs.readFileSync(path.join(sp, f), 'utf8'));
      if (!Array.isArray(data)) return [];
      return data.map(q => ({
        question: q.question,
        questionHtml: marked.parse(q.question || ''),
        options: q.options || [],
        optionsHtml: (q.options || []).map(o => marked.parse(o)),
        correct: q.correct,
        explanation: q.explanation || '',
        explanationHtml: marked.parse(q.explanation || ''),
        category: q.category || '',
      }));
    });
    res.json(questions);
  } catch { res.status(400).end(); }
});

// GET /api/domains/:domain/sets/:set/mcq-progress
app.get('/api/domains/:domain/sets/:set/mcq-progress', (req, res) => {
  try {
    const key = `${req.params.domain}/${req.params.set}`;
    const all = loadMcqProgress();
    res.json(all[key] || {});
  } catch { res.status(400).end(); }
});

// POST /api/domains/:domain/sets/:set/mcq-progress
app.post('/api/domains/:domain/sets/:set/mcq-progress', (req, res) => {
  try {
    const { questionIndex, correct } = req.body;
    if (questionIndex === undefined || correct === undefined) {
      return res.status(400).json({ error: 'questionIndex and correct required' });
    }
    const key = `${req.params.domain}/${req.params.set}`;
    const all = loadMcqProgress();
    if (!all[key]) all[key] = {};
    const entry = all[key][questionIndex] || { right: 0, wrong: 0, lastSeen: '' };
    if (correct) entry.right++; else entry.wrong++;
    entry.lastSeen = localDateStr();
    all[key][questionIndex] = entry;
    saveMcqProgress(all);
    recordActivity(req.params.domain, correct === true);
    res.json({ ok: true, entry });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Random quiz endpoint ──────────────────────────────────────────────────────

const DOMAIN_EXAM_WEIGHTS = {
  '01-security-and-risk-management': 15,
  '02-asset-security': 10,
  '03-security-architecture-and-engineering': 13,
  '04-communication-and-network-security': 13,
  '05-identity-and-access-management': 13,
  '06-security-assessment-and-testing': 12,
  '07-security-operations': 13,
  '08-software-development-security': 11,
};

function loadAllMcqForDomain(domainId) {
  const dp = safe(domainId);
  if (!fs.existsSync(dp)) return [];
  const questions = [];
  fs.readdirSync(dp, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .forEach(s => {
      const sp = path.join(dp, s.name);
      fs.readdirSync(sp).filter(f => f.endsWith('.json')).sort().forEach(f => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(sp, f), 'utf8'));
          if (Array.isArray(data)) {
            data.forEach(q => questions.push({
              question: q.question,
              questionHtml: marked.parse(q.question || ''),
              options: q.options || [],
              optionsHtml: (q.options || []).map(o => marked.parse(o)),
              correct: q.correct,
              explanation: q.explanation || '',
              explanationHtml: marked.parse(q.explanation || ''),
              category: q.category || '',
              domainId,
              setId: s.name,
            }));
          }
        } catch {}
      });
    });
  return questions;
}

function distributeByWeight(weights, total) {
  const domains  = Object.keys(weights);
  const weightSum = domains.reduce((s, d) => s + weights[d], 0);
  const exact    = domains.map(d => (weights[d] / weightSum) * total);
  const floors   = exact.map(Math.floor);
  const allocated = floors.reduce((s, v) => s + v, 0);
  const order    = exact.map((v, i) => ({ i, frac: v - floors[i] })).sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < total - allocated; k++) floors[order[k].i]++;
  const result = {};
  domains.forEach((d, i) => { result[d] = floors[i]; });
  return result;
}

function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// GET /api/quiz/random?count=30
app.get('/api/quiz/random', (req, res) => {
  try {
    const count = Math.max(1, Math.min(parseInt(req.query.count, 10) || 30, 500));
    const domainDirs = fs.readdirSync(ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory() && isDomain(e.name))
      .map(e => e.name)
      .filter(d => DOMAIN_EXAM_WEIGHTS[d]);

    const weights = {};
    domainDirs.forEach(d => { weights[d] = DOMAIN_EXAM_WEIGHTS[d]; });
    const dist = distributeByWeight(weights, count);

    const selected = [];
    for (const domainId of domainDirs) {
      const needed = dist[domainId] || 0;
      if (!needed) continue;
      const pool = shuffleArr(loadAllMcqForDomain(domainId));
      selected.push(...pool.slice(0, Math.min(needed, pool.length)));
    }
    res.json(shuffleArr(selected));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Hard Mode endpoint ────────────────────────────────────────────────────────

const HARD_MODE_DIR = path.join(ROOT, 'hard-mode');

function loadAllHardModeQuestions() {
  if (!fs.existsSync(HARD_MODE_DIR)) return [];
  const questions = [];
  fs.readdirSync(HARD_MODE_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && isDomain(e.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(e => {
      const dp = path.join(HARD_MODE_DIR, e.name);
      fs.readdirSync(dp).filter(f => f.endsWith('.json')).sort().forEach(f => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(dp, f), 'utf8'));
          if (Array.isArray(data)) {
            data.forEach(q => questions.push({
              question: q.question,
              questionHtml: marked.parse(q.question || ''),
              options: q.options || [],
              optionsHtml: (q.options || []).map(o => marked.parse(o)),
              correct: q.correct,
              explanation: q.explanation || '',
              explanationHtml: marked.parse(q.explanation || ''),
              category: q.category || '',
              domainId: e.name,
              setId: null,
            }));
          }
        } catch {}
      });
    });
  return questions;
}

// GET /api/hard-mode/random?count=30
app.get('/api/hard-mode/random', (req, res) => {
  try {
    const count = Math.max(1, Math.min(parseInt(req.query.count, 10) || 30, 500));
    const all = loadAllHardModeQuestions();
    if (!all.length) return res.json([]);

    // Group by domain and distribute by exam weight
    const byDomain = {};
    all.forEach(q => {
      if (!byDomain[q.domainId]) byDomain[q.domainId] = [];
      byDomain[q.domainId].push(q);
    });

    const availableDomains = Object.keys(byDomain).filter(d => DOMAIN_EXAM_WEIGHTS[d]);
    const weights = {};
    availableDomains.forEach(d => { weights[d] = DOMAIN_EXAM_WEIGHTS[d]; });
    const dist = distributeByWeight(weights, Math.min(count, all.length));

    const selected = [];
    for (const domainId of availableDomains) {
      const needed = dist[domainId] || 0;
      if (!needed) continue;
      const pool = shuffleArr([...byDomain[domainId]]);
      selected.push(...pool.slice(0, Math.min(needed, pool.length)));
    }
    res.json(shuffleArr(selected));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/sessions  — save a completed quiz/exam session
app.post('/api/sessions', (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.type) return res.status(400).json({ error: 'type required' });
    const sessions = loadSessions();
    const id = Date.now().toString();
    sessions.unshift({ id, createdAt: new Date().toISOString(), ...body });
    saveSessions(sessions);
    res.json({ ok: true, id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/sessions  — list all sessions newest-first
app.get('/api/sessions', (req, res) => {
  try { res.json(loadSessions()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/sessions/:id  — single session detail
app.get('/api/sessions/:id', (req, res) => {
  try {
    const session = loadSessions().find(s => s.id === req.params.id);
    if (!session) return res.status(404).json({ error: 'not found' });
    res.json(session);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/analytics  — MCQ performance by domain and tag
app.get('/api/analytics', (req, res) => {
  try {
    const mcqProg = loadMcqProgress();
    const domainMap = {};
    const tagMap    = {};

    const domainDirs = fs.readdirSync(ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory() && isDomain(e.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(e => e.name);

    for (const domainId of domainDirs) {
      domainMap[domainId] = { right: 0, wrong: 0, answered: 0 };
      const dp = safe(domainId);
      const setDirs = fs.readdirSync(dp, { withFileTypes: true })
        .filter(e => e.isDirectory()).map(e => e.name);

      for (const setId of setDirs) {
        const sp  = path.join(dp, setId);
        const key = `${domainId}/${setId}`;
        const prog = mcqProg[key] || {};
        const files = fs.readdirSync(sp).filter(f => f.endsWith('.json')).sort();
        let qi = 0;

        for (const f of files) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(sp, f), 'utf8'));
            if (!Array.isArray(data)) continue;
            for (const q of data) {
              const p = prog[qi];
              if (p && (p.right || 0) + (p.wrong || 0) > 0) {
                const r = p.right || 0, w = p.wrong || 0;
                domainMap[domainId].right   += r;
                domainMap[domainId].wrong   += w;
                domainMap[domainId].answered++;
                parseTags(q.category || '').forEach(tag => {
                  if (!tagMap[tag]) tagMap[tag] = { right: 0, wrong: 0, answered: 0 };
                  tagMap[tag].right   += r;
                  tagMap[tag].wrong   += w;
                  tagMap[tag].answered++;
                });
              }
              qi++;
            }
          } catch {}
        }
      }
    }

    const byDomain = domainDirs.map(domainId => ({
      domainId,
      name: domainLabel(domainId),
      examWeight: DOMAIN_EXAM_WEIGHTS[domainId] || 0,
      ...domainMap[domainId],
    }));

    const byTag = Object.entries(tagMap)
      .map(([tag, v]) => ({ tag, ...v }))
      .sort((a, b) => (b.right + b.wrong) - (a.right + a.wrong))
      .slice(0, 60);

    const answered = byDomain.filter(d => d.answered > 0);
    const weightedScore = answered.length > 0
      ? Math.round(
          answered.reduce((s, d) => s + (d.right / (d.right + d.wrong)) * d.examWeight, 0) /
          answered.reduce((s, d) => s + d.examWeight, 0) * 100
        )
      : null;

    res.json({ byDomain, byTag, weightedScore });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Tag helpers ───────────────────────────────────────────────────────────────

function parseTags(str) {
  return (str || '').split(',').map(t => t.trim()).filter(Boolean);
}
function parseTagsLower(str) {
  return parseTags(str).map(t => t.toLowerCase());
}

function extractTagsForSet(domainId, setId) {
  const sp = safe(domainId, setId);
  if (!fs.existsSync(sp)) return {};
  const counts = {};
  fs.readdirSync(sp).filter(f => f.endsWith('.tsv')).forEach(f => {
    const lines = fs.readFileSync(path.join(sp, f), 'utf8').trim().split('\n');
    lines.slice(1).forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 3) parseTags(parts[2]).forEach(t => { counts[t] = (counts[t] || 0) + 1; });
    });
  });
  fs.readdirSync(sp).filter(f => f.endsWith('.json')).forEach(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(sp, f), 'utf8'));
      if (Array.isArray(data)) data.forEach(q => parseTags(q.category).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    } catch {}
  });
  return counts;
}

function computeTagPerf(domainId, setId) {
  const sp = safe(domainId, setId);
  if (!fs.existsSync(sp)) return {};
  const key = `${domainId}/${setId}`;
  const fcProg  = loadAllProgress()[key]  || {};
  const mcqProg = loadMcqProgress()[key]  || {};
  const perf = {};
  const add = (tag, r, w) => {
    if (!perf[tag]) perf[tag] = { right: 0, wrong: 0 };
    perf[tag].right += r; perf[tag].wrong += w;
  };
  // Flashcards
  fs.readdirSync(sp).filter(f => f.endsWith('.tsv')).forEach(f => {
    const lines = fs.readFileSync(path.join(sp, f), 'utf8').trim().split('\n');
    lines.slice(1).forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const p = fcProg[parts[0].trim()];
        if (p) parseTags(parts[2]).forEach(t => add(t, p.right || 0, p.wrong || 0));
      }
    });
  });
  // MCQ
  let idx = 0;
  fs.readdirSync(sp).filter(f => f.endsWith('.json')).sort().forEach(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(sp, f), 'utf8'));
      if (Array.isArray(data)) data.forEach(q => {
        const p = mcqProg[idx++];
        if (p) parseTags(q.category).forEach(t => add(t, p.right || 0, p.wrong || 0));
      });
    } catch {}
  });
  return perf;
}

// GET /api/domains/:domain/sets/:set/tags
app.get('/api/domains/:domain/sets/:set/tags', (req, res) => {
  try {
    const { domain, set } = req.params;
    const counts = extractTagsForSet(domain, set);
    const perf   = computeTagPerf(domain, set);
    const tags = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, ...(perf[name] || { right: 0, wrong: 0 }) }));
    res.json(tags);
  } catch { res.status(400).end(); }
});

// GET /api/tags — aggregated across every domain and set (global)
app.get('/api/tags', (req, res) => {
  try {
    const tagCounts = {};
    const tagPerf   = {};
    fs.readdirSync(ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory() && isDomain(e.name))
      .forEach(e => {
        const dp = path.join(ROOT, e.name);
        fs.readdirSync(dp, { withFileTypes: true })
          .filter(s => s.isDirectory())
          .forEach(s => {
            const counts = extractTagsForSet(e.name, s.name);
            const perf   = computeTagPerf(e.name, s.name);
            Object.entries(counts).forEach(([tag, count]) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + count;
            });
            Object.entries(perf).forEach(([tag, p]) => {
              if (!tagPerf[tag]) tagPerf[tag] = { right: 0, wrong: 0 };
              tagPerf[tag].right += p.right;
              tagPerf[tag].wrong += p.wrong;
            });
          });
      });
    const tags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, ...(tagPerf[name] || { right: 0, wrong: 0 }) }));
    res.json(tags);
  } catch { res.status(400).end(); }
});

// GET /api/domains/:domain/tags — aggregated across all sets in the domain
app.get('/api/domains/:domain/tags', (req, res) => {
  try {
    const domain = req.params.domain;
    const dp = safe(domain);
    if (!fs.existsSync(dp)) return res.json([]);
    const tagCounts = {};
    const tagPerf   = {};
    fs.readdirSync(dp, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .forEach(s => {
        const counts = extractTagsForSet(domain, s.name);
        const perf   = computeTagPerf(domain, s.name);
        Object.entries(counts).forEach(([tag, count]) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + count;
        });
        Object.entries(perf).forEach(([tag, p]) => {
          if (!tagPerf[tag]) tagPerf[tag] = { right: 0, wrong: 0 };
          tagPerf[tag].right += p.right;
          tagPerf[tag].wrong += p.wrong;
        });
      });
    const tags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, ...(tagPerf[name] || { right: 0, wrong: 0 }) }));
    res.json(tags);
  } catch { res.status(400).end(); }
});

// GET /api/search?q=term
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (q.length < 2) return res.json({ domains: [], sets: [], tags: [] });
  const domains = [], sets = [], tagMap = {};
  fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && isDomain(e.name))
    .forEach(e => {
      if (domainLabel(e.name).toLowerCase().includes(q)) domains.push({ id: e.name, name: domainLabel(e.name) });
      const dp = path.join(ROOT, e.name);
      fs.readdirSync(dp, { withFileTypes: true }).filter(s => s.isDirectory()).forEach(s => {
        if (setLabel(s.name).toLowerCase().includes(q)) sets.push({ domainId: e.name, id: s.name, name: setLabel(s.name) });
        try {
          Object.entries(extractTagsForSet(e.name, s.name)).forEach(([tag, cnt]) => {
            if (tag.toLowerCase().includes(q)) tagMap[tag] = (tagMap[tag] || 0) + cnt;
          });
        } catch {}
      });
    });
  const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));
  res.json({ domains: domains.slice(0, 4), sets: sets.slice(0, 6), tags });
});

// GET /api/tag/:tagname/cards  — all flashcards across the app with this tag
app.get('/api/tag/:tagname/cards', (req, res) => {
  try {
    const tag = req.params.tagname.toLowerCase();  // compare lowercase
    const results = [];
    fs.readdirSync(ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory() && isDomain(e.name))
      .forEach(e => {
        const dp = path.join(ROOT, e.name);
        fs.readdirSync(dp, { withFileTypes: true }).filter(s => s.isDirectory()).forEach(s => {
          const sp = path.join(dp, s.name);
          if (!fs.existsSync(sp)) return;
          // Flashcards from TSV
          fs.readdirSync(sp).filter(f => f.endsWith('.tsv')).forEach(f => {
            const lines = fs.readFileSync(path.join(sp, f), 'utf8').trim().split('\n');
            lines.slice(1).forEach(line => {
              const parts = line.split('\t');
              if (parts.length >= 2 && parseTagsLower(parts[2]).includes(tag)) {
                const q = parts[0].trim();
                const a = parts[1].trim();
                const unescape = str => str.replace(/\\n/g, '\n');
                results.push({
                  domainId: e.name, setId: s.name,
                  question: q,
                  questionHtml: marked.parse(unescape(q)),
                  answerHtml:   marked.parse(unescape(a)),
                  category: (parts[2] || '').trim(),
                });
              }
            });
          });
        });
      });
    res.json(results);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nCISSP Flashcards → http://localhost:${PORT}\n`);
});
