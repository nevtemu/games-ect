// ============================================================
//  STATIC GAME DATA
// ============================================================

// Cabin definitions with colors
const cabins = [
  { Id: 2, Active: true,  Label: 'W', Name: 'Premium Economy', Color: '#4F299E', Aircraft: 'A350' },
  { Id: 3, Active: true,  Label: 'J', Name: 'Business Class',  Color: '#305291', Aircraft: 'B777' },
  { Id: 4, Active: false, Label: 'F', Name: 'First Class',     Color: '#B14242', Aircraft: null },
];

const drinks = [
  'orange', 'coke', 'pepsi', 'seven_up', 'vodka', 'chivas', 'JD',  
  'red_wine', 'white_wine', 
];

const drinks_JC = ['cosmopolitan', 'bloody_mary', 'kir_royale', 'martini', 'mojito', 'old_fashioned', 'champagne', 'rose_wine', 'somelier_wine'];
const drinks_FC = [];

// Returns the full drink pool for the current cabin
function getDrinksForCabin(cabinLabel) {
  if (cabinLabel === 'J') return [...drinks, ...drinks_JC];
  if (cabinLabel === 'F') return [...drinks, ...drinks_FC];
  return [...drinks];
}

const specials = ['nut', 'bbml', 'gfml', 'vgml', 'wchr', 'nlml']; //'wifi'
const frequentStatuses = ['gold', 'platinum'];

const faces = [
  { id: 1, happy: './src/faces/1_h.png', angry: './src/faces/1_a.png', neutral: './src/faces/1_n.png' },
  { id: 2, happy: './src/faces/2_h.png', angry: './src/faces/2_a.png', neutral: './src/faces/2_n.png' },
  { id: 3, happy: './src/faces/3_h.png', angry: './src/faces/3_a.png', neutral: './src/faces/3_n.png' },
  { id: 4, happy: './src/faces/4_h.png', angry: './src/faces/4_a.png', neutral: './src/faces/4_n.png' },
  { id: 5, happy: './src/faces/5_h.png', angry: './src/faces/5_a.png', neutral: './src/faces/5_n.png' },
  { id: 6, happy: './src/faces/6_h.png', angry: './src/faces/6_a.png', neutral: './src/faces/6_n.png' },
];

// seatGroups and rows are now derived per cabin — see getCabinLayout()

const NAMES = [
  'Smith', 'Brown', 'Clark', 'Reed', 'Stone', 'Wells', 'Miles', 'Shaw',
  'Grant', 'Blake', 'Frost', 'Lane', 'Holt', 'Ford', 'Page', 'Cole',
  'West', 'Ward', 'King', 'Hart', 'Nash', 'Dunn', 'Snow', 'Cross'
];

// ============================================================
//  TUNABLES
// ============================================================

const PREF_PHASE_SECONDS = 8;
const SCORE_CORRECT = 5;
const SCORE_WRONG   = 1;   // deducted
const PERFECT_BONUS = 380;

const PREF_PHASES_BASE = [
  { key: 'drink',    title: 'Memorize: Drinks',         getIcon: c => `./src/drinks/${c.drink}.png` },
  { key: 'special',  title: 'Memorize: Specials',       getIcon: c => c.special  ? `./src/specials/${c.special}.png`  : null },
  { key: 'frequent', title: 'Memorize: Frequent flyers',getIcon: c => c.frequent ? `./src/frequent/${c.frequent}.png` : null },
];

const PREF_PHASE_NAME = { key: 'name', title: 'Memorize: Passenger names', getIcon: c => null };

function getPrefPhases() {
  const phases = [...PREF_PHASES_BASE];
  if (selectedCabin === 'J') phases.push(PREF_PHASE_NAME);
  return phases;
}

// Keep PREF_PHASES as a compat alias (used in dev tools)
let PREF_PHASES = PREF_PHASES_BASE;

// ============================================================
//  GAME STATE
// ============================================================

const DEFAULT_SETTINGS = { levels: 5, timeMin: 1, customers: 8, orders: 5 };
let settings = { ...DEFAULT_SETTINGS };

let staffNumber  = '';
let selectedCabin = 'W'; // W, J, F

const CABIN_NAMES = { W: 'Premium Economy', J: 'Business Class', F: 'First Class' };

// Returns { rows, seatGroups } for the given cabin label
function getCabinLayout(cabin) {
  if (cabin === 'J') {
    // Rows 8–11, B777 — chess pattern: odd=BEFJ, even=ADGK
    const rows = [11, 10, 9, 8];
    const seatGroups = [
      { seats: ['K', 'J'] },
      { aisle: true },
      { seats: ['F', 'E', 'D'] },
      { aisle: true },
      { seats: ['B', 'A'] },
    ];
    return { rows, getSeatGroupsForRow: () => seatGroups };
    /*
    return {
      rows,
      getSeatGroupsForRow: (rowNum) => {
        if (rowNum % 2 !== 0) {
          return [
            { seats: ['J'] },
            { aisle: true },
            { seats: ['F', 'E'] },
            { aisle: true },
            { seats: ['B'] },
          ];
        } else {
          return [
            { seats: ['K'] },
            { aisle: true },
            { seats: ['G', 'D'] },
            { aisle: true },
            { seats: ['A'] },
          ];
        }
      },
    };
    */
  } else if (cabin === 'W') {
    // Rows 14–17, A350, all rows: A B D E F J K
    const rows = [17, 16, 15, 14];
    const seatGroups = [
      { seats: ['K', 'J'] },
      { aisle: true },
      { seats: ['F', 'E', 'D'] },
      { aisle: true },
      { seats: ['B', 'A'] },
    ];
    return { rows, getSeatGroupsForRow: () => seatGroups };
  } else {
    // F — fallback (disabled but just in case)
    const rows = [3, 2, 1];
    const seatGroups = [
      { seats: ['K', 'J'] },
      { aisle: true },
      { seats: ['E', 'D'] },
      { aisle: true },
      { seats: ['B', 'A'] },
    ];
    return { rows, getSeatGroupsForRow: () => seatGroups };
  }
}

let score        = 10;
let streak       = 0;
let currentLevel = 1;
let levelScore        = 0;   // points earned from orders this level (clicks only)
let levelMaxScore     = 0;   // max possible levelScore (full streak, no errors)
let scoreAtLevelStart = 10; // score snapshot used by "Replay" button

let servedThisOrder = new Set();

// Level-level tracking
let levelOrders     = [];   // pre-built order queue for this level
let levelOrderIndex = 0;    // which order we're on
let levelHadError   = false;
let levelIncomplete = 0;    // orders not completed when timer ran out

let timerInterval  = null;
let secondsElapsed = 0;
let totalSeconds   = 0;

let customers    = [];
let currentOrder = null;   // { type, value }
let orderTargets = [];

// Incremented every time resetGame() runs. In-flight async chains (countdowns,
// memorize-bar intervals, preference sequences, delayed callbacks) capture this
// value and check it before continuing, so a mid-sequence "Apply & restart" or
// new game start cleanly aborts the stale chain instead of running alongside
// the new one.
let gameRunId = 0;

// ============================================================
//  UTILITY
// ============================================================

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Returns n items from sourceArr with as little repetition as possible:
// unique (shuffled) if n <= sourceArr.length, otherwise cycles through
// shuffled copies of sourceArr to fill n slots.
function uniquePool(sourceArr, n) {
  if (n <= sourceArr.length) return shuffle(sourceArr).slice(0, n);
  const pool = [];
  while (pool.length < n) pool.push(...shuffle(sourceArr));
  return pool.slice(0, n);
}

function allSeatIds() {
  const layout = getCabinLayout(selectedCabin);
  const seats = [];
  layout.rows.forEach(r => {
    const groups = layout.getSeatGroupsForRow(r);
    groups.forEach(g => {
      if (!g.aisle) g.seats.forEach(l => seats.push(`${r}${l}`));
    });
  });
  return seats;
}

// ============================================================
//  CABIN BUILDER
// ============================================================

const imageNumbers = shuffle(Array.from({ length: 24 }, (_, i) => i + 1));
let imageIndex = 0;

function buildCabin() {
  const container = document.getElementById('cabin-rows');
  container.innerHTML = '';
  imageIndex = 0;

  const layout = getCabinLayout(selectedCabin);

  // Build header row based on first row's seat groups (or W's universal groups)
  const headerRow = document.getElementById('seat-header-row');
  if (headerRow) {
    const sampleGroups = layout.getSeatGroupsForRow(layout.rows[0]);
    headerRow.innerHTML = '<div></div>'; // row-num placeholder
    sampleGroups.forEach(group => {
      if (group.aisle) {
        headerRow.innerHTML += '<div class="aisle-label"></div>';
      } else {
        group.seats.forEach(l => {
          headerRow.innerHTML += `<div class="seat-label">${l}</div>`;
        });
      }
    });
    // Update grid template based on cabin
    const colCount = 1 + sampleGroups.reduce((s, g) => s + (g.aisle ? 1 : g.seats.length), 0);
    const colDefs = ['36px'];
    sampleGroups.forEach(g => {
      if (g.aisle) colDefs.push('48px');
      else g.seats.forEach(() => colDefs.push('72px'));
    });
    const colTemplate = colDefs.join(' ');
    headerRow.style.gridTemplateColumns = colTemplate;
    document.querySelectorAll('.cabin-row').forEach(r => r.style.gridTemplateColumns = colTemplate);
  }

  layout.rows.forEach(rowNum => {
    const seatGroupsForRow = layout.getSeatGroupsForRow(rowNum);

    const rowDiv = document.createElement('div');
    rowDiv.className = 'cabin-row';

    // Apply dynamic grid template
    const colDefs = ['36px'];
    seatGroupsForRow.forEach(g => {
      if (g.aisle) colDefs.push('48px');
      else g.seats.forEach(() => colDefs.push('72px'));
    });
    rowDiv.style.gridTemplateColumns = colDefs.join(' ');

    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-num';
    rowLabel.textContent = rowNum;
    rowDiv.appendChild(rowLabel);

    seatGroupsForRow.forEach(group => {
      if (group.aisle) {
        const ac = document.createElement('div');
        ac.className = 'aisle-cell';
        const dot = document.createElement('div');
        dot.className = 'aisle-dot';
        ac.appendChild(dot);
        rowDiv.appendChild(ac);
      } else {
        group.seats.forEach(letter => {
          const seatId = `${rowNum}${letter}`;
          const seat = document.createElement('div');
          seat.className = 'seat';
          seat.dataset.seatId = seatId;
          seat.title = `Seat ${seatId}`;

          const imgWrap = document.createElement('div');
          imgWrap.className = 'seat-img-wrap';

          const img = document.createElement('img');
          img.src = `./src/seats/0.png`;
          img.alt = '';
          img.className = 'seat-img';
          imgWrap.appendChild(img);

          const faceDiv = document.createElement('div');
          faceDiv.className = 'seat-face';
          faceDiv.style.display = 'none';
          const faceImg = document.createElement('img');
          faceImg.alt = '';
          faceDiv.appendChild(faceImg);
          imgWrap.appendChild(faceDiv);

          const prefDiv = document.createElement('div');
          prefDiv.className = 'seat-pref';
          const prefImg = document.createElement('img');
          prefImg.alt = '';
          prefDiv.appendChild(prefImg);
          imgWrap.appendChild(prefDiv);

          seat.appendChild(imgWrap);

          const code = document.createElement('div');
          code.className = 'seat-code';
          code.textContent = seatId;
          seat.appendChild(code);

          seat.addEventListener('click', () => handleSeatClick(seat));
          rowDiv.appendChild(seat);
        });
      }
    });

    container.appendChild(rowDiv);
  });
}

// ============================================================
//  GENERATE CUSTOMERS
// ============================================================

function generateCustomers(level = 1) {
  const desired = settings.customers + (level - 1);
  const n = Math.min(desired, allSeatIds().length);
  const pickedSeats = shuffle(allSeatIds()).slice(0, n);

  // Random frequent flyer % between 30% and 50%
  const ffPct = 0.30 + Math.random() * 0.20;
  const ffCount = Math.max(1, Math.round(n * ffPct));
  const ffFlags = shuffle([...Array(ffCount).fill(true), ...Array(n - ffCount).fill(false)]);

  const spCount = Math.round(n * 0.8);
  const spFlags = shuffle([...Array(spCount).fill(true), ...Array(n - spCount).fill(false)]);

  const facePool = shuffle([1, 2, 3, 4, 5, 6]);
  while (facePool.length < n) facePool.push(...shuffle([1, 2, 3, 4, 5, 6]));

  const shuffledNames = shuffle([...NAMES]);

  // Use cabin-specific drink pool
  const cabinDrinks = getDrinksForCabin(selectedCabin);
  const drinkPool   = uniquePool(cabinDrinks, n);
  const specialPool = uniquePool(specials, spCount);
  let specialIdx = 0;

  customers = pickedSeats.map((seat, i) => ({
    id: i + 1,
    name: shuffledNames[i % shuffledNames.length],
    seat,
    drink:    drinkPool[i],
    special:  spFlags[i] ? specialPool[specialIdx++] : null,
    face:     facePool[i],
    frequent: ffFlags[i] ? pick(frequentStatuses) : null,
    served:   false,
  }));

  console.log(customers);

  applyCustomersToCabin();
  updatePaxSummary();
}

function applyCustomersToCabin() {
  document.querySelectorAll('.seat').forEach(seatEl => {
    seatEl.classList.remove('occupied', 'served', 'shake');
    const img = seatEl.querySelector('.seat-img');
    if (img) img.src = './src/seats/0.png';
    const faceDiv = seatEl.querySelector('.seat-face');
    if (faceDiv) faceDiv.style.display = 'none';
    const prefDiv = seatEl.querySelector('.seat-pref');
    if (prefDiv) prefDiv.classList.remove('visible');
  });

  customers.forEach((c, idx) => {
    const seatEl = document.querySelector(`.seat[data-seat-id="${c.seat}"]`);
    if (!seatEl) return;
    seatEl.classList.add('occupied');
    const seatImg = seatEl.querySelector('.seat-img');
    if (seatImg) seatImg.src = `./src/seats/${imageNumbers[idx % imageNumbers.length]}.png`;
    const faceData = faces.find(f => f.id === c.face);
    if (faceData) {
      const faceDiv = seatEl.querySelector('.seat-face');
      const faceImg = faceDiv.querySelector('img');
      faceImg.src = faceData.neutral;
      faceImg.alt = c.name;
      faceDiv.style.display = 'flex';
    }
  });
}

function updatePaxSummary() {
  const el = document.getElementById('pax-summary');
  if (!customers.length) { el.textContent = 'No customers generated yet.'; return; }
  const ff = customers.filter(c => c.frequent).length;
  const sp = customers.filter(c => c.special).length;
  el.innerHTML =
    `${customers.length} passengers aboard<br>${ff} frequent flyer${ff !== 1 ? 's' : ''}<br>${sp} special${sp !== 1 ? 's' : ''}`;
}

// ============================================================
//  ORDER QUEUE — pre-build all orders for a level
// ============================================================

function buildLevelOrders(level = 1) {
  // Each unique (type,value) combo that exists among customers becomes one order.
  // Shuffle them so play order varies.
  const seen = new Set();
  const orders = [];

  customers.forEach(c => {
    const dk = `drink:${c.drink}`;
    if (!seen.has(dk)) { seen.add(dk); orders.push({ type: 'drink', value: c.drink }); }
    if (c.special) {
      const sk = `special:${c.special}`;
      if (!seen.has(sk)) { seen.add(sk); orders.push({ type: 'special', value: c.special }); }
    }
    if (c.frequent) {
      const fk = `frequent:${c.frequent}`;
      if (!seen.has(fk)) { seen.add(fk); orders.push({ type: 'frequent', value: c.frequent }); }
    }
    // J cabin: name orders (each passenger has a unique name order)
    if (selectedCabin === 'J') {
      const nk = `name:${c.name}`;
      if (!seen.has(nk)) { seen.add(nk); orders.push({ type: 'name', value: c.name, customerId: c.id }); }
    }
  });

  // Pick a random subset, sized per the "orders per level" setting
  // (increases by 1 each level, capped to however many unique combos actually exist)
  const desired = settings.orders + (level - 1);
  return shuffle(orders).slice(0, Math.min(desired, orders.length));
}

// Max possible levelScore if every order is served correctly with no errors.
function calcLevelMaxScore(orders) {
  return orders.reduce((sum, order) => {
    const matches = customers.filter(c => matchesOrder(c, order)).length;
    return sum + matches * SCORE_CORRECT;
  }, 0);
}

function startNextOrder() {
  if (levelOrderIndex >= levelOrders.length) {
    // All orders done — level complete
    onLevelComplete(false);
    return;
  }

  servedThisOrder.clear(); // unlock all seats for the new order

  currentOrder = levelOrders[levelOrderIndex];
  orderTargets = customers.filter(c => matchesOrder(c, currentOrder)).map(c => c.id);

  updateOrderProgressDisplay();
  updateOrderDisplay();
}

function matchesOrder(customer, order) {
  if (!order) return false;
  if (order.type === 'drink')    return customer.drink    === order.value;
  if (order.type === 'special')  return customer.special  === order.value;
  if (order.type === 'frequent') return customer.frequent === order.value;
  if (order.type === 'name')     return customer.name     === order.value;
  return false;
}

// ============================================================
//  ORDER DISPLAY  — single icon, 1.5× larger, large count
// ============================================================

function updateOrderDisplay() {
  const orderPanel  = document.getElementById('order-panel');
  const orderItem   = document.getElementById('order');
  const orderImg    = orderItem.querySelector('img');
  const countEl     = document.getElementById('order-count');

  orderItem.classList.add('empty');
  orderImg.src = ''; 

  if (!currentOrder) {
    countEl.textContent = '';
    orderPanel.classList.add('hidden');
    return;
  }

  orderPanel.classList.remove('hidden');

  // Progress label: order index / total
  countEl.textContent = `${servedThisOrder.size}/${orderTargets.length}`;

    orderItem.classList.remove('empty');
    orderImg.alt = currentOrder.value;
    switch (currentOrder.type) {
      case 'drink':    orderImg.src = `./src/drinks/${currentOrder.value}.png`; break;
      case 'special':  orderImg.src = `./src/specials/${currentOrder.value}.png`; break;
      case 'frequent': orderImg.src = `./src/frequent/${currentOrder.value}.png`; break;
      case 'name': {
        // Show text name as the "icon" — use a name badge element instead of img
        orderImg.src = '';
        orderImg.alt = '';
        orderItem.classList.add('name-order');
        let nameBadge = orderItem.querySelector('.name-badge');
        if (!nameBadge) {
          nameBadge = document.createElement('span');
          nameBadge.className = 'name-badge';
          orderItem.appendChild(nameBadge);
        }
        nameBadge.textContent = currentOrder.value;
        break;
      }
    }
    // Clean up name badge if order type changed away from name
    if (currentOrder.type !== 'name') {
      orderItem.classList.remove('name-order');
      const existingBadge = orderItem.querySelector('.name-badge');
      if (existingBadge) existingBadge.remove();
    }
}

// ============================================================
//  SEAT INTERACTION
// ============================================================

function handleSeatClick(seatEl) {
  if (!timerInterval) return;
  if (!currentOrder) return;

  const runId = gameRunId;

  const seatId   = seatEl.dataset.seatId;
  const customer = customers.find(c => c.seat === seatId);
  if (!customer) return;

  // Already correctly served for this order?
  if (servedThisOrder.has(customer.id)) return;

  const faceData = faces.find(f => f.id === customer.face);
  const faceDiv  = seatEl.querySelector('.seat-face');
  const faceImg  = faceDiv ? faceDiv.querySelector('img') : null;

  const isMatch = matchesOrder(customer, currentOrder);

  if (isMatch && orderTargets.includes(customer.id)) {
    servedThisOrder.add(customer.id);

    // Streak bonus: points * (streak + 1) so even streak=0 gives base points
    const streakMultiplier = Math.max(1, streak + 1);
    const earned = SCORE_CORRECT * streakMultiplier;
    changeScore(earned, true, seatEl);
    changeStreak(1);

    if (faceImg && faceData) faceImg.src = faceData.happy;
    seatEl.classList.add('served');

    setTimeout(() => {
      if (gameRunId !== runId) return; // game was reset — seat state already rebuilt
      if (faceImg && faceData) faceImg.src = faceData.neutral;
      seatEl.classList.remove('served');
    }, 900);

    updateOrderDisplay();

    // Current order fully served -> move on to the next order in this level
    if (servedThisOrder.size >= orderTargets.length) {
      levelOrderIndex++;
      setTimeout(() => {
        if (gameRunId !== runId) return; // game was reset mid-order
        startNextOrder();
      }, 600);
    }

  } else {
    levelHadError = true;
    changeScore(-SCORE_WRONG, true, seatEl);
    changeStreak(-streak);

    if (faceImg && faceData) faceImg.src = faceData.angry;
    seatEl.classList.remove('shake');
    void seatEl.offsetWidth;
    seatEl.classList.add('shake');

    setTimeout(() => {
      if (gameRunId !== runId) return; // game was reset — seat state already rebuilt
      if (faceImg && faceData) faceImg.src = faceData.neutral;
      seatEl.classList.remove('shake');
    }, 700);
  }
}

// ============================================================
//  SCORE & STREAK
// ============================================================

function changeScore(delta, trackLevel = true, sourceEl = null) {
  score = Math.max(0, score + delta);
  if (trackLevel) levelScore = Math.max(0, levelScore + delta);

  document.getElementById('score-display').textContent = score;

  // Fly-out on HUD score
  spawnScoreFlyout(delta, document.getElementById('score-display'));

  // Fly-out above customer seat if sourceEl provided
  if (sourceEl) spawnScoreFlyout(delta, sourceEl);

  if (score === 0) {
    stopTimer();
    showGameOver();
  }
}

function spawnScoreFlyout(delta, anchorEl) {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const flyout = document.createElement('div');
  flyout.className = `score-flyout ${delta >= 0 ? 'positive' : 'negative'}`;
  flyout.textContent = delta >= 0 ? `+${delta}` : `${delta}`;
  flyout.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
  flyout.style.top  = `${rect.top  + window.scrollY}px`;
  flyout.style.transform = 'translateX(-50%)';
  document.body.appendChild(flyout);
  flyout.addEventListener('animationend', () => flyout.remove());
}

function changeStreak(delta) {
  streak = delta < 0 ? 0 : Math.max(0, streak + delta);

  const streakEl = document.getElementById('streak-display');
  const streakBlock = document.getElementById('streak-block');

  streakEl.textContent = streak;

  if (streak < 1) {
    // ✅ fade OUT
    streakBlock.classList.add('fade');
  } else {
    // ✅ fade IN
    streakBlock.classList.remove('fade');
  }
}

// ============================================================
//  TIMER
// ============================================================

function startTimer() {
  stopTimer();
  secondsElapsed = 0;
  totalSeconds   = settings.timeMin * 60;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
    if (secondsElapsed >= totalSeconds) {
      stopTimer();
      onTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function runMemorizeBar(label, durationSec, runId, onDone) {
  document.getElementById('order-count').textContent = '';
    const el = document.getElementById('order');
    el.classList.add('empty');
    el.querySelector('img').src = '';
  const barEl   = document.getElementById('timer-bar');
  const timerEl = document.getElementById('timer');
  barEl.className = 'bar-fill';
  barEl.style.transition = 'none';
  barEl.style.width = '0%';
  timerEl.textContent = `${durationSec}s`;
  timerEl.className = '';

  let elapsed = 0;
  const iv = setInterval(() => {
    if (gameRunId !== runId) { clearInterval(iv); return; } // aborted by reset

    elapsed++;
    timerEl.textContent = `${durationSec - elapsed}s`;
    barEl.style.transition = 'width 0.9s linear';
    barEl.style.width = `${(elapsed / durationSec) * 100}%`;
    if (elapsed >= durationSec) {
      clearInterval(iv);
      setTimeout(() => { if (gameRunId === runId) onDone(); }, 100);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const remaining = totalSeconds - secondsElapsed;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const timerEl = document.getElementById('timer');
  timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
  timerEl.className = '';
  const barEl = document.getElementById('timer-bar');
  barEl.className = 'bar-fill';
  barEl.style.transition = 'width 0.9s linear';
  //if (remaining <= 30) { timerEl.classList.add('danger'); barEl.classList.add('danger'); }
  if (remaining <= 15) { timerEl.classList.add('warn'); barEl.classList.add('warn'); }
  const pct = totalSeconds > 0 ? (secondsElapsed / totalSeconds) * 100 : 0;
  barEl.style.width = `${pct}%`;
}

function onTimeUp() {
  // Deduct for incomplete orders
  const incompleteCount = levelOrders.length - levelOrderIndex;
  levelIncomplete = incompleteCount;
  if (incompleteCount > 0) {
    const deduction = (customers.length - 1) * incompleteCount;
    changeScore(-deduction, false);
  }
  onLevelComplete(true);
}

// ============================================================
//  LEVELS / ORDER PROGRESS
// ============================================================

// Progress bar showing how many orders have been served within the current level
// (also reused by runPreferencesSequence to show preference-phase progress).
function updateOrderProgressDisplay() {
  document.getElementById('order-label').textContent =
    `${Math.min(levelOrderIndex, levelOrders.length)} / ${levelOrders.length}`;

  document.getElementById('order-bar').style.width =
    levelOrders.length ? `${((levelOrderIndex) / levelOrders.length) * 100}%` : '0%';
}

function updateLevelDisplay() {
  const txt = `Level ${currentLevel} / ${settings.levels}`;
  const cabinLabel = document.getElementById('cabin-level-label');
  if (cabinLabel) cabinLabel.textContent = txt;
}

function onLevelComplete(timedOut) {
  const runId = gameRunId;
  stopTimer();

  // If score is already 0, game over was already triggered by changeScore — bail out
  if (score === 0) return;

  const remaining = Math.max(0, totalSeconds - secondsElapsed);
  const perfect   = !levelHadError && levelIncomplete === 0;

  // Time bonus: unused time share * number of orders * number of customers
  const timeBonus = totalSeconds > 0
    ? Math.round((remaining / totalSeconds) * levelOrders.length * customers.length)
    : 0;

  if (perfect) changeScore(PERFECT_BONUS, false);
  if (timeBonus > 0) changeScore(timeBonus, false);

  // Stars based on this level's score vs the max possible score for this level
  const pct = levelMaxScore > 0 ? levelScore / levelMaxScore : 0;
  const star2 = pct > 0.4;
  const star3 = pct > 0.7;

  showLevelComplete({ star2, star3, perfect, timeBonus }, runId,
    () => { // Replay
      if (gameRunId !== runId) return; // game was reset while overlay was open
      score = scoreAtLevelStart;
      document.getElementById('score-display').textContent = score;
      startLevel();
    },
    () => { // Next level (or finish, on the last level)
      if (gameRunId !== runId) return; // game was reset while overlay was open
      if (currentLevel >= settings.levels) {
        saveScoreToHub();
        currentLevel = 1;
        startLevel();
      } else {
        currentLevel++;
        startLevel();
      }
    }
  );
}

function startLevel() {
  const runId = gameRunId;

  generateCustomers(currentLevel);
  levelOrders     = buildLevelOrders(currentLevel);
  levelOrderIndex = 0;
  levelHadError   = false;
  levelIncomplete = 0;
  levelScore      = 0;
  levelMaxScore   = calcLevelMaxScore(levelOrders);
  scoreAtLevelStart = score;

  updateLevelDisplay();
  updateOrderProgressDisplay();
  applyCustomersToCabin();

  showMemorizeIntroCountdown(runId, () => {
    if (runId !== gameRunId) return; // aborted — a new game/level was started meanwhile
    runPreferencesSequence(runId, () => {
      if (runId !== gameRunId) return;
      showGameStartCountdown(runId, () => {
        if (runId !== gameRunId) return;
        document.getElementById('order-panel').classList.remove('hidden');
        updateOrderProgressDisplay();
        startNextOrder();
        startTimer();
      });
    });
  });
}

// ============================================================
//  PREFERENCES PREVIEW
// ============================================================

function showPrefIcons(phase) {
  customers.forEach(c => {
    const seatEl = document.querySelector(`.seat[data-seat-id="${c.seat}"]`);
    if (!seatEl) return;
    const prefDiv = seatEl.querySelector('.seat-pref');
    const prefImg = prefDiv.querySelector('img');
    const src = phase.getIcon(c);
    if (src) { prefImg.src = src; prefImg.alt = phase.key; prefDiv.classList.add('visible'); }
    else { prefDiv.classList.remove('visible'); }
  });
}

function hidePrefIcons() {
  document.querySelectorAll('.seat-pref').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('.seat-name-badge').forEach(el => el.remove());
}

function showNameIcons() {
  customers.forEach(c => {
    const seatEl = document.querySelector(`.seat[data-seat-id="${c.seat}"]`);
    if (!seatEl) return;
    const prefDiv = seatEl.querySelector('.seat-pref');
    const prefImg = prefDiv.querySelector('img');
    prefImg.src = '';
    prefImg.alt = '';
    // Show name as text badge overlay
    let badge = seatEl.querySelector('.seat-name-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'seat-name-badge';
      seatEl.querySelector('.seat-img-wrap').appendChild(badge);
    }
    badge.textContent = c.name;
    prefDiv.classList.add('visible');
  });
}

function runPreferencesSequence(runId, onComplete) {
  let phaseIndex = 0;
  const phases = getPrefPhases();

  document.getElementById('order-panel').classList.add('hidden');

  function startPhase() {
    if (runId !== gameRunId) return; // aborted mid-sequence by a reset

    if (phaseIndex >= phases.length) {
      hidePrefIcons();

      document.getElementById('timer-bar-wrap').classList.remove('memorize-phase');
      document.getElementById('order-bar-title').textContent = 'Completed orders';
      // Keep order-panel hidden here — it is revealed after the "Game starting" countdown
      updateOrderProgressDisplay();

      onComplete();
      return;
    }

    const phase = phases[phaseIndex];
    const totalPhases = phases.length;

    document.getElementById('order-bar').style.width =
      `${((phaseIndex + 1) / totalPhases) * 100}%`;
    document.getElementById('timer-bar-wrap').classList.add('memorize-phase');
    document.getElementById('order-bar-title').textContent = phase.title;

    if (phase.key === 'name') {
      showNameIcons();
    } else {
      showPrefIcons(phase);
    }

    runMemorizeBar(phase.title, PREF_PHASE_SECONDS, runId, () => {
      if (runId !== gameRunId) return; // aborted mid-bar by a reset
      hidePrefIcons();
      phaseIndex++;
      setTimeout(startPhase, 200);
    });
  }

  startPhase();
}

// ============================================================
//  COUNTDOWNS
// ============================================================

function showCountdownOverlay(title, runId, onComplete) {
  const overlay = document.getElementById('preferences-overlay');
  const titleEl = document.getElementById('pref-title');
  const countEl = document.getElementById('pref-countdown');

  titleEl.textContent = title;
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('visible'));

  let count = 3;
  function tick() {
    if (runId !== gameRunId) return; // aborted by a reset

    countEl.textContent = count;
    countEl.classList.remove('pulse');
    void countEl.offsetWidth;
    countEl.classList.add('pulse');
    if (count > 1) { count--; setTimeout(tick, 1000); }
    else {
      setTimeout(() => {
        if (runId !== gameRunId) return; // aborted by a reset
        overlay.classList.remove('visible');
        setTimeout(() => {
          if (runId !== gameRunId) return; // aborted by a reset
          overlay.classList.add('hidden');
          onComplete();
        }, 350);
      }, 1000);
    }
  }
  tick();
}

function showMemorizeIntroCountdown(runId, onComplete) {
  showCountdownOverlay('Memorize customer information', runId, onComplete);
}

function showGameStartCountdown(runId, onComplete) {
  // Reset timer bar display first
  document.getElementById('timer-bar').style.width = '0%';
  document.getElementById('timer-bar').className = 'bar-fill';
  document.getElementById('timer').textContent = `${settings.timeMin}:00`;
  document.getElementById('timer').className = '';
  showCountdownOverlay('Game starting in', runId, onComplete);
}

// ============================================================
//  LEVEL COMPLETE OVERLAY
// ============================================================

function animateScoreRoll(el, target, duration = 700) {
  const sign = target >= 0 ? '+' : '';
  el.classList.add('rolling');
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(target * eased);
    el.textContent = `${current >= 0 ? '+' : ''}${current}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${sign}${target}`;
      el.classList.remove('rolling');
    }
  }
  requestAnimationFrame(step);
}

function showLevelComplete(stats, runId, onReplay, onNext) {
  const { star2, star3, perfect, timeBonus } = stats;
  const isLastLevel = currentLevel >= settings.levels;

  // Build or reuse overlay
  let overlay = document.getElementById('level-complete-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'level-complete-overlay';
    document.getElementById('app').appendChild(overlay);
  }

  const incompletePenalty = levelIncomplete > 0 ? (customers.length - 1) * levelIncomplete : 0;
  const total = levelScore + (perfect ? PERFECT_BONUS : 0) + timeBonus - incompletePenalty;

  const s1 = '★';
  const s2 = star2 ? '★' : '☆';
  const s3 = star3 ? '★' : '☆';

  const rows = [
    ['Score', levelScore],
  ];
  if (perfect)        rows.push(['Perfect bonus', PERFECT_BONUS]);
  if (timeBonus > 0)  rows.push(['Time bonus', timeBonus]);
  if (levelIncomplete > 0) {
    rows.push([`Incomplete order${levelIncomplete > 1 ? 's' : ''}`, -incompletePenalty]);
  }

  const rowsHtml = rows.map(([label, value]) => `
    <div class="lc-row">
      <span class="lc-label">${label}</span>
      <span class="lc-value" data-target="${value}">${value >= 0 ? '+' : ''}0</span>
    </div>`).join('');

  overlay.innerHTML = `
    <div class="lc-card">
      <div class="lc-trophy">🏆</div>
      <div class="lc-title">Level completed</div>
      <div class="lc-stars">
        <span class="lc-star filled">${s1}</span>
        <span class="lc-star ${star2 ? 'filled' : ''}">${s2}</span>
        <span class="lc-star ${star3 ? 'filled' : ''}">${s3}</span>
      </div>
      <div class="lc-table">
        ${rowsHtml}
        <div class="lc-row total">
          <span class="lc-label"></span>
          <span class="lc-value" data-target="${total}">${total >= 0 ? '+' : ''}0</span>
        </div>
      </div>
      <div class="lc-buttons">
        <button class="lc-btn lc-btn-secondary" id="lc-replay-btn">Replay</button>
        <button class="lc-btn" id="lc-next-btn">${isLastLevel ? 'Finish' : 'Next level →'}</button>
      </div>
    </div>
  `;

  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('visible'));

  // Stars pop in one-by-one
  overlay.querySelectorAll('.lc-star').forEach((starEl, i) => {
    starEl.classList.remove('pop');
    setTimeout(() => {
      if (gameRunId !== runId) return; // game was reset before this fired
      starEl.classList.add('pop');
    }, 200 + i * 220);
  });

  // Table rows reveal one-by-one, with score values rolling up from 0
  const starsDelay = 200 + overlay.querySelectorAll('.lc-star').length * 220;
  overlay.querySelectorAll('.lc-row').forEach((rowEl, i) => {
    rowEl.classList.remove('revealed');
    setTimeout(() => {
      if (gameRunId !== runId) return; // game was reset before this fired
      rowEl.classList.add('revealed');
      const valueEl = rowEl.querySelector('.lc-value');
      animateScoreRoll(valueEl, parseInt(valueEl.dataset.target, 10));
    }, starsDelay + i * 220);
  });

  const close = (callback) => {
    overlay.classList.remove('visible');
    setTimeout(() => { overlay.style.display = 'none'; callback(); }, 350);
  };

  document.getElementById('lc-replay-btn').addEventListener('click', () => close(onReplay));
  document.getElementById('lc-next-btn').addEventListener('click', () => close(onNext));
}

// ============================================================
//  GAME OVER (score reached 0)
// ============================================================

function showGameOver() {
  let overlay = document.getElementById('gameover-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gameover-overlay';
    document.getElementById('app').appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="go-card">
      <div class="go-title">Game over</div>
      <img width='100%' src='./src/game_over/mission.gif' alt='Game over'>
      <div class="go-desc">You are fired</div>
      <div class="go-btn-row">
        <button class="go-btn-secondary" id="go-hub-btn">Back to Hub</button>
        <button class="go-btn" id="go-restart-btn">Play again</button>
      </div>
    </div>
  `;

  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('visible'));

  document.getElementById('go-restart-btn').addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.style.display = 'none';
      showCabinSelect();
    }, 350);
  });

  document.getElementById('go-hub-btn').addEventListener('click', () => {
    window.location.replace('../../hub/index.html');
  });
}

// ============================================================
//  WELCOME & STAFF NUMBER
// ============================================================

// Track whether welcome overlay is open as menu (in-game) vs initial welcome
let welcomeIsMenu = false;

function showWelcome(asMenu = false) {
  const overlay = document.getElementById('welcome-overlay');
  overlay.style.display = 'flex';
  document.getElementById('welcome-card').classList.remove('hidden');
  document.getElementById('staff-card').classList.add('hidden');
  document.getElementById('tutorial-card').classList.add('hidden');
  // Show close button on welcome card only when used as in-game menu
  document.getElementById('welcome-close-btn').classList.toggle('hidden', !asMenu);
}

function showStaffCard() {
  document.getElementById('welcome-card').classList.add('hidden');
  document.getElementById('staff-card').classList.remove('hidden');
  document.getElementById('tutorial-card').classList.add('hidden');
  document.getElementById('staff-num-input').value = '';
  document.getElementById('staff-error').classList.add('hidden');
  setTimeout(() => document.getElementById('staff-num-input').focus(), 100);
}

// "Start game" on welcome card → go to staff number entry
document.getElementById('welcome-next').addEventListener('click', () => {
  showStaffCard();
});

// Staff number validation
function validateStaffInput() {
  const val = document.getElementById('staff-num-input').value.replace(/\D/g, '');
  document.getElementById('staff-num-input').value = val;
  const ok = val.length === 6;
  document.getElementById('staff-error').classList.toggle('hidden', ok || val.length === 0);
  return ok;
}

document.getElementById('staff-num-input').addEventListener('input', validateStaffInput);
document.getElementById('staff-num-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('staff-confirm-btn').click();
});

document.getElementById('staff-confirm-btn').addEventListener('click', () => {
  const val = document.getElementById('staff-num-input').value.replace(/\D/g, '');
  if (val.length !== 6) {
    const input = document.getElementById('staff-num-input');
    input.style.borderColor = '#E24B4A';
    document.getElementById('staff-error').classList.remove('hidden');
    input.focus();
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
    return;
  }
  staffNumber = val;
  document.getElementById('hud-staff-num').textContent = staffNumber;
  document.getElementById('welcome-overlay').style.display = 'none';
  setOverlayBlur(false);
  welcomeIsMenu = false;
  showCabinSelect();
});

// Close/back on staff card → return to welcome card
document.getElementById('staff-close-btn').addEventListener('click', () => {
  if (welcomeIsMenu) {
    closeWelcomeMenu();
  } else {
    document.getElementById('staff-card').classList.add('hidden');
    document.getElementById('welcome-card').classList.remove('hidden');
  }
});

// Back to hub
document.getElementById('back-to-hub-btn').addEventListener('click', () => {
  window.location.replace('../../hub/index.html');
});

// Close button on welcome card (in-game menu mode)
document.getElementById('welcome-close-btn').addEventListener('click', () => {
  closeWelcomeMenu();
});

function closeWelcomeMenu() {
  document.getElementById('welcome-overlay').style.display = 'none';
  setOverlayBlur(false);
  welcomeIsMenu = false;
  if (currentOrder && !timerInterval) startTimer();
}

// ============================================================
//  HOW TO PLAY (TUTORIAL)
// ============================================================

const TUTORIAL_STEPS = 3;
let tutorialStep = 1;

function showTutorialStep(step) {
  tutorialStep = step;

  document.querySelectorAll('.tutorial-step').forEach(el => {
    el.classList.toggle('hidden', parseInt(el.dataset.step, 10) !== step);
  });

  document.querySelectorAll('.tutorial-dot').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.dot, 10) === step);
  });

  const backBtn = document.getElementById('tutorial-back');
  const nextBtn = document.getElementById('tutorial-next');
  backBtn.textContent = step === 1 ? 'Close' : '← Back';
  nextBtn.textContent = step === TUTORIAL_STEPS ? 'Got it' : 'Next →';
}

document.getElementById('how-to-play-btn').addEventListener('click', () => {
  document.getElementById('welcome-card').classList.add('hidden');
  document.getElementById('staff-card').classList.add('hidden');
  document.getElementById('tutorial-card').classList.remove('hidden');
  showTutorialStep(1);
});

document.getElementById('tutorial-close-btn').addEventListener('click', returnToWelcomeCard);

function returnToWelcomeCard() {
  document.getElementById('tutorial-card').classList.add('hidden');
  document.getElementById('staff-card').classList.add('hidden');
  document.getElementById('welcome-card').classList.remove('hidden');
}

document.getElementById('tutorial-back').addEventListener('click', () => {
  if (tutorialStep === 1) {
    returnToWelcomeCard();
  } else {
    showTutorialStep(tutorialStep - 1);
  }
});

document.getElementById('tutorial-next').addEventListener('click', () => {
  if (tutorialStep === TUTORIAL_STEPS) {
    returnToWelcomeCard();
  } else {
    showTutorialStep(tutorialStep + 1);
  }
});

// ============================================================
//  SETTINGS (now embedded in dev-panel)
// ============================================================

// Sync slider display values
['ig-levels-input', 'ig-time-input', 'ig-cust-input', 'ig-orders-input'].forEach(id => {
  const valId = id.replace('-input', '-val');
  document.getElementById(id).addEventListener('input', e => {
    document.getElementById(valId).textContent = e.target.value;
  });
});

// Initialise slider display values from current settings
function syncSettingsDisplay() {
  document.getElementById('ig-levels-input').value = settings.levels;
  document.getElementById('ig-levels-val').textContent  = settings.levels;
  document.getElementById('ig-time-input').value  = settings.timeMin;
  document.getElementById('ig-time-val').textContent    = settings.timeMin;
  document.getElementById('ig-cust-input').value  = settings.customers;
  document.getElementById('ig-cust-val').textContent    = settings.customers;
  document.getElementById('ig-orders-input').value = settings.orders;
  document.getElementById('ig-orders-val').textContent  = settings.orders;
}
syncSettingsDisplay();

document.getElementById('ig-settings-save').addEventListener('click', () => {
  settings.levels    = parseInt(document.getElementById('ig-levels-input').value);
  settings.timeMin   = parseInt(document.getElementById('ig-time-input').value);
  settings.customers = parseInt(document.getElementById('ig-cust-input').value);
  settings.orders    = parseInt(document.getElementById('ig-orders-input').value);
  // Only resetGame if we're actually mid-game (welcome overlay is hidden)
  if (document.getElementById('welcome-overlay').style.display === 'none' &&
      document.getElementById('cabin-select-overlay').classList.contains('hidden')) {
    resetGame();
  }
});

// ============================================================
//  RESET GAME
// ============================================================

function resetGame() {
  // Invalidate any in-flight async chains (countdowns, memorize bars, preference
  // sequences, delayed callbacks) from a previous run — they'll check this and
  // abort themselves instead of running alongside the new game.
  gameRunId++;

  stopTimer();

  // Clean up overlays/UI state that may be mid-animation from a previous run
  hidePrefIcons();

  const prefOverlay = document.getElementById('preferences-overlay');
  prefOverlay.classList.remove('visible');
  prefOverlay.classList.add('hidden');

  document.getElementById('timer-bar-wrap').classList.remove('memorize-phase');
  document.getElementById('order-bar-title').textContent = 'Completed orders';
  document.getElementById('order-panel').classList.remove('hidden');

  const lcOverlay = document.getElementById('level-complete-overlay');
  if (lcOverlay) { lcOverlay.classList.remove('visible'); lcOverlay.style.display = 'none'; }

  const goOverlay = document.getElementById('gameover-overlay');
  if (goOverlay) { goOverlay.classList.remove('visible'); goOverlay.style.display = 'none'; }

  // Reset core game/level state
  score        = 10;
  streak       = 0;
  currentLevel = 1;
  levelScore   = 0;
  levelOrders     = [];
  levelOrderIndex = 0;
  levelHadError   = false;
  levelIncomplete = 0;
  servedThisOrder.clear();

  document.getElementById('score-display').textContent  = score;
  document.getElementById('streak-display').textContent = streak;

  document.getElementById('timer-bar').style.width = '0%';
  document.getElementById('timer-bar').className   = 'bar-fill';
  document.getElementById('timer').textContent     = `${settings.timeMin}:00`;
  document.getElementById('streak-block').classList.add('fade');

  currentOrder = null;
  orderTargets = [];
  updateOrderDisplay();

  startLevel();
}

// ============================================================
//  DEV TOOLS
// ============================================================

document.getElementById('dev-score-plus').addEventListener('click',  () => changeScore(100));
document.getElementById('dev-score-minus').addEventListener('click', () => changeScore(-100));
document.getElementById('dev-gen').addEventListener('click', () => { generateCustomers(); startNextOrder(); });
document.getElementById('dev-start').addEventListener('click', startTimer);
document.getElementById('dev-stop').addEventListener('click',  stopTimer);

function devShowPhase(phaseKey) {
  const phase = PREF_PHASES.find(p => p.key === phaseKey);
  if (!phase) return;
  showPrefIcons(phase);
  setTimeout(() => hidePrefIcons(), 1000);
}

document.getElementById('dev-show-drinks').addEventListener('click',   () => devShowPhase('drink'));
document.getElementById('dev-show-specials').addEventListener('click',  () => devShowPhase('special'));
document.getElementById('dev-show-frequent').addEventListener('click',  () => devShowPhase('frequent'));
document.getElementById('dev-show-names').addEventListener('click',  () => {
  showPrefIcons(PREF_PHASE_NAME);
  setTimeout(() => hidePrefIcons(), 1000);
});

document.getElementById('dev-tools-btn').addEventListener('click', () => {
  const panel = document.getElementById('dev-panel');
  panel.classList.toggle('hidden');
});

// ============================================================
//  OVERLAY BLUR HELPER
// ============================================================

function setOverlayBlur(active) {
  if (active) document.body.classList.add('overlay-open');
  else document.body.classList.remove('overlay-open');
}

// ============================================================
//  INIT
// ============================================================

buildCabin();
buildCabinSelectCards();
secondsElapsed = 0;
totalSeconds   = settings.timeMin * 60;
updateTimerDisplay();
// ============================================================
//  CABIN SELECT
// ============================================================

function showCabinSelect() {
  const overlay = document.getElementById('cabin-select-overlay');
  overlay.classList.remove('hidden');
  setOverlayBlur(true);
}

function hideCabinSelect() {
  const overlay = document.getElementById('cabin-select-overlay');
  overlay.classList.add('hidden');
  setOverlayBlur(false);
}

document.getElementById('cabin-select-close-btn').addEventListener('click', () => {
  hideCabinSelect();
  showWelcome(false);
});

// Cabin selector cards are built dynamically
function buildCabinSelectCards() {
  const grid = document.querySelector('.cabin-select-grid');
  if (!grid) return;
  grid.innerHTML = '';
  cabins.forEach(cab => {
    const btn = document.createElement('button');
    btn.className = 'cabin-select-card';
    btn.dataset.cabin = cab.Label;
    if (!cab.Active) {
      btn.disabled = true;
      btn.classList.add('disabled');
    }
    // Color styling
    btn.style.setProperty('--cabin-color', cab.Color);
    btn.innerHTML = `
      <div class="cabin-select-label">${cab.Label}</div>
      <div class="cabin-select-name">${cab.Name}</div>
      ${cab.Aircraft ? `<div class="cabin-select-aircraft">${cab.Aircraft}</div>` : ''}
    `;
    btn.addEventListener('click', () => {
      if (!cab.Active) return;
      selectedCabin = cab.Label;
      buildCabin();
      updateCabinHeader();
      hideCabinSelect();
      resetGame();
    });
    grid.appendChild(btn);
  });
}

document.querySelectorAll('.cabin-select-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedCabin = card.dataset.cabin;
    buildCabin();
    updateCabinHeader();
    hideCabinSelect();
    resetGame();
  });
});

function updateCabinHeader() {
  const badge = document.getElementById('hud-cabin-badge');
  const cabinDef = cabins.find(c => c.Label === selectedCabin);
  const name = cabinDef ? cabinDef.Name : selectedCabin;
  const aircraft = cabinDef && cabinDef.Aircraft ? ` · ${cabinDef.Aircraft}` : '';
  badge.textContent = `${selectedCabin} · ${name}${aircraft}`;
  if (cabinDef) {
    badge.style.background = cabinDef.Color;
    badge.style.color = '#ffffff';
    badge.style.borderColor = cabinDef.Color;
  }
}

// ============================================================
//  HINT OVERLAY (all possible orders, excluding names)
// ============================================================

function buildHintList() {
  const container = document.getElementById('hint-scroll');
  container.innerHTML = '';

  const sections = [
    { title: 'Drinks',          values: getDrinksForCabin(selectedCabin), folder: 'drinks' },
    { title: 'Specials',        values: specials,                          folder: 'specials' },
    { title: 'Frequent flyers', values: frequentStatuses,                  folder: 'frequent' },
  ];

  sections.forEach(section => {
    if (!section.values.length) return;

    const titleEl = document.createElement('div');
    titleEl.className = 'hint-section-title';
    titleEl.textContent = section.title;
    container.appendChild(titleEl);

    const listEl = document.createElement('div');
    listEl.className = 'hint-list';

    section.values.forEach(value => {
      const item = document.createElement('div');
      item.className = 'hint-item';
      item.innerHTML = `
        <img src="./src/${section.folder}/${value}.png" alt="${value}" />
        <span class="hint-item-label">${value.replace(/_/g, ' ')}</span>
      `;
      listEl.appendChild(item);
    });

    container.appendChild(listEl);
  });
}

function showHint() {
  buildHintList();
  document.getElementById('hint-overlay').classList.remove('hidden');
  setOverlayBlur(true);
}

function hideHint() {
  document.getElementById('hint-overlay').classList.add('hidden');
  setOverlayBlur(false);
}

document.getElementById('hint-btn').addEventListener('click', showHint);
document.getElementById('hint-close-btn').addEventListener('click', hideHint);

// ============================================================
//  IN-GAME MENU (☰)
// ============================================================

document.getElementById('menu-btn').addEventListener('click', () => {
  welcomeIsMenu = true;
  stopTimer();
  setOverlayBlur(true);
  showWelcome(true);
});

// ============================================================
//  WIN / SAVE SCORE TO LOCALSTORAGE
// ============================================================

function saveScoreToHub() {
  if (!staffNumber) return;
  try {
    const key = 'lastop_scores';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      staffNumber,
      cabin: selectedCabin,
      cabinName: CABIN_NAMES[selectedCabin] || selectedCabin,
      score,
      date: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    console.warn('Could not save score to localStorage:', e);
  }
}