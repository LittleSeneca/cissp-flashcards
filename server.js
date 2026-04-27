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

// Progress is stored in a single root-level progress.json, keyed by "domainId/setId".
// This keeps it completely outside the content folders so git operations never touch it.
const PROGRESS_FILE = path.join(ROOT, 'progress.json');

function loadAllProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); }
  catch { return {}; }
}

function saveAllProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf8');
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
      return { id: e.name, name: domainLabel(e.name), sets: setDirs.length, totalCards };
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
          cardCount: countCards(sp), hasReadme: fs.existsSync(readmePath),
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
          return [{ question: parts[0].trim(), answer: parts[1].trim(), category: (parts[2] || '').trim() }];
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
    entry.lastSeen = new Date().toISOString().slice(0, 10);
    all[key][question] = entry;
    saveAllProgress(all);
    res.json({ ok: true, entry });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/progress  — per-set progress summaries for all sets that have data
app.get('/api/progress', (req, res) => {
  const all = loadAllProgress();
  const out = {};
  for (const [key, progress] of Object.entries(all)) {
    let mastered = 0, struggling = 0, shaky = 0;
    for (const p of Object.values(progress)) {
      if (p.right > 0 && p.wrong === 0) mastered++;
      else if (p.right === 0 && p.wrong > 0) struggling++;
      else if (p.right > 0 && p.wrong > 0) shaky++;
    }
    out[key] = { studied: mastered + struggling + shaky, mastered, struggling, shaky };
  }
  res.json(out);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nCISSP Flashcards → http://localhost:${PORT}\n`);
});
