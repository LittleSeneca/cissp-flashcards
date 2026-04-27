// ── Icons (inline SVG) ────────────────────────────────────────────────────────
const ICONS = {
  domain: `<svg class="nav-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 1L2 3.8V8.5c0 3 2.4 5.6 6 6.5 3.6-.9 6-3.5 6-6.5V3.8L8 1z"/></svg>`,
  set:    `<svg class="nav-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="5.5" width="10" height="8.5" rx="1.5"/><rect x="1" y="3.5" width="10" height="8.5" rx="1.5" opacity="0.28"/></svg>`,
};

// ── State ─────────────────────────────────────────────────────────────────────
let studyState      = null;
let navData         = null;
let progressSummary = null;

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
  showHome();
}

window.addEventListener('hashchange', () => { renderLeftNav(); route(); });
window.addEventListener('DOMContentLoaded', () => { loadNav(); route(); });

// ── Left nav ──────────────────────────────────────────────────────────────────
async function loadNav() {
  try {
    [navData, progressSummary] = await Promise.all([
      api('/api/nav'),
      api('/api/progress').catch(() => ({})),
    ]);
    renderLeftNav();
  } catch { /* nav is non-critical */ }
}

async function refreshProgress() {
  try { progressSummary = await api('/api/progress'); } catch { /* non-critical */ }
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
      const active = anySetActive && curSet === set.id;
      const tierClass = set.tier ? ` tier-${set.tier}` : '';
      const badgeText = set.tier ? `T${set.tier} · ${set.cardCount}` : `${set.cardCount}`;
      const key = `${domain.id}/${set.id}`;
      const bar = progressBarHtml(key, set.cardCount, 'nav-set-bar');
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
  let mastered = 0, shaky = 0, struggling = 0, studied = 0;
  if (progressSummary) {
    for (const [key, s] of Object.entries(progressSummary)) {
      if (key.startsWith(domainId + '/')) {
        mastered   += s.mastered;
        shaky      += s.shaky;
        struggling += s.struggling;
        studied    += s.studied;
      }
    }
  }
  return { mastered, shaky, struggling, studied };
}

// ── Filter definitions & logic ────────────────────────────────────────────────
const FILTERS = [
  { id: 'all',          label: 'All Cards',    desc: 'Every card in the set',                       color: '#2563eb', alwaysEnabled: true, match: ()  => true },
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

  const cells = allCards.map((card, allIdx) => {
    const p        = progress[card.question];
    const r        = p?.right  ?? 0;
    const w        = p?.wrong  ?? 0;
    const filtIdx  = filtered.findIndex(c => c.question === card.question);
    const inFilter = filtIdx !== -1;
    const isCurrent = card.question === currentQ;

    // Background
    let bg;
    if (r === 0 && w === 0) {
      bg = '#e5e7eb';
    } else if (w === 0) {
      bg = rightShade(r);
    } else if (r === 0) {
      bg = wrongShade(w);
    } else {
      bg = `linear-gradient(to right,${rightShade(r)} 50%,${wrongShade(w)} 50%)`;
    }

    // Marks
    const rm = r > 0 ? `<span class="sc-r">${'✓'.repeat(Math.min(r,3))}${r>3?'+':''}</span>` : '';
    const wm = w > 0 ? `<span class="sc-w">${'✗'.repeat(Math.min(w,3))}${w>3?'+':''}</span>` : '';

    const cls   = ['sc-card', isCurrent && 'is-current', !inFilter && 'is-dim'].filter(Boolean).join(' ');
    const click = inFilter ? `onclick="jumpToCard(${filtIdx})"` : '';
    const tip   = esc(card.question.length > 70 ? card.question.slice(0,70)+'…' : card.question);

    return `<div class="${cls}" ${click} title="${tip}">
      <div class="sc-color" style="background:${bg}"><span class="sc-num">${allIdx+1}</span></div>
      <div class="sc-marks">${rm}${wm}</div>
    </div>`;
  }).join('');

  return `<div class="sidebar-title">Cards <span class="sidebar-count">${allCards.length}</span></div>
    <div class="sc-grid">${cells}</div>`;
}

function applyFilter(cards, progress, filterId) {
  const f = getFilter(filterId);
  if (filterId === 'all') return cards;
  return cards.filter(c => f.match(progress[c.question]));
}

// ── Activity chart ────────────────────────────────────────────────────────────
function buildActivityChart(days) {
  const maxAnswered = Math.max(...days.map(d => d.answered), 0);

  if (maxAnswered === 0) {
    return `<div class="activity-empty">No activity yet — start studying to see your progress here.</div>`;
  }

  const W = 560, H = 160;
  const ml = 32, mr = 16, mt = 10, mb = 34;
  const pw = W - ml - mr;
  const ph = H - mt - mb;

  function niceMax(n) {
    if (n <= 5)  return 5;
    if (n <= 10) return 10;
    if (n <= 20) return 20;
    if (n <= 50) return 50;
    return Math.ceil(n / 10) * 10;
  }

  const top  = niceMax(maxAnswered);
  const n    = days.length;
  const xOf  = i => ml + (n > 1 ? (i / (n - 1)) * pw : pw / 2);
  const yOf  = v => mt + ph - (v / top) * ph;
  const base = yOf(0);

  const tPts = days.map((d, i) => `${xOf(i)},${yOf(d.answered)}`).join(' ');
  const rPts = days.map((d, i) => `${xOf(i)},${yOf(d.right)}`).join(' ');

  // Filled areas under each line
  const tArea = `M ${xOf(0)} ${base} ` + days.map((d, i) => `L ${xOf(i)} ${yOf(d.answered)}`).join(' ') + ` L ${xOf(n-1)} ${base} Z`;
  const rArea = `M ${xOf(0)} ${base} ` + days.map((d, i) => `L ${xOf(i)} ${yOf(d.right)}`).join(' ')     + ` L ${xOf(n-1)} ${base} Z`;

  // Grid lines at 0, 50%, 100% of top
  const gridVals = [0, Math.round(top / 2), top];
  const grid = gridVals.map(v => {
    const y = yOf(v);
    return `<line x1="${ml}" y1="${y}" x2="${W - mr}" y2="${y}" stroke="#f3f4f6" stroke-width="1"/>
            <text x="${ml - 5}" y="${y + 4}" text-anchor="end" font-size="9" fill="#9ca3af">${v}</text>`;
  }).join('');

  const xLabels = days.map((d, i) => {
    const [yr, mo, dy] = d.date.split('-').map(Number);
    const label = new Date(yr, mo - 1, dy).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `<text x="${xOf(i)}" y="${H - 4}" text-anchor="middle" font-size="9" fill="#9ca3af">${label}</text>`;
  }).join('');

  const tDots = days.map((d, i) => d.answered > 0
    ? `<circle cx="${xOf(i)}" cy="${yOf(d.answered)}" r="3" fill="#6366f1"/>` : '').join('');
  const rDots = days.map((d, i) => d.right > 0
    ? `<circle cx="${xOf(i)}" cy="${yOf(d.right)}" r="3" fill="#16a34a"/>` : '').join('');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="activity-svg">
    ${grid}
    <line x1="${ml}" y1="${base}" x2="${W - mr}" y2="${base}" stroke="#e5e7eb" stroke-width="1"/>
    <path d="${tArea}" fill="#6366f1" fill-opacity="0.08"/>
    <path d="${rArea}" fill="#16a34a" fill-opacity="0.12"/>
    <polyline points="${tPts}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="${rPts}" fill="none" stroke="#16a34a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${tDots}${rDots}
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

// ── Views ─────────────────────────────────────────────────────────────────────

async function showHome() {
  crumbs([]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [domains, activityDays] = await Promise.all([
      api('/api/domains'),
      api('/api/activity?days=7').catch(() => []),
      refreshProgress(),
    ]);

    const activityChart = `
      <div class="activity-card">
        <div class="activity-header">
          <span class="activity-title">Activity — Last 7 Days</span>
          <div class="activity-legend">
            <span class="activity-dot" style="background:#6366f1"></span>Answered
            <span class="activity-dot" style="background:#16a34a"></span>Got right
          </div>
        </div>
        ${buildActivityChart(activityDays)}
      </div>`;

    appEl.innerHTML = `
      <h1 class="view-title">CISSP Domains</h1>
      ${activityChart}
      <div class="grid">
        ${domains.map(d => {
          const [num, ...rest] = d.name.split(': ');
          const agg  = domainProgressAgg(d.id);
          const studiedCount = agg.studied;
          const progressNote = studiedCount === 0
            ? '<div class="not-started-note">Not started</div>'
            : `<div class="set-progress-note">${studiedCount}/${d.totalCards} seen · ${agg.mastered} mastered${agg.struggling + agg.shaky > 0 ? ` · ${agg.struggling + agg.shaky} need work` : ''}</div>`;
          const bar = progressBarHtml(agg, d.totalCards, 'set-progress-bar');
          return `<a class="card" href="#/domain/${d.id}">
            <div class="domain-num">${esc(num)}</div>
            <div class="card-title">${esc(rest.join(': '))}</div>
            <div class="card-meta">${d.sets} set${d.sets !== 1 ? 's' : ''} · ${d.totalCards} cards</div>
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
  crumbs([{ href: '#/', label: 'Domains' }, { label }]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [sets] = await Promise.all([
      api(`/api/domains/${enc(domainId)}/sets`),
      refreshProgress().then(() => renderLeftNav()),
    ]);
    const [num, ...rest] = label.split(': ');
    appEl.innerHTML = `
      <div class="domain-num">${esc(num)}</div>
      <h1 class="view-title">${esc(rest.join(': '))}</h1>
      <p class="view-sub">${sets.length} flashcard set${sets.length !== 1 ? 's' : ''}</p>
      <div class="grid">
        ${sets.length === 0
          ? '<p class="empty">No flashcard sets yet.</p>'
          : sets.map(s => {
            const TIER_COLOR = { 1: '#ef4444', 2: '#f59e0b', 3: '#94a3b8' };
            const TIER_LABEL = { 1: 'Tier 1 · Core', 2: 'Tier 2', 3: 'Tier 3 · Supplemental' };
            const tColor = s.tier != null ? TIER_COLOR[s.tier] : null;
            const borderStyle = tColor ? `style="border-top: 3px solid ${tColor}"` : '';
            const tierLine = s.tier != null
              ? `<div class="tier-marker t${s.tier}">${TIER_LABEL[s.tier]}</div>` : '';
            const meta = [
              `${s.cardCount} card${s.cardCount !== 1 ? 's' : ''}`,
              s.hasReadme ? 'study guide' : '',
              s.examWeight || '',
            ].filter(Boolean).join(' · ');
            const pKey = `${domainId}/${s.id}`;
            const ps   = progressSummary?.[pKey];
            const studiedCount = ps?.studied ?? 0;
            const progressNote = studiedCount === 0
              ? '<div class="not-started-note">Not started</div>'
              : `<div class="set-progress-note">${studiedCount}/${s.cardCount} seen &nbsp;·&nbsp; ${ps.mastered} mastered${ps.struggling + ps.shaky > 0 ? ` · ${ps.struggling + ps.shaky} need work` : ''}</div>`;
            const bar = progressBarHtml(pKey, s.cardCount, 'set-progress-bar');
            return `<a class="card" href="#/domain/${domainId}/set/${s.id}" ${borderStyle}>
              ${tierLine}
              <div class="card-title">${esc(s.name)}</div>
              <div class="card-meta">${meta}</div>
              ${progressNote}
              ${bar}
            </a>`;
          }).join('')}
      </div>`;
  } catch (e) {
    appEl.innerHTML = `<p class="error">Could not load domain: ${esc(e.message)}</p>`;
  }
}

async function showSet(domainId, setId) {
  const domLabel = domainLabel(domainId);
  const sLabel   = setLabel(setId);
  crumbs([
    { href: '#/', label: 'Domains' },
    { href: `#/domain/${domainId}`, label: domLabel },
    { label: sLabel }
  ]);
  appEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const [sets, readmeData, cards, progress] = await Promise.all([
      api(`/api/domains/${enc(domainId)}/sets`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/readme`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/cards`),
      api(`/api/domains/${enc(domainId)}/sets/${enc(setId)}/progress`),
    ]);
    const set      = sets.find(s => s.id === setId) || { name: sLabel, cardCount: cards.length };
    const base     = `#/domain/${domainId}/set/${setId}/study`;
    const hasCards = cards.length > 0;

    const pieData  = buildPieData(cards, progress);
    const pieSVG   = buildPieSVG(pieData, cards.length);
    const legend   = pieData.filter(s => s.value > 0).map(s => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${s.color}"></span>
        <span>${s.label}: <strong>${s.value}</strong></span>
      </div>`).join('');

    const filterCards = FILTERS.map(f => {
      const count    = applyFilter(cards, progress, f.id).length;
      const disabled = !f.alwaysEnabled && count === 0;
      return `<a class="filter-card${disabled ? ' disabled' : ''}"
                 href="${base}/${f.id}"
                 style="--fc:${f.color}"
                 title="${esc(f.desc)}">
        <div class="filter-card-count">${count}</div>
        <div class="filter-card-label">${esc(f.label)}</div>
        <div class="filter-card-desc">${esc(f.desc)}</div>
      </a>`;
    }).join('');

    const TIER_LABEL_FULL = { 1: 'Tier 1 · Core exam content', 2: 'Tier 2', 3: 'Tier 3 · Supplemental' };
    const tierRow = set.tier != null ? `
      <div class="tier-info-row">
        <span class="tier-pill t${set.tier}">${TIER_LABEL_FULL[set.tier] ?? `Tier ${set.tier}`}</span>
        ${set.examWeight ? `<span class="tier-weight">${esc(set.examWeight)}</span>` : ''}
      </div>` : '';

    appEl.innerHTML = `
      <h1 class="view-title">${esc(set.name)}</h1>
      ${tierRow}
      ${hasCards ? `
        <div class="set-stats">
          <div class="pie-section">
            <div class="pie-svg-wrap">${pieSVG}</div>
            <div class="pie-legend">${legend}</div>
          </div>
          <div class="filter-grid">${filterCards}</div>
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
    { href: '#/', label: 'Domains' },
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
              <div class="fc-role">Question</div>
              ${card.category ? `<div class="fc-cat"><span class="badge">${esc(card.category)}</span></div>` : ''}
              <div class="fc-text">${esc(card.question)}</div>
              ${statsHtml}
              <div class="fc-nudge">tap to reveal</div>
            </div>
            <div class="fc-face fc-back">
              <div class="fc-role">Answer</div>
              ${card.category ? `<div class="fc-cat"><span class="badge">${esc(card.category)}</span></div>` : ''}
              <div class="fc-text fc-text-answer">${esc(card.answer)}</div>
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
  if (!studyState || studyState.done) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  switch (e.key) {
    case 'ArrowRight': case 'ArrowDown':  navCard(1);  break;
    case 'ArrowLeft':  case 'ArrowUp':    navCard(-1); break;
    case ' ': e.preventDefault(); flipCard(); break;
    case 'g': case 'G': if (studyState.flipped) judgeCard('right'); break;
    case 'm': case 'M': if (studyState.flipped) judgeCard('wrong');  break;
  }
});
