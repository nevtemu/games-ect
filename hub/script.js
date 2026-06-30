/* ════════════════════════════════════════════════════════
   PARTICLE CANVAS
════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function makeParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     randBetween(0.5, 2),
      vx:    randBetween(-0.14, 0.14),
      vy:    randBetween(-0.22, -0.04),
      alpha: randBetween(0.06, 0.4),
    };
  }

  function init() {
    particles = [];
    const count = Math.min(120, Math.floor((W * H) / 9500));
    for (let i = 0; i < count; i++) particles.push(makeParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,180,255,${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -4)  { p.y = H + 4; p.x = Math.random() * W; }
      if (p.x < -4)  p.x = W + 4;
      if (p.x > W+4) p.x = -4;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

/* ════════════════════════════════════════════════════════
   GAME DATA
════════════════════════════════════════════════════════ */
const GAMES = {
  'last-operational': { title: 'Beyond the App', link: "../games/last_operational/index.html", image: './images/last-operational.png' },
  'cocktail-codex':   { title: 'Cocktail Codex',   link: "../games/cocktail_codex/index.html", image: './images/cocktail-codex.png'   },
  'pourfect':         { title: 'Pourfect',         link: "../games/pourfect/index.html", image: './images/pourfect.png'         },
};

const CABINS = [
  { id: 2, label: 'W', name: 'Premium Economy', color: '#4F299E' },
  { id: 3, label: 'J', name: 'Business',        color: '#305291' },
  { id: 4, label: 'F', name: 'First',           color: '#B14242' },
];

const SCORE_THRESHOLD = 50;
const MAX_RANKS       = 50;

/* ════════════════════════════════════════════════════════
   SCORE STORE
   Shape: { id, nickname, game, score, date, cabinId }
════════════════════════════════════════════════════════ */
let savedScores   = [];  // loaded from ./ranking/*.json on startup
let pendingScores = [];  // added during this session (not yet saved)

function allScores() {
  const map = new Map();
  for (const s of [...savedScores, ...pendingScores]) {
    if (!map.has(s.id)) map.set(s.id, s);
  }
  return Array.from(map.values());
}

function scoresForGame(gameId) {
  return allScores().filter(s => s.game === gameId && s.score >= SCORE_THRESHOLD);
}

function scoresForGameAndCabin(gameId, cabinId) {
  return scoresForGame(gameId)
    .filter(s => s.cabinId === cabinId)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RANKS);
}

function countForGame(gameId) {
  return scoresForGame(gameId).length;
}

function isPending(id) {
  return pendingScores.some(s => s.id === id);
}

/* ════════════════════════════════════════════════════════
   LIKES STORE
   Shape: { id, game, staffNumber, date }
   id = `${game}:${staffNumber}` — guarantees one like per
   staff number per game.
════════════════════════════════════════════════════════ */
let savedLikes   = [];  // loaded from ./ranking/*.json on startup
let pendingLikes = [];  // added during this session (not yet saved)

function allLikes() {
  const map = new Map();
  for (const l of [...savedLikes, ...pendingLikes]) {
    if (!map.has(l.id)) map.set(l.id, l);
  }
  return Array.from(map.values());
}

function likesForGame(gameId) {
  return allLikes().filter(l => l.game === gameId);
}

function likeCountFor(gameId) {
  return likesForGame(gameId).length;
}

function hasStaffLiked(gameId, staffNumber) {
  return allLikes().some(l => l.game === gameId && l.staffNumber === staffNumber);
}

/* ════════════════════════════════════════════════════════
   AUTO-LOAD from ./ranking/aeroplay-scores-*.json
   Browsers can't read local files without a server, so we
   attempt a fetch of the known export path. If the page is
   served from a local server (e.g. Live Server, nginx) the
   files in ./ranking/ will be picked up automatically.
   The same file holds both scores and likes.
════════════════════════════════════════════════════════ */
function applyRankingData(data, sourceLabel) {
  const scoresArr = Array.isArray(data) ? data : (data.scores || []);
  const likesArr  = Array.isArray(data) ? [] : (data.likes || []);

  const validScores = scoresArr.filter(s =>
    s.id && s.nickname && s.game && typeof s.score === 'number' && s.cabinId
  );
  const validLikes = likesArr.filter(l =>
    l.id && l.game && l.staffNumber
  );

  let loaded = false;
  if (validScores.length) {
    savedScores = validScores;
    console.info(`[AeroPlay] Loaded ${validScores.length} scores from ${sourceLabel}`);
    loaded = true;
  }
  if (validLikes.length) {
    savedLikes = validLikes;
    console.info(`[AeroPlay] Loaded ${validLikes.length} likes from ${sourceLabel}`);
    loaded = true;
  }
  if (loaded) {
    updateCounts();
    renderLikeCounts();
  }
  return loaded;
}

async function loadRankingFiles() {
  // Try fetching a directory listing first (works with some local servers)
  // Fall back to trying the most-recent timestamp pattern.
  // The simplest reliable approach: fetch ./ranking/scores.json (canonical name)
  // AND attempt ./ranking/ directory index to find timestamped files.
  const attempts = [
    './ranking/scores.json',
    './ranking/aeroplay-scores.json',
  ];

  for (const url of attempts) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) continue;
      const data = await res.json();
      if (applyRankingData(data, url)) return;
    } catch { /* no file, continue */ }
  }

  // Also try fetching a directory index to discover timestamped files
  try {
    const res = await fetch('./ranking/', { cache: 'no-cache' });
    if (res.ok) {
      const html = await res.text();
      // Parse href links that match our export pattern
      const matches = [...html.matchAll(/href="(aeroplay-scores-\d+\.json)"/g)];
      if (matches.length) {
        // Take the last (most recent by name sort)
        const filename = matches[matches.length - 1][1];
        const r2 = await fetch(`./ranking/${filename}`, { cache: 'no-cache' });
        if (r2.ok) {
          const data = await r2.json();
          applyRankingData(data, `./ranking/${filename}`);
        }
      }
    }
  } catch { /* directory listing not available */ }
}


/* ════════════════════════════════════════════════════════
   LOCAL PENDING SCORES
   Games write { id, nickname, game, score, date, cabinId }
   objects to localStorage key 'aeroplay_pending_scores'.
   The hub reads them here and merges into pendingScores.
════════════════════════════════════════════════════════ */
function loadLocalPendingScores() {
  try {
    const raw = localStorage.getItem('aeroplay_pending_scores');
    if (!raw) return;
    const arr = JSON.parse(raw);
    const valid = arr.filter(s =>
      s.id && s.nickname && s.game && typeof s.score === 'number' && s.cabinId
    );
    if (!valid.length) return;
    // Merge: avoid duplicates by id
    const existingIds = new Set(pendingScores.map(s => s.id));
    const fresh = valid.filter(s => !existingIds.has(s.id));
    pendingScores.push(...fresh);
    if (fresh.length) {
      updateCounts();
      console.info(`[AeroPlay] Loaded ${fresh.length} pending score(s) from localStorage`);
    }
  } catch(e) { /* localStorage unavailable */ }
}

/* ════════════════════════════════════════════════════════
   LOCAL PENDING LIKES
   This page is the only writer: likes added during this
   session are persisted to localStorage key
   'aeroplay_pending_likes' and reloaded here on startup.
════════════════════════════════════════════════════════ */
function loadLocalPendingLikes() {
  try {
    const raw = localStorage.getItem('aeroplay_pending_likes');
    if (!raw) return;
    const arr = JSON.parse(raw);
    const valid = Array.isArray(arr) ? arr.filter(l => l.id && l.game && l.staffNumber) : [];
    if (!valid.length) return;
    const existingIds = new Set(pendingLikes.map(l => l.id));
    const fresh = valid.filter(l => !existingIds.has(l.id));
    pendingLikes.push(...fresh);
    if (fresh.length) {
      console.info(`[AeroPlay] Loaded ${fresh.length} pending like(s) from localStorage`);
    }
  } catch(e) { /* localStorage unavailable */ }
}

function savePendingLikes() {
  try { localStorage.setItem('aeroplay_pending_likes', JSON.stringify(pendingLikes)); } catch (e) { /* storage unavailable */ }
}

loadRankingFiles();
loadLocalPendingScores();
loadLocalPendingLikes();
renderLikeCounts();

/* ════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════ */
function showToast(title, desc) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="toast-title">${title}</div><div class="toast-desc">${desc}</div>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.classList.add('hide');
    el.addEventListener('animationend', () => el.remove());
  }, 3200);
}

/* ════════════════════════════════════════════════════════
   RIPPLE
════════════════════════════════════════════════════════ */
function addRipple(btn, e) {
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
  const y      = (e.clientY ?? rect.top  + rect.height / 2) - rect.top  - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('pointerdown', e => addRipple(btn, e));
});

/* ════════════════════════════════════════════════════════
   SETTINGS DRAWER
════════════════════════════════════════════════════════ */
const backdrop    = document.getElementById('drawer-backdrop');
const drawer      = document.getElementById('drawer');
const settingsBtn = document.getElementById('settings-btn');

function openDrawer() {
  settingsBtn.classList.add('spin');
  settingsBtn.addEventListener('animationend', () => settingsBtn.classList.remove('spin'), { once: true });
  updateCounts();
  backdrop.classList.add('open');
  requestAnimationFrame(() => {
    backdrop.classList.add('visible');
    drawer.classList.add('open');
  });
}

function closeDrawer() {
  backdrop.classList.remove('visible');
  drawer.classList.remove('open');
  setTimeout(() => backdrop.classList.remove('open'), 400);
}

function updateCounts() {
  Object.keys(GAMES).forEach(gameId => {
    const el = document.getElementById(`count-${gameId}`);
    if (el) el.textContent = `${countForGame(gameId)} records`;
  });
}

settingsBtn.addEventListener('click', openDrawer);
document.getElementById('drawer-close').addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);

/* ── Offload rankings & likes ─────────────────────────── */
document.getElementById('export-btn').addEventListener('click', () => {
  const scores = allScores();   // merged: savedScores + pendingScores (deduped by id)
  const likes  = allLikes();    // merged: savedLikes + pendingLikes (deduped by id)
  const data   = { scores, likes };

  const newScores = pendingScores.filter(s => !savedScores.some(f => f.id === s.id)).length;
  const newLikes  = pendingLikes.filter(l => !savedLikes.some(f => f.id === l.id)).length;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `aeroplay-scores-${Date.now()}.json`,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const breakdown = `${scores.length} score${scores.length === 1 ? '' : 's'} (${newScores} new) · ${likes.length} like${likes.length === 1 ? '' : 's'} (${newLikes} new)`;
  showToast('Offloaded — Rankings & Likes', `${breakdown}. Place in ./ranking/ to auto-load.`);
});

/* ── Clear per-game ──────────────────────────────────── */
document.querySelectorAll('.clear-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const gameId = btn.dataset.clear;
    savedScores   = savedScores.filter(s => s.game !== gameId);
    pendingScores = pendingScores.filter(s => s.game !== gameId);
    updateCounts();
    if (currentGame === gameId) renderLeaderboard(gameId);
    showToast('Cleared', `Scores wiped for ${GAMES[gameId]?.title ?? gameId}.`);
  });
});

/* ════════════════════════════════════════════════════════
   LEADERBOARD
════════════════════════════════════════════════════════ */
const lbOverlay = document.getElementById('lb-overlay');
const mainHub   = document.getElementById('main-hub');
let currentGame = null;

function openLeaderboard(gameId) {
  currentGame = gameId;
  const game  = GAMES[gameId];

  document.getElementById('lb-game-title').textContent = game.title;
  document.getElementById('lb-game-badge').style.backgroundImage = `url(${game.image})`;

  // Animate hub out
  mainHub.classList.add('hub-exit');

  // Short delay then show leaderboard
  setTimeout(() => {
    lbOverlay.classList.remove('closing');
    lbOverlay.classList.add('open');
    renderLeaderboard(gameId);
  }, 280);
}

function renderLeaderboard(gameId) {
  CABINS.forEach(cabin => {
    const list    = document.getElementById(`lb-list-${cabin.id}`);
    const statsEl = document.getElementById(`lb-stats-${cabin.id}`);
    const entries = scoresForGameAndCabin(gameId, cabin.id);
    const total   = entries.reduce((sum, s) => sum + s.score, 0);
    const countLabel = entries.length === MAX_RANKS ? `Top ${MAX_RANKS}` : `Top ${entries.length}`;

    if (statsEl) {
      if (entries.length > 0) {
        statsEl.textContent = `${countLabel} · ${total.toLocaleString()} pts total`;
      } else {
        statsEl.textContent = 'No records yet';
      }
    }

    if (!entries.length) {
      list.innerHTML = `<div class="lb-empty">No records yet.<br>Be the first.</div>`;
      return;
    }

    list.innerHTML = entries.map((s, i) => {
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      const isLocal   = isPending(s.id);
      return `
        <div class="lb-row ${isLocal ? 'is-local' : ''}" style="animation-delay:${Math.min(i * 0.025, 0.6).toFixed(3)}s">
          <span class="lb-row-rank ${rankClass}">${i + 1}</span>
          <span class="lb-row-name">${escHtml(s.nickname)}</span>
          <span class="lb-row-score">${s.score.toLocaleString()}</span>
        </div>`;
    }).join('');
  });
}

function closeLeaderboard() {
  lbOverlay.classList.add('closing');
  lbOverlay.classList.remove('open');

  // Animate hub back in
  setTimeout(() => {
    mainHub.classList.remove('hub-exit');
    currentGame = null;
  }, 320);
}

document.getElementById('lb-close').addEventListener('click', closeLeaderboard);
lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) closeLeaderboard(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLeaderboard(); });

/* ════════════════════════════════════════════════════════
   BUTTON ROUTING
════════════════════════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const { action, game } = btn.dataset;
    if (action === 'play') {
      window.location.replace(GAMES[game].link)
      //showToast('Incoming Transmission', `${GAMES[game].title} is coming soon. Stand by.`);
    } else if (action === 'ranks') {
      openLeaderboard(game);
    }
  });
});

/* ════════════════════════════════════════════════════════
   UTILS
════════════════════════════════════════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
/* ════════════════════════════════════════════════════════
   LIKE MODAL
   Likes are stored via the savedLikes/pendingLikes arrays
   defined earlier (merged with the ranking file on load).
════════════════════════════════════════════════════════ */
function renderLikeCounts() {
  Object.keys(GAMES).forEach(gameId => {
    const el = document.getElementById(`like-count-${gameId}`);
    if (el) el.textContent = likeCountFor(gameId);
  });
}

const likeModalBackdrop = document.getElementById('like-modal-backdrop');
const likeModalInput    = document.getElementById('like-modal-input');
const likeModalError    = document.getElementById('like-modal-error');
const likeModalSubmit   = document.getElementById('like-modal-submit');
const likeModalCancel   = document.getElementById('like-modal-cancel');
const STAFF_NUMBER_RE   = /^\d{6}$/;
let pendingLikeGame = null;

function openLikeModal(gameId) {
  pendingLikeGame = gameId;
  likeModalInput.value = '';
  likeModalInput.classList.remove('input-error');
  likeModalError.classList.remove('show');
  likeModalBackdrop.classList.add('open');
  requestAnimationFrame(() => {
    likeModalBackdrop.classList.add('visible');
    likeModalInput.focus();
  });
}

function closeLikeModal() {
  likeModalBackdrop.classList.remove('visible');
  setTimeout(() => {
    likeModalBackdrop.classList.remove('open');
    pendingLikeGame = null;
  }, 250);
}

function showLikeError(msg) {
  likeModalInput.classList.add('input-error');
  likeModalError.textContent = msg;
  likeModalError.classList.add('show');
}

function submitLike() {
  const staffNumber = likeModalInput.value.trim();

  if (!staffNumber) {
    showLikeError('Please enter your staff number.');
    return;
  }
  if (!STAFF_NUMBER_RE.test(staffNumber)) {
    showLikeError('Staff number must be exactly 6 digits.');
    return;
  }
  if (!pendingLikeGame) { closeLikeModal(); return; }

  if (hasStaffLiked(pendingLikeGame, staffNumber)) {
    showLikeError('That staff number has already been recorded for this game.');
    return;
  }

  pendingLikes.push({
    id: `${pendingLikeGame}:${staffNumber}`,
    game: pendingLikeGame,
    staffNumber,
    date: new Date().toISOString(),
  });
  savePendingLikes();
  renderLikeCounts();

  const btn = document.querySelector(`.like-btn[data-like="${pendingLikeGame}"]`);
  if (btn) {
    btn.classList.add('liked', 'bump');
    btn.addEventListener('animationend', () => btn.classList.remove('bump'), { once: true });
  }

  const gameTitle = GAMES[pendingLikeGame]?.title ?? pendingLikeGame;
  closeLikeModal();
  showToast('Feedback Recorded', `Thanks for liking ${gameTitle}!`);
}

document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', () => openLikeModal(btn.dataset.like));
});

likeModalSubmit.addEventListener('click', submitLike);
likeModalCancel.addEventListener('click', closeLikeModal);
likeModalBackdrop.addEventListener('click', e => { if (e.target === likeModalBackdrop) closeLikeModal(); });
likeModalInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitLike(); });
likeModalInput.addEventListener('input', () => {
  // Digits only, max 6 chars
  likeModalInput.value = likeModalInput.value.replace(/\D/g, '').slice(0, 6);
  likeModalInput.classList.remove('input-error');
  likeModalError.classList.remove('show');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && likeModalBackdrop.classList.contains('open')) closeLikeModal();
});