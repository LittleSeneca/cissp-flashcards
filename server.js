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
      fm[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
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
    res.json({ html: marked(fs.readFileSync(p, 'utf8')) });
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
    res.json({ html: marked(fs.readFileSync(p, 'utf8')) });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nCISSP Flashcards → http://localhost:${PORT}\n`);
});
