// ── Domain descriptions (home page cards) ────────────────────────────────────
const DOMAIN_DESCRIPTIONS = {
  '01-security-and-risk-management': 'Covers risk management frameworks, governance, legal and regulatory compliance, business continuity planning, and the ISC² Code of Ethics. The heaviest domain at ~15% of the exam.',
  '02-asset-security': 'Focuses on classifying and protecting information assets throughout their lifecycle, including data ownership roles, privacy requirements, retention policies, and secure disposal.',
  '03-security-architecture-and-engineering': 'Covers security models, cryptography, PKI, physical security, cloud architecture, and applying engineering principles such as defense in depth and least privilege to systems design.',
  '04-communication-and-network-security': 'Addresses secure network design across all OSI layers, including firewalls, VPNs, wireless protocols, network attacks, and protecting data in transit.',
  '05-identity-and-access-management': 'Covers authentication factors, authorization models (MAC, DAC, RBAC, ABAC), identity federation, SSO, MFA, and privileged access management.',
  '06-security-assessment-and-testing': 'Focuses on vulnerability assessments, penetration testing methodologies, security audits, code review techniques, and building a continuous testing program.',
  '07-security-operations': 'Covers the incident response lifecycle, digital forensics, evidence handling, SIEM and logging, patch and configuration management, and disaster recovery operations.',
  '08-software-development-security': 'Addresses secure SDLC integration, DevSecOps practices, OWASP Top 10 vulnerabilities, SAST/DAST tooling, and supply chain security.',
};

// ── Icons (inline SVG) ────────────────────────────────────────────────────────
const ICONS = {
  domain: `<svg class="nav-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 1L2 3.8V8.5c0 3 2.4 5.6 6 6.5 3.6-.9 6-3.5 6-6.5V3.8L8 1z"/></svg>`,
  set:    `<svg class="nav-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="5.5" width="10" height="8.5" rx="1.5"/><rect x="1" y="3.5" width="10" height="8.5" rx="1.5" opacity="0.28"/></svg>`,
};

// ── State ─────────────────────────────────────────────────────────────────────
let studyState          = null;
let quizState           = null;
let navData             = null;
let progressSummary     = null;
let mcqProgressSummary  = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const appEl    = document.getElementById('app');
const bcEl     = document.getElementById('breadcrumb');
const leftNavEl = document.getElementById('left-nav');

// ── Router ────────────────────────────────────────────────────────────────────
function route() {
  const hash = (location.hash || '#/').slice(1);
  const parts = hash.split('/');
  // ['', view, domainId, 'set', setId, 'study', filter]
  const view     = parts[1] || '';
  const domainId = parts[2] || '';
  const setId    = parts[4] || '';
  const action   = parts[5] || '';
  const filter   = parts[6] || 'all';

  if (!view)                                                        return showHome();
  if (view === 'domain' && domainId && !setId)                      return showDomain(domainId);
  if (view === 'domain' && domainId && setId && !action)            return showSet(domainId, setId);
  if (view === 'domain' && domainId && setId && action === 'study') return showStudy(domainId, setId, filter);
  if (view === 'domain' && domainId && setId && action === 'quiz')  return showQuiz(domainId, setId, filter);
  showHome();
}

window.addEventListener('hashchange', () => { renderLeftNav(); route(); });
window.addEventListener('DOMContentLoaded', () => { loadNav(); route(); });

// ── Left nav ──────────────────────────────────────────────────────────────────
async function loadNav() {
  try {
    [navData, progressSummary, mcqProgressSummary] = await Promise.all([
      api('/api/nav'),
      api('/api/progress').catch(() => ({})),
      api('/api/mcq-progress-summary').catch(() => ({})),
    ]);
    renderLeftNav();
  } catch { /* nav is non-critical */ }
}

async function refreshProgress() {
  try {
    [progressSummary, mcqProgressSummary] = await Promise.all([
      api('/api/progress'),
      api('/api/mcq-progress-summary').catch(() => ({})),
    ]);
  } catch { /* non-critical */ }
}

function navShortName(fullLabel) {
  // "Domain 1: Security And Risk Management" → "1 · Security And Risk Management"
  return fullLabel.replace(/^Domain (\d+):\s*/, '$1 · ');
}

function renderLeftNav() {
  if (!navData || !leftNavEl) return;
  const hash   = (location.hash || '#/').slice(1);
  const parts  = hash.split('/');
  const curDom = parts[2] || '';
  const curSet = parts[4] || '';

  const items = navData.map(domain => {
    const domActive = curDom === domain.id && !curSet;
    const anySetActive = curDom === domain.id && !!curSet;

    const sets = domain.sets.map(set => {
      const active     = anySetActive && curSet === set.id;
      const tierClass  = set.tier ? ` tier-${set.tier}` : '';
      const totalCount = set.cardCount + (set.mcqCount ?? 0);
      const badgeText  = set.tier ? `T${set.tier} · ${totalCount}` : `${totalCount}`;
      const key = `${domain.id}/${set.id}`;

      // Combine flashcard + MCQ progress for the bar
      const fc  = progressSummary?.[key]    ?? { mastered: 0, shaky: 0, struggling: 0, studied: 0 };
      const mcq = mcqProgressSummary?.[key] ?? { mastered: 0, shaky: 0, struggling: 0, studied: 0 };
      const combined = {
        mastered:   fc.mastered   + mcq.mastered,
        shaky:      fc.shaky      + mcq.shaky,
        struggling: fc.struggling + mcq.struggling,
        studied:    fc.studied    + mcq.studied,
      };
      const bar = progressBarHtml(combined, totalCount, 'nav-set-bar');

      return `<a class="nav-item nav-set${active ? ' is-active' : ''}"
               href="#/domain/${domain.id}/set/${set.id}">
        ${ICONS.set}
        <span class="nav-label">${esc(set.name)}</span>
        <span class="nav-badge${tierClass}">${badgeText}</span>
      </a>${bar}`;
    }).join('');

    return `<a class="nav-item nav-domain${domActive ? ' is-active' : ''}"
             href="#/domain/${domain.id}">
      ${ICONS.domain}
      <span class="nav-label">${esc(navShortName(domain.name))}</span>
    </a>
    ${sets}`;
  }).join('');

  leftNavEl.innerHTML = items;
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────
async function api(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

async function post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => r.json());
}

// ── Misc helpers ──────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function enc(s) { return encodeURIComponent(s); }

const ACRONYMS = new Set([
  'gdpr','bcp','dr','iam','pki','ssl','tls','vpn','ids','ips','siem',
  'dlp','mfa','soc','grc','rbac','dac','mac','acl','ccpa','hipaa','pci',
  'dss','nist','iso','bia','rpo','rto','mtd','mto','dpo','eu','us','uk',
  'api','sdk','dns','http','https','ip','tcp','udp','osi','lan','wan',
  'wlan','ssh','ftp','sftp','smtp','ldap','saml','oauth','jwt',
]);
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
function setLabel(id) { return labelFromSlug(id); }

function crumbs(items) {
  bcEl.innerHTML = items.map((item, i) =>
    i < items.length - 1
      ? `<a href="${item.href}">${esc(item.label)}</a><span class="sep">›</span>`
      : `<span class="crumb-current">${esc(item.label)}</span>`
  ).join('');
}

function seenTag(lastSeen) {
  if (!lastSeen) return `<span class="seen-tag is-new">New</span>`;
  const [yr, mo, dy] = lastSeen.split('-').map(Number);
  const label = new Date(yr, mo - 1, dy).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `<span class="seen-tag">Last seen ${label}</span>`;
}

// ── Text fitting ─────────────────────────────────────────────────────────────
function makeProbe(html, width) {
  const fontFamily = getComputedStyle(document.body).fontFamily;
  const p = document.createElement('div');
  p.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;`
    + `width:${width}px;height:auto;overflow:visible;padding:0;margin:0;font-family:${fontFamily};`;
  p.innerHTML = html;
  // Strip browser default margins from inner block elements
  p.querySelectorAll('p,ul,ol,li,h1,h2,h3,h4,h5,h6').forEach(c => {
    c.style.margin = '0'; c.style.padding = '0';
  });
  document.body.appendChild(p);
  return p;
}

function fitFcText(sel, maxSize) {
  const el   = document.querySelector(sel);
  const face = el?.closest('.fc-face');
  if (!el || !face) return;
  const maxW = face.clientWidth  - 64;   // face has 2rem padding each side
  const maxH = face.clientHeight - 130;  // room for seen-tag, stats, nudge
  if (maxW <= 0 || maxH <= 0) return;

  const probe = makeProbe(el.innerHTML, maxW);
  let lo = 14, hi = maxSize;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    probe.style.fontSize = mid + 'px';
    probe.style.lineHeight = '1.5';
    if (probe.offsetHeight <= maxH) lo = mid; else hi = mid;
  }
  document.body.removeChild(probe);
  el.style.fontSize = lo + 'px';
  el.style.lineHeight = '1.5';
}

function fitCardText() {
  requestAnimationFrame(() => {
    fitFcText('.fc-face.fc-front .fc-text', 52);
    fitFcText('.fc-face.fc-back  .fc-text', 36);

    // Quiz: card grows in height so just set a comfortable larger size
    const qz = document.querySelector('.qz-question');
    if (qz) { qz.style.fontSize = '1.125rem'; qz.style.lineHeight = '1.65'; }
  });
}

// ── Progress bar helpers ──────────────────────────────────────────────────────
function progressBarHtml(keyOrSummary, cardCount, cssClass) {
  if (cardCount === 0) return '';
  const s          = typeof keyOrSummary === 'string' ? progressSummary?.[keyOrSummary] : keyOrSummary;
  const mastered   = s?.mastered   ?? 0;
  const shaky      = s?.shaky      ?? 0;
  const struggling = s?.struggling ?? 0;
  const unseen     = Math.max(0, cardCount - (s?.studied ?? 0));
  const segs = [
    [mastered,   '#16a34a'],
    [shaky,      '#f59e0b'],
    [struggling, '#dc2626'],
    [unseen,     '#e5e7eb'],
  ].filter(([n]) => n > 0)
   .map(([n, c]) => `<div style="flex:${n};background:${c}"></div>`)
   .join('');
  return `<div class="${cssClass}">${segs || '<div style="flex:1;background:#e5e7eb"></div>'}</div>`;
}

function domainProgressAgg(domainId) {
  let mastered = 0, shaky = 0, struggling = 0, studied = 0, mostlyWrong = 0;
  for (const summary of [progressSummary, mcqProgressSummary]) {
    if (summary) {
      for (const [key, s] of Object.entries(summary)) {
        if (key.startsWith(domainId + '/')) {
          mastered    += s.mastered;
          shaky       += s.shaky;
          struggling  += s.struggling;
          studied     += s.studied;
          mostlyWrong += s.mostlyWrong ?? 0;
        }
      }
    }
  }
  return { mastered, shaky, struggling, studied, mostlyWrong };
}

function globalProgressAgg() {
  let mastered = 0, shaky = 0, struggling = 0, studied = 0, mostlyWrong = 0;
  for (const summary of [progressSummary, mcqProgressSummary]) {
    if (summary) {
      for (const s of Object.values(summary)) {
        mastered    += s.mastered;
        shaky       += s.shaky;
        struggling  += s.struggling;
        studied     += s.studied;
        mostlyWrong += s.mostlyWrong ?? 0;
      }
    }
  }
  return { mastered, shaky, struggling, studied, mostlyWrong };
}

// ── Filter definitions & logic ────────────────────────────────────────────────
const FILTERS = [
  { id: 'all',          label: 'All Cards',    desc: 'Every card in the set',                       color: '#4a4a4a', alwaysEnabled: true, match: ()  => true },
  { id: 'any-wrong',    label: 'Any Wrong',    desc: 'Answered wrong at least once',                color: '#ea580c', match: (p) => p && p.wrong >= 1 },
  { id: 'mostly-wrong', label: 'Mostly Wrong', desc: 'More wrong answers than right',               color: '#dc2626', match: (p) => p && p.wrong > p.right },
  { id: 'shaky',        label: 'Shaky',        desc: 'Gotten right AND wrong — not locked in yet',  color: '#d97706', match: (p) => p && p.right >= 1 && p.wrong >= 1 },
];

function getFilter(id) { return FILTERS.find(f => f.id === id) ?? FILTERS[0]; }

// ── Sidebar colour helpers ─────────────────────────────────────────────────────
function rightShade(n) {
  if (n === 1) return '#86efac';
  if (n === 2) return '#22c55e';
  return '#15803d';
}
function wrongShade(n) {
  if (n === 1) return '#fca5a5';
  if (n === 2) return '#ef4444';
  return '#b91c1c';
}

function buildSidebarHtml(state) {
  const { allCards, cards: filtered, progress, index, done } = state;
  const currentQ = !done ? filtered[index]?.question : null;

  const dots = allCards.map((card, allIdx) => {
    const p         = progress[card.question];
    const r         = p?.right ?? 0;
    const w         = p?.wrong ?? 0;
    const filtIdx   = filtered.findIndex(c => c.question === card.question);
    const inFilter  = filtIdx !== -1;
    const isCurrent = card.question === currentQ;

    let stateCls = '';
    if (r > 0 && w === 0)      stateCls = 'fc-dot-right';
    else if (w > 0 && r === 0) stateCls = 'fc-dot-wrong';
    else if (r > 0 && w > 0)   stateCls = 'fc-dot-shaky';

    const cls   = ['fc-dot', stateCls, isCurrent && 'fc-dot-current', !inFilter && 'fc-dot-dim'].filter(Boolean).join(' ');
    const click = inFilter ? `onclick="jumpToCard(${filtIdx})"` : '';
    const tip   = esc(card.question.length > 70 ? card.question.slice(0,70)+'…' : card.question);

    return `<div class="${cls}" ${click} title="${tip}">${allIdx + 1}</div>`;
  }).join('');

  return `<div class="sidebar-title">Cards <span class="sidebar-count">${allCards.length}</span></div>
    <div class="fc-dot-grid">${dots}</div>`;
}

function applyFilter(cards, progress, filterId) {
  const f = getFilter(filterId);
  if (filterId === 'all') return cards;
  return cards.filter(c => f.match(progress[c.question]));
}

// ── Activity chart ────────────────────────────────────────────────────────────
function buildActivityChart(days, height = 78) {
  const maxVal = Math.max(...days.flatMap(d => [d.answered ?? 0, d.right ?? 0, d.shaky ?? 0, d.mostlyWrong ?? 0]), 0);

  if (maxVal === 0) {
    return `<div class="activity-empty">No activity yet — start studying to see your progress here.</div>`;
  }

  const W = 560, H = height;
  const ml = 28, mr = 12, mt = 8, mb = 22;
  const pw = W - ml - mr;
  const ph = H - mt - mb;

  function niceMax(n) {
    if (n <= 5)  return 5;
    if (n <= 10) return 10;
    if (n <= 20) return 20;
    if (n <= 50) return 50;
    return Math.ceil(n / 10) * 10;
  }

  const top  = niceMax(maxVal);
  const n    = days.length;
  const xOf  = i => ml + (n > 1 ? (i / (n - 1)) * pw : pw / 2);
  const yOf  = v => mt + ph - (v / top) * ph;
  const base = yOf(0);

  const pts = (key) => days.map((d, i) => `${xOf(i)},${yOf(d[key] ?? 0)}`).join(' ');
  const area = (key, col) => {
    const path = `M ${xOf(0)} ${base} ` + days.map((d, i) => `L ${xOf(i)} ${yOf(d[key] ?? 0)}`).join(' ') + ` L ${xOf(n-1)} ${base} Z`;
    return `<path d="${path}" fill="${col}" fill-opacity="0.07"/>`;
  };
  const line = (key, col, w, dash = '') =>
    `<polyline points="${pts(key)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const dots = (key, col, r) => days.map((d, i) => (d[key] ?? 0) > 0
    ? `<circle cx="${xOf(i)}" cy="${yOf(d[key])}" r="${r}" fill="${col}"/>` : '').join('');

  const gridVals = [0, Math.round(top / 2), top];
  const grid = gridVals.map(v => {
    const y = yOf(v);
    return `<line x1="${ml}" y1="${y}" x2="${W - mr}" y2="${y}" stroke="#f3f4f6" stroke-width="1"/>
            <text x="${ml - 4}" y="${y + 3}" text-anchor="end" font-size="6" fill="#9ca3af">${v}</text>`;
  }).join('');

  const labelStep = Math.max(1, Math.ceil(n / 8));
  const xLabels = days.map((d, i) => {
    if (i % labelStep !== 0 && i !== n - 1) return '';
    const [yr, mo, dy] = d.date.split('-').map(Number);
    const label = new Date(yr, mo - 1, dy).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `<text x="${xOf(i)}" y="${H - 2}" text-anchor="middle" font-size="6" fill="#9ca3af">${label}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="activity-svg">
    ${grid}
    <line x1="${ml}" y1="${base}" x2="${W - mr}" y2="${base}" stroke="#e5e7eb" stroke-width="1"/>
    ${area('answered', '#4a4a4a')}
    ${area('right',    '#16a34a')}
    ${line('answered',    '#4a4a4a', 1.5)}
    ${line('right',       '#16a34a', 1.5)}
    ${line('shaky',       '#f59e0b', 1,   '4 2')}
    ${line('mostlyWrong', '#dc2626', 1,   '4 2')}
    ${dots('answered',    '#4a4a4a', 2)}
    ${dots('right',       '#16a34a', 2)}
    ${dots('shaky',       '#f59e0b', 1.5)}
    ${dots('mostlyWrong', '#dc2626', 1.5)}
    ${xLabels}
  </svg>`;
}

// ── Pie chart ─────────────────────────────────────────────────────────────────
const PIE_SEGMENTS = [
  { id: 'unseen',     label: 'Unseen',     color: '#d1d5db', test: (p) => !p || (p.right === 0 && p.wrong === 0) },
  { id: 'mastered',   label: 'Mastered',   color: '#16a34a', test: (p) => p && p.right > 0 && p.wrong === 0 },
  { id: 'shaky',      label: 'Shaky',      color: '#f59e0b', test: (p) => p && p.right >= 1 && p.wrong >= 1 },
  { id: 'struggling', label: 'Struggling', color: '#dc2626', test: (p) => p && p.right === 0 && p.wrong >= 1 },
];

function buildPieData(cards, progress) {
  const counts = Object.fromEntries(PIE_SEGMENTS.map(s => [s.id, 0]));
  for (const card of cards) {
    const p = progress[card.question];
    for (const seg of PIE_SEGMENTS) {
      if (seg.test(p)) { counts[seg.id]++; break; }
    }
  }
  return PIE_SEGMENTS.map(s => ({ ...s, value: counts[s.id] }));
}

function buildPieSVG(segments, total) {
  const cx = 80, cy = 80, ro = 68, ri = 46;

  if (total === 0) {
    return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${ro}" fill="#e5e7eb"/>
      <circle cx="${cx}" cy="${cy}" r="${ri}" fill="white"/>
    </svg>`;
  }

  const active = segments.filter(s => s.value > 0);
  let arcs = '';

  if (active.length === 1) {
    arcs = `<circle cx="${cx}" cy="${cy}" r="${ro}" fill="${active[0].color}"/>`;
  } else {
    let angle = -Math.PI / 2;
    for (const seg of segments) {
      if (!seg.value) continue;
      const frac = seg.value / total;
      const a1 = angle, a2 = angle + frac * 2 * Math.PI;
      angle = a2;
      const large = frac > 0.5 ? 1 : 0;
      const [c1, s1, c2, s2] = [Math.cos(a1), Math.sin(a1), Math.cos(a2), Math.sin(a2)];
      arcs += `<path fill="${seg.color}" stroke="white" stroke-width="2"
        d="M ${cx+ro*c1} ${cy+ro*s1}
           A ${ro} ${ro} 0 ${large} 1 ${cx+ro*c2} ${cy+ro*s2}
           L ${cx+ri*c2} ${cy+ri*s2}
           A ${ri} ${ri} 0 ${large} 0 ${cx+ri*c1} ${cy+ri*s1} Z"/>`;
    }
  }

  return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    ${arcs}
    <circle cx="${cx}" cy="${cy}" r="${ri}" fill="white"/>
    <text x="${cx}" y="${cy-4}"  text-anchor="middle" font-size="26" font-weight="700" fill="#1c2028" font-family="system-ui,sans-serif">${total}</text>
    <text x="${cx}" y="${cy+15}" text-anchor="middle" font-size="11"                   fill="#6b7280" font-family="system-ui,sans-serif">cards</text>
  </svg>`;
}

function buildActivityCard(activityDays, agg) {
  return `
    <div class="activity-card">
      <div class="activity-header">
        <span class="activity-title">Study Activity — All Time</span>
        <div class="activity-legend">
          <span class="activity-dot" style="background:#4a4a4a"></span>Answered
          <span class="activity-dot" style="background:#16a34a"></span>Right
          <span class="activity-dot" style="background:#f59e0b"></span>Shaky
          <span class="activity-dot" style="background:#dc2626"></span>Mostly Wrong
        </div>
      </div>
      <div class="activity-stats">
        <div class="act-stat">
          <span class="act-stat-val">${agg.studied}</span>
          <span class="act-stat-label">Answered</span>
        </div>
        <div class="act-stat act-green">
          <span class="act-stat-val">${agg.mastered}</span>
          <span class="act-stat-label">Right</span>
        </div>
        <div class="act-stat act-amber">
          <span class="act-stat-val">${agg.shaky}</span>
          <span class="act-stat-label">Shaky</span>
        </div>
        <div class="act-stat act-red">
          <span class="act-stat-val">${agg.mostlyWrong}</span>
          <span class="act-stat-label">Mostly Wrong</span>
        </div>
      </div>
      ${buildActivityChart(activityDays)}
    </div>`;
}

// ── Views ─────────────────────────────────────────────────────────────────────

async function showHome() {
  crumbs([]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [domains, activityDays] = await Promise.all([
      api('/api/domains'),
      api('/api/activity?all=1').catch(() => []),
      refreshProgress(),
    ]);

    const gAgg = globalProgressAgg();
    const activityCard = buildActivityCard(activityDays, gAgg);

    appEl.innerHTML = `
      ${activityCard}
      <div class="domain-list">
        ${domains.map(d => {
          const [num, ...rest] = d.name.split(': ');
          const totalQ = d.totalCards + (d.totalMcq ?? 0);
          const agg  = domainProgressAgg(d.id);
          const studiedCount = agg.studied;
          const desc = DOMAIN_DESCRIPTIONS[d.id] || '';
          const progressNote = studiedCount === 0
            ? '<div class="not-started-note">Not started</div>'
            : `<div class="set-progress-note">${studiedCount}/${totalQ} seen · ${agg.mastered} mastered${agg.struggling + agg.shaky > 0 ? ` · ${agg.struggling + agg.shaky} need work` : ''}</div>`;
          const bar = progressBarHtml(agg, totalQ, 'set-progress-bar');
          return `<a class="domain-card" href="#/domain/${d.id}">
            <div class="domain-card-header">
              <div class="domain-num">${esc(num)}</div>
              <div class="card-meta">${d.sets} sections · ${totalQ} questions</div>
            </div>
            <div class="card-title">${esc(rest.join(': '))}</div>
            <p class="domain-desc">${esc(desc)}</p>
            ${progressNote}
            ${bar}
          </a>`;
        }).join('')}
      </div>`;
  } catch (e) {
    appEl.innerHTML = `<p class="error">Could not load domains: ${esc(e.message)}</p>`;
  }
}

async function showDomain(domainId) {
  const label = domainLabel(domainId);
  crumbs([{ label }]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [sets, readmeData] = await Promise.all([
      api(`/api/domains/${enc(domainId)}/sets`),
      api(`/api/domains/${enc(domainId)}/readme`).catch(() => ({ html: null })),
      refreshProgress().then(() => renderLeftNav()),
    ]);

    const totalQ = sets.reduce((n, s) => n + s.cardCount + (s.mcqCount ?? 0), 0);
    const agg    = domainProgressAgg(domainId);
    const unseen = Math.max(0, totalQ - agg.studied);
    const domPieSegs = [
      { id: 'unseen',     label: 'Unseen',     color: '#d1d5db', value: unseen         },
      { id: 'mastered',   label: 'Mastered',   color: '#16a34a', value: agg.mastered   },
      { id: 'shaky',      label: 'Shaky',      color: '#f59e0b', value: agg.shaky      },
      { id: 'struggling', label: 'Struggling', color: '#dc2626', value: agg.struggling },
    ];
    const domPieSVG = buildPieSVG(domPieSegs, totalQ);
    const domOverview = `
      <div class="domain-overview">
        <div class="domain-overview-pie">${domPieSVG}</div>
        <div class="domain-overview-body">
          <div class="overview-stats">
            <div class="ov-stat">
              <span class="ov-val">${totalQ}</span>
              <span class="ov-label">Total</span>
            </div>
            <div class="ov-stat">
              <span class="ov-val">${agg.studied}</span>
              <span class="ov-label">Answered</span>
            </div>
            <div class="ov-stat ov-green">
              <span class="ov-val">${agg.mastered}</span>
              <span class="ov-label">Right</span>
            </div>
            <div class="ov-stat ov-amber">
              <span class="ov-val">${agg.shaky}</span>
              <span class="ov-label">Shaky</span>
            </div>
            <div class="ov-stat ov-red">
              <span class="ov-val">${agg.mostlyWrong}</span>
              <span class="ov-label">Mostly Wrong</span>
            </div>
          </div>
          ${progressBarHtml(agg, totalQ, 'domain-overview-bar')}
        </div>
      </div>`;
    appEl.innerHTML = `
      ${domOverview}
      <div class="domain-list">
        ${sets.length === 0
          ? '<p class="empty">No sections yet.</p>'
          : sets.map(s => {
            const TIER_LABEL = { 1: 'Tier 1 · Core', 2: 'Tier 2', 3: 'Tier 3 · Supplemental' };
            const tierLine = s.tier != null
              ? `<div class="tier-marker t${s.tier}">${TIER_LABEL[s.tier]}</div>` : '';
            const pKey   = `${domainId}/${s.id}`;
            const totalQ = s.cardCount + (s.mcqCount ?? 0);
            const fc  = progressSummary?.[pKey]    ?? { mastered: 0, shaky: 0, struggling: 0, studied: 0 };
            const mcq = mcqProgressSummary?.[pKey] ?? { mastered: 0, shaky: 0, struggling: 0, studied: 0 };
            const combined = {
              mastered:   fc.mastered   + mcq.mastered,
              shaky:      fc.shaky      + mcq.shaky,
              struggling: fc.struggling + mcq.struggling,
              studied:    fc.studied    + mcq.studied,
            };
            const meta = [
              `${totalQ} question${totalQ !== 1 ? 's' : ''}`,
              s.examWeight || '',
            ].filter(Boolean).join(' · ');
            const studiedCount = combined.studied;
            const progressNote = studiedCount === 0
              ? '<div class="not-started-note">Not started</div>'
              : `<div class="set-progress-note">${studiedCount}/${totalQ} seen &nbsp;·&nbsp; ${combined.mastered} mastered${combined.struggling + combined.shaky > 0 ? ` · ${combined.struggling + combined.shaky} need work` : ''}</div>`;
            const bar = progressBarHtml(combined, totalQ, 'set-progress-bar');
            return `<a class="domain-card" href="#/domain/${domainId}/set/${s.id}">
              <div class="domain-card-header">
                ${tierLine}
                <div class="card-meta">${meta}</div>
              </div>
              <div class="card-title">${esc(s.name)}</div>
              ${progressNote}
              ${bar}
            </a>`;
          }).join('')}
      </div>
      ${readmeData?.html ? `<div class="domain-guide readme">${readmeData.html}</div>` : ''}`;
  } catch (e) {
    appEl.innerHTML = `<p class="error">Could not load domain: ${esc(e.message)}</p>`;
  }
}

async function showSet(domainId, setId) {
  const domLabel = domainLabel(domainId);
  const sLabel   = setLabel(setId);
  crumbs([
    { href: `#/domain/${domainId}`, label: domLabel },
    { label: sLabel }
  ]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [sets, readmeData, cards, progress, mcqProgress] = await Promise.all([
      api(`/api/domains/${enc(domainId)}/sets`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/readme`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/cards`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/progress`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/mcq-progress`).catch(() => ({})),
    ]);
    const set      = sets.find(s => s.id === setId) || { name: sLabel, cardCount: cards.length };
    const hasCards = cards.length > 0;
    const mcqTotal = set.mcqCount ?? 0;
    const hasMcq   = mcqTotal > 0;

    // ── Flashcard pie + filters ──────────────────────────────
    const pieData = buildPieData(cards, progress);
    const pieSVG  = buildPieSVG(pieData, cards.length);
    const fcLegend = pieData.filter(s => s.value > 0).map(s => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${s.color}"></span>
        <span>${s.label}: <strong>${s.value}</strong></span>
      </div>`).join('');

    const fcBase = `#/domain/${domainId}/set/${setId}/study`;
    const fcFilterCards = FILTERS.map(f => {
      const count    = applyFilter(cards, progress, f.id).length;
      const disabled = !f.alwaysEnabled && count === 0;
      return `<a class="filter-card${disabled ? ' disabled' : ''}"
                 href="${fcBase}/${f.id}"
                 style="--fc:${f.color}"
                 title="${esc(f.desc)}">
        <div class="filter-card-count">${count}</div>
        <div class="filter-card-label">${esc(f.label)}</div>
        <div class="filter-card-desc">${esc(f.desc)}</div>
      </a>`;
    }).join('');

    // ── MCQ pie + filters ────────────────────────────────────
    const mcqVals       = Object.values(mcqProgress);
    const mcqMastered   = mcqVals.filter(p => p.right > 0 && p.wrong === 0).length;
    const mcqShaky      = mcqVals.filter(p => p.right >= 1 && p.wrong >= 1).length;
    const mcqStruggling = mcqVals.filter(p => p.right === 0 && p.wrong > 0).length;
    const mcqStudied    = mcqMastered + mcqShaky + mcqStruggling;
    const mcqUnseen     = Math.max(0, mcqTotal - mcqStudied);
    const mcqAnyWrong   = mcqVals.filter(p => p.wrong >= 1).length;
    const mcqMostlyWrong = mcqVals.filter(p => p.wrong > p.right).length;

    const mcqPieSegs = [
      { id: 'unseen',     label: 'Unseen',     color: '#d1d5db', value: mcqUnseen     },
      { id: 'mastered',   label: 'Mastered',   color: '#16a34a', value: mcqMastered   },
      { id: 'shaky',      label: 'Shaky',      color: '#f59e0b', value: mcqShaky      },
      { id: 'struggling', label: 'Struggling', color: '#dc2626', value: mcqStruggling },
    ];
    const mcqPieSVG = buildPieSVG(mcqPieSegs, mcqTotal);
    const mcqLegend = mcqPieSegs.filter(s => s.value > 0).map(s => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${s.color}"></span>
        <span>${s.label}: <strong>${s.value}</strong></span>
      </div>`).join('');

    const qBase = `#/domain/${domainId}/set/${setId}/quiz`;
    const MCQ_FILTER_DEFS = [
      { id: 'all',          label: 'All Cards',    desc: 'Every question',                      color: '#4a4a4a', count: mcqTotal,       alwaysEnabled: true },
      { id: 'any-wrong',    label: 'Any Wrong',    desc: 'Answered wrong at least once',         color: '#ea580c', count: mcqAnyWrong                        },
      { id: 'mostly-wrong', label: 'Mostly Wrong', desc: 'More wrong answers than right',        color: '#dc2626', count: mcqMostlyWrong                     },
      { id: 'shaky',        label: 'Shaky',        desc: 'Gotten right AND wrong — not locked in', color: '#d97706', count: mcqShaky                        },
    ];
    const mcqFilterCards = MCQ_FILTER_DEFS.map(f => {
      const disabled = !f.alwaysEnabled && f.count === 0;
      return `<a class="filter-card${disabled ? ' disabled' : ''}"
                 href="${qBase}/${f.id}"
                 style="--fc:${f.color}"
                 title="${esc(f.desc)}">
        <div class="filter-card-count">${f.count}</div>
        <div class="filter-card-label">${esc(f.label)}</div>
        <div class="filter-card-desc">${esc(f.desc)}</div>
      </a>`;
    }).join('');

    // ── Tier row ─────────────────────────────────────────────
    const TIER_LABEL_FULL = { 1: 'Tier 1 · Core exam content', 2: 'Tier 2', 3: 'Tier 3 · Supplemental' };
    const tierRow = set.tier != null ? `
      <div class="tier-info-row">
        <span class="tier-pill t${set.tier}">${TIER_LABEL_FULL[set.tier] ?? `Tier ${set.tier}`}</span>
        ${set.examWeight ? `<span class="tier-weight">${esc(set.examWeight)}</span>` : ''}
      </div>` : '';

    appEl.innerHTML = `
      ${tierRow}
      ${hasCards || hasMcq ? `
        <div class="mode-cards">
          ${hasCards ? `
            <div class="mode-card">
              <div class="mode-card-header">
                <span class="mode-card-title">Flashcards</span>
                <span class="mode-card-count">${cards.length} card${cards.length !== 1 ? 's' : ''}</span>
              </div>
              <div class="mode-card-body">
                <div class="pie-section">
                  <div class="pie-svg-wrap">${pieSVG}</div>
                  <div class="pie-legend">${fcLegend || '<span class="legend-none">No answers yet</span>'}</div>
                </div>
                <div class="filter-grid">${fcFilterCards}</div>
              </div>
            </div>` : ''}
          ${hasMcq ? `
            <div class="mode-card">
              <div class="mode-card-header">
                <span class="mode-card-title">Multiple Choice</span>
                <span class="mode-card-count">${mcqTotal} question${mcqTotal !== 1 ? 's' : ''}</span>
              </div>
              <div class="mode-card-body">
                <div class="pie-section">
                  <div class="pie-svg-wrap">${mcqPieSVG}</div>
                  <div class="pie-legend">${mcqLegend || '<span class="legend-none">No answers yet</span>'}</div>
                </div>
                <div class="filter-grid">${mcqFilterCards}</div>
              </div>
            </div>` : ''}
        </div>` : ''}
      ${readmeData.html
        ? `<div class="readme">${readmeData.html}</div>`
        : '<p class="empty">No study guide for this set yet.</p>'}`;
  } catch (e) {
    appEl.innerHTML = `<p class="error">Could not load set: ${esc(e.message)}</p>`;
  }
}

async function showStudy(domainId, setId, filter = 'all') {
  const domLabel = domainLabel(domainId);
  const sLabel   = setLabel(setId);
  const fLabel   = getFilter(filter).label;
  crumbs([
    { href: `#/domain/${domainId}`, label: domLabel },
    { href: `#/domain/${domainId}/set/${setId}`, label: sLabel },
    { label: `Study · ${fLabel}` }
  ]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [allCards, progress] = await Promise.all([
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/cards`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/progress`)
    ]);
    const cards = applyFilter(allCards, progress, filter);

    if (!cards.length) {
      appEl.innerHTML = `
        <div class="empty-filter">
          <p>No cards match <strong>${esc(fLabel)}</strong>.</p>
          <p class="empty-filter-hint">Study some cards in All mode first, then come back.</p>
          <a class="btn" href="#/domain/${domainId}/set/${setId}/study/all">Study All Cards</a>
        </div>`;
      return;
    }

    studyState = { allCards, cards, progress, index: 0, flipped: false, done: false, domainId, setId, filter };
    renderStudy();
  } catch (e) {
    appEl.innerHTML = `<p class="error">Could not load cards: ${esc(e.message)}</p>`;
  }
}

// ── Study renderer ────────────────────────────────────────────────────────────

function renderStudy() {
  if (!studyState) return;
  const { cards, progress, index, flipped, done, domainId, setId, filter } = studyState;
  const sidebar = `<aside class="card-sidebar">${buildSidebarHtml(studyState)}</aside>`;

  if (done) {
    appEl.innerHTML = `
      <div class="study-wrap">
        <div class="study-main">
          <div class="done-wrap">
            <div class="done-icon">✓</div>
            <h2>Set complete!</h2>
            <p>You reviewed all ${cards.length} card${cards.length !== 1 ? 's' : ''} in <em>${esc(getFilter(filter).label)}</em> mode.</p>
            <div class="done-actions">
              <button class="btn btn-outline" onclick="restartStudy()">Start Over</button>
              <a class="btn" href="#/domain/${domainId}/set/${setId}">Back to Set</a>
            </div>
          </div>
        </div>
        ${sidebar}
      </div>`;
    return;
  }

  const card    = cards[index];
  const pct     = Math.round((index / cards.length) * 100);
  const isFirst = index === 0;
  const isLast  = index === cards.length - 1;
  const stats   = progress[card.question];

  const statsHtml = stats
    ? `<div class="fc-stats">
        <span class="stat-right">✓ ${stats.right}</span>
        <span class="stat-wrong">✗ ${stats.wrong}</span>
       </div>`
    : '';

  const judgeHtml = flipped
    ? `<div class="judge-row">
        <button class="btn-got"    onclick="judgeCard('right')">✓ Got it</button>
        <button class="btn-missed" onclick="judgeCard('wrong')">✗ Missed it</button>
       </div>`
    : '';

  const filterPill = filter !== 'all'
    ? `<span class="filter-pill">${esc(getFilter(filter).label)}</span>`
    : '';

  appEl.innerHTML = `
    <div class="study-wrap">
      <div class="study-main">
        <div class="study-top">
          <a href="#/domain/${domainId}/set/${setId}" class="btn btn-outline btn-sm">← Back</a>
          <span class="progress-label">${filterPill}Card ${index + 1} of ${cards.length}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>

        <div class="fc-wrap" onclick="flipCard()">
          <div class="fc ${flipped ? 'is-flipped' : ''}" id="fc">
            <div class="fc-face fc-front">
              ${seenTag(stats?.lastSeen)}
              ${card.category ? `<div class="fc-cat"><span class="badge">${esc(card.category)}</span></div>` : ''}
              <div class="fc-text">${card.questionHtml}</div>
              ${statsHtml}
              <div class="fc-nudge">tap to reveal</div>
            </div>
            <div class="fc-face fc-back">
              <div class="fc-role">Answer</div>
              ${card.category ? `<div class="fc-cat"><span class="badge">${esc(card.category)}</span></div>` : ''}
              <div class="fc-text fc-text-answer">${card.answerHtml}</div>
            </div>
          </div>
        </div>

        <div class="study-nav">
          <button class="nav-btn" onclick="navCard(-1)" ${isFirst ? 'disabled' : ''} title="Previous (←)">‹</button>
          <button class="flip-btn" onclick="flipCard()">${flipped ? 'Show Question' : 'Reveal Answer'}</button>
          <button class="nav-btn" onclick="navCard(1)" title="${isLast ? 'Finish' : 'Next (→)'}">${isLast ? '✓' : '›'}</button>
        </div>

        ${judgeHtml}

        <div class="key-tip">← → to navigate · Space to flip · G = got it · M = missed it</div>
      </div>
      ${sidebar}
    </div>
  `;
  fitCardText();
}

// ── Study actions ─────────────────────────────────────────────────────────────

function flipCard() {
  if (!studyState || studyState.done) return;
  studyState.flipped = !studyState.flipped;

  const fc = document.getElementById('fc');
  if (fc) fc.classList.toggle('is-flipped');

  const btn = document.querySelector('.flip-btn');
  if (btn) btn.textContent = studyState.flipped ? 'Show Question' : 'Reveal Answer';

  const existing = document.querySelector('.judge-row');
  if (studyState.flipped && !existing) {
    const row = document.createElement('div');
    row.className = 'judge-row';
    row.innerHTML = `
      <button class="btn-got"    onclick="judgeCard('right')">✓ Got it</button>
      <button class="btn-missed" onclick="judgeCard('wrong')">✗ Missed it</button>`;
    document.querySelector('.study-nav')?.after(row);
  } else if (!studyState.flipped && existing) {
    existing.remove();
  }
}

function navCard(dir) {
  if (!studyState || studyState.done) return;
  const next = studyState.index + dir;
  if (next < 0) return;
  if (next >= studyState.cards.length) {
    studyState.done = true;
    renderStudy();
    return;
  }
  studyState.index   = next;
  studyState.flipped = false;
  renderStudy();
}

function judgeCard(result) {
  if (!studyState || studyState.done) return;
  const { cards, index, domainId, setId } = studyState;
  const card = cards[index];

  // Update local state immediately so stats refresh on next card
  const p = studyState.progress[card.question] ??= { right: 0, wrong: 0, lastSeen: '' };
  if (result === 'right') p.right++; else p.wrong++;
  p.lastSeen = new Date().toISOString().slice(0, 10);

  // Persist asynchronously
  post(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/progress`, {
    question: card.question, result
  }).catch(() => {});

  navCard(1);
}

function restartStudy() {
  if (!studyState) return;
  studyState.index   = 0;
  studyState.flipped = false;
  studyState.done    = false;
  renderStudy();
}

function jumpToCard(filteredIdx) {
  if (!studyState || filteredIdx < 0 || filteredIdx >= studyState.cards.length) return;
  studyState.index   = filteredIdx;
  studyState.flipped = false;
  studyState.done    = false;
  renderStudy();
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  // Quiz keyboard shortcuts
  if (quizState && !quizState.done) {
    switch (e.key) {
      case '1': selectOption(0); return;
      case '2': selectOption(1); return;
      case '3': selectOption(2); return;
      case '4': selectOption(3); return;
      case 'ArrowRight': case 'Enter': nextQuestion(); return;
    }
    return;
  }

  // Flashcard keyboard shortcuts
  if (!studyState || studyState.done) return;
  switch (e.key) {
    case 'ArrowRight': case 'ArrowDown':  navCard(1);  break;
    case 'ArrowLeft':  case 'ArrowUp':    navCard(-1); break;
    case ' ': e.preventDefault(); flipCard(); break;
    case 'g': case 'G': if (studyState.flipped) judgeCard('right'); break;
    case 'm': case 'M': if (studyState.flipped) judgeCard('wrong');  break;
  }
});

// ── Quiz view ─────────────────────────────────────────────────────────────────

const MCQ_FILTER_LABELS = { all: 'All Cards', 'any-wrong': 'Any Wrong', 'mostly-wrong': 'Mostly Wrong', shaky: 'Shaky' };

async function showQuiz(domainId, setId, filter = 'all') {
  const domLabel = domainLabel(domainId);
  const sLabel   = setLabel(setId);
  const fLabel   = MCQ_FILTER_LABELS[filter] ?? 'All';
  crumbs([
    { href: `#/domain/${domainId}`, label: domLabel },
    { href: `#/domain/${domainId}/set/${setId}`, label: sLabel },
    { label: filter === 'all' ? 'Quiz' : `Quiz · ${fLabel}` }
  ]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [allQuestions, mcqProgress] = await Promise.all([
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/mcq`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/mcq-progress`).catch(() => ({})),
    ]);

    // Attach original index so progress always maps to the canonical question slot
    const indexed = allQuestions.map((q, i) => ({ ...q, originalIndex: i }));

    // Apply filter (mirrors flashcard FILTERS logic using right/wrong counts)
    let questions;
    switch (filter) {
      case 'any-wrong':
        questions = indexed.filter(q => { const p = mcqProgress[q.originalIndex]; return p && p.wrong >= 1; });
        break;
      case 'mostly-wrong':
        questions = indexed.filter(q => { const p = mcqProgress[q.originalIndex]; return p && p.wrong > p.right; });
        break;
      case 'shaky':
        questions = indexed.filter(q => { const p = mcqProgress[q.originalIndex]; return p && p.right >= 1 && p.wrong >= 1; });
        break;
      default:
        questions = indexed;
    }

    if (!questions.length) {
      appEl.innerHTML = `
        <div class="empty-filter">
          <p>No questions match <strong>${esc(fLabel)}</strong>.</p>
          <p class="empty-filter-hint">Answer some questions first, then come back to this filter.</p>
          <a class="btn" href="#/domain/${domainId}/set/${setId}/quiz/all">Start with All Questions</a>
        </div>`;
      return;
    }

    quizState = { questions, answers: {}, mcqProgress, index: 0, done: false, domainId, setId, filter };
    renderQuiz();
  } catch (e) {
    appEl.innerHTML = `<p class="error">Could not load questions: ${esc(e.message)}</p>`;
  }
}

function buildQuizSidebarHtml(state) {
  const { questions, answers, mcqProgress, index, done } = state;
  const cells = questions.map((q, i) => {
    // Current session answer takes precedence; fall back to stored right/wrong counts
    const sessionAnswer = answers[i];
    const p             = mcqProgress?.[q.originalIndex ?? i];

    let cls = 'qz-dot';
    if (sessionAnswer !== undefined) {
      cls += sessionAnswer.correct ? ' qz-dot-correct' : ' qz-dot-wrong';
    } else if (p !== undefined) {
      if      (p.right > 0 && p.wrong === 0) cls += ' qz-dot-correct';
      else if (p.wrong > 0 && p.right === 0) cls += ' qz-dot-wrong';
      else if (p.right > 0 && p.wrong > 0)  cls += ' qz-dot-shaky';
    }
    if (i === index && !done) cls += ' qz-dot-current';
    const num = i + 1;
    return `<div class="${cls}" onclick="jumpToQuizQuestion(${i})" title="Question ${num}">${num}</div>`;
  }).join('');
  const answered = Object.keys(answers).length;
  const correct  = Object.values(answers).filter(a => a.correct).length;
  return `<div class="sidebar-title">Questions <span class="sidebar-count">${questions.length}</span></div>
    <div class="qz-score-mini">${answered > 0 ? `${correct}/${answered} correct so far` : 'No answers yet'}</div>
    <div class="qz-dot-grid">${cells}</div>`;
}

function renderQuiz() {
  if (!quizState) return;
  const { questions, answers, index, answered, done, domainId, setId } = quizState;
  const sidebar = `<aside class="card-sidebar">${buildQuizSidebarHtml(quizState)}</aside>`;

  if (done) {
    const total   = questions.length;
    const correct = Object.values(answers).filter(a => a.correct).length;
    const pct     = Math.round((correct / total) * 100);
    const grade   = pct >= 80 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 60 ? 'Passing' : 'Needs Work';
    appEl.innerHTML = `
      <div class="study-wrap">
        <div class="study-main">
          <div class="done-wrap">
            <div class="done-icon">${pct >= 70 ? '✓' : '✗'}</div>
            <h2>${grade}</h2>
            <p class="quiz-score-big">${correct} / ${total} correct &nbsp;·&nbsp; ${pct}%</p>
            <div class="done-actions">
              <button class="btn btn-outline" onclick="restartQuiz()">Retake Quiz</button>
              <a class="btn" href="#/domain/${domainId}/set/${setId}">Back to Set</a>
            </div>
          </div>
        </div>
        ${sidebar}
      </div>`;
    return;
  }

  const q           = questions[index];
  const pct         = Math.round((index / questions.length) * 100);
  const prevAnswer  = answers[index];
  const filterPill  = quizState.filter && quizState.filter !== 'all'
    ? `<span class="filter-pill">${esc(MCQ_FILTER_LABELS[quizState.filter] ?? quizState.filter)}</span> `
    : '';

  const optionsHtml = q.options.map((_, i) => {
    let cls = 'qz-option';
    if (prevAnswer !== undefined) {
      if (i === q.correct)           cls += ' qz-opt-correct';
      else if (i === prevAnswer.selected && !prevAnswer.correct) cls += ' qz-opt-wrong';
      else                           cls += ' qz-opt-dim';
    }
    const letter = 'ABCD'[i];
    return `<button class="${cls}" onclick="selectOption(${i})" ${prevAnswer !== undefined ? 'disabled' : ''}>
      <span class="qz-letter">${letter}</span>
      <span class="qz-opt-text">${q.optionsHtml[i]}</span>
    </button>`;
  }).join('');

  const explanationHtml = prevAnswer !== undefined ? `
    <div class="qz-explanation ${prevAnswer.correct ? 'qz-exp-correct' : 'qz-exp-wrong'}">
      <div class="qz-exp-icon">${prevAnswer.correct ? '✓ Correct' : '✗ Incorrect'}</div>
      <div class="qz-exp-body">${q.explanationHtml}</div>
    </div>` : '';

  const isLast = index === questions.length - 1;
  const nextDisabled = prevAnswer === undefined ? 'disabled' : '';
  const nextLabel    = isLast ? 'Finish Quiz' : 'Next Question →';

  appEl.innerHTML = `
    <div class="study-wrap">
      <div class="study-main">
        <div class="study-top">
          <a href="#/domain/${domainId}/set/${setId}" class="btn btn-outline btn-sm">← Back</a>
          <span class="progress-label">${filterPill}Question ${index + 1} of ${questions.length}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>

        <div class="qz-card">
          ${seenTag(quizState.mcqProgress?.[q.originalIndex ?? index]?.lastSeen)}
          ${q.category ? `<div class="fc-cat"><span class="badge">${esc(q.category)}</span></div>` : ''}
          <div class="qz-question">${q.questionHtml}</div>
        </div>

        <div class="qz-options">${optionsHtml}</div>

        ${explanationHtml}

        <div class="qz-nav">
          <button class="btn" onclick="nextQuestion()" ${nextDisabled}>${nextLabel}</button>
        </div>

        <div class="key-tip">1–4 to select · Enter / → for next</div>
      </div>
      ${sidebar}
    </div>`;
  fitCardText();
}

function selectOption(i) {
  if (!quizState || quizState.done) return;
  const { questions, answers, index, domainId, setId } = quizState;
  if (answers[index] !== undefined) return; // already answered
  const q       = questions[index];
  const correct = i === q.correct;
  quizState.answers[index] = { selected: i, correct };

  // Accumulate right/wrong counts in local cache so sidebar updates immediately
  const origIdx = q.originalIndex ?? index;
  if (quizState.mcqProgress) {
    const entry = quizState.mcqProgress[origIdx] ?? { right: 0, wrong: 0, lastSeen: '' };
    if (correct) entry.right++; else entry.wrong++;
    entry.lastSeen = new Date().toISOString().slice(0, 10);
    quizState.mcqProgress[origIdx] = entry;
  }

  // Persist to server
  post(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/mcq-progress`, {
    questionIndex: origIdx, correct
  }).catch(() => {});

  renderQuiz();
}

function nextQuestion() {
  if (!quizState) return;
  const { answers, index } = quizState;
  if (answers[index] === undefined) return; // must answer first
  const next = index + 1;
  if (next >= quizState.questions.length) {
    quizState.done = true;
  } else {
    quizState.index = next;
  }
  renderQuiz();
}

function restartQuiz() {
  if (!quizState) return;
  quizState.answers  = {};
  quizState.index    = 0;
  quizState.answered = false;
  quizState.done     = false;
  renderQuiz();
}

function jumpToQuizQuestion(i) {
  if (!quizState || i < 0 || i >= quizState.questions.length) return;
  quizState.index = i;
  if (quizState.done) quizState.done = false;
  renderQuiz();
}
