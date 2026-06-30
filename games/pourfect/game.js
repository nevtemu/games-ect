// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const RANGE_PCT = 5;
const SCORE_BASE = 20;
const SCORE_START = 50;
const CIRC = 2 * Math.PI * 42;

const SPEED_MAP   = {1:.45, 2:.55, 3:.65, 4:.75, 5:.85};
const SPEED_NAMES = {1:'Relaxed', 2:'Normal', 3:'Fast', 4:'Expert', 5:'Master'};

const MSG_PERFECT = ["Perfect pour! 🍷","Sommelier-level!","Flawless! 🎯","Nailed it! 🥂","Extraordinary!"];
const MSG_GOOD    = ["Nice pour!","Well done!","Close enough!","Good instincts!"];
const MSG_BAD_OVER  = ["Too much!","Overflowed a bit!","Easy there!"];
const MSG_BAD_UNDER = ["A bit short!","Not quite enough!","Try again!"];

// ── DATA ──────────────────────────────────────────────────────────────────────
const cabins = [
  {Id:2, Active:true,  Label:"W", Name:"Premium Economy", Color:"#4F299E"},
  {Id:3, Active:true,  Label:"J", Name:"Business Class",  Color:"#305291"},
  {Id:4, Active:false, Label:"F", Name:"First Class",     Color:"#B14242"},
];
const levels = [
  {cabin:"J", id:1,  name:"White wine",    glass:"wine_glass",      target:50, color:"#EEEDC4"},
  {cabin:"J", id:2,  name:"Port wine",     glass:"wine_glass",      target:40, color:"#6E0C0D"},
  {cabin:"J", id:3,  name:"Red wine",      glass:"wine_glass",      target:50, color:"#722F37"},
  {cabin:"J", id:4,  name:"Champagne",     glass:"champagne_glass", target:75, color:"#F7E7CE"},
  {cabin:"J", id:5,  name:"Pepsi",         glass:"thumbler_glass",  target:80, color:"#1E1E1E"},
  {cabin:"J", id:6,  name:"Water",         glass:"water_glass",     target:80, color:"#D4F1F9"},

  {cabin:"W", id:7,  name:"Rum + Pepsi",   glass:"stemless_glass",  target:75, color:"#1E1E1E"},
  {cabin:"W", id:8,  name:"Screwdriver",   glass:"stemless_glass",  target:75, color:"#F7CA05"},
  {cabin:"W", id:9,  name:"Red wine",      glass:"stemless_glass",  target:50, color:"#722F37"},
  {cabin:"W", id:10, name:"Sparkling wine",glass:"stemless_glass",  target:50, color:"#F7E7CE"},
  {cabin:"W", id:11, name:"Sake",          glass:"stemless_glass",  target:33, color:"#7d8b5a"},
  {cabin:"W", id:12, name:"Mint juice",    glass:"water_glass",      target:75, color:"#3EB489"},
  {cabin:"W", id:13, name:"Apple juice",   glass:"water_glass",      target:75, color:"#F59A40"},
];

const STROKE = '#8A7A5A';

// ── GLASS CONFIG ──────────────────────────────────────────────────────────────
// initialY  = the y attribute of #Liquid at 0% fill (bottom of the fillable area)
// fullRange = the total height of the fillable area (how many SVG units liquid travels from 0→100%)
// At pct%: y = initialY - (pct/100)*fullRange,  height = (pct/100)*fullRange
/*
const GLASS_CONFIG = {
  wine_glass:      { initialY: 182.5, fullRange: 176.2 },
  champagne_glass: { initialY: 183,   fullRange: 176.2 },
  stemless_glass:  { initialY: 285.5, fullRange: 188.3 },
  thumbler_glass:  { initialY: 270.8, fullRange: 176.3 },
  water_glass:     { initialY: 270.8, fullRange: 176.3 },
};
*/

//97%
const GLASS_CONFIG = {
  wine_glass:      { initialY: 182.5, fullRange: 170.9 },
  champagne_glass: { initialY: 183,   fullRange: 170.9 },
  stemless_glass:  { initialY: 285.5, fullRange: 182.7 },
  thumbler_glass:  { initialY: 270.8, fullRange: 171.0 },
  water_glass:     { initialY: 270.8, fullRange: 171.0 },
};



// ── SVG TEMPLATES ─────────────────────────────────────────────────────────────
// Layer order (bottom→top of render = first→last in DOM):
//   1. Shade      – glass shading/highlight, behind the liquid
//   2. Liquid     – the fill rect, clipped by the Background mask above it
//   3. Background – the cutout mask (fills entire canvas minus the glass interior hole)
//   4. Light/Body/Neck/Foot/Stem – decorative strokes & highlights, on top of everything
const SVG_TEMPLATES = {};

SVG_TEMPLATES['wine_glass'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.wst{fill:#c8d3d4}.wli{fill:#fff}.wst3{fill:none;stroke:${STROKE};stroke-miterlimit:10}</style></defs>
  <path name="shade" class="wst" d="M157.1,6.3c46.7,104.2,29.3,169.5-53.2,176.4,43-31.6,70.2-92.9,35.8-179.8,0,0,15.8.9,17.4,3.4Z"/>
  <rect id="Liquid" y="182.5" width="195" height="0" style="fill:LIQUID_COLOR"/>
  <path name="background" style="fill:BG_COLOR" d="M0,0v300h200V0H0ZM183.4,103c-2.6,79.5-79.3,79.5-79.3,79.5,0,0-79-.1-79.5-76.9-.2-33.6,26.4-98.4,26.4-98.4l.3-.7c5.5,2.1,27.7,4.4,52.8,4.4s50.1-1.9,52.6-4.3c2.4,5.8,27.8,67.6,26.8,96.5h0Z"/>
  <path name="light" class="wli" d="M58.3,9.2c3.4.4,5.9,1.4,10.8,1.5-29.4,72.7-14.7,121.2,7,146.6C30.2,126.8,30.7,84.9,58.3,9.2Z"/>
  <g name="foot">
    <path class="wst" d="M168.6,290c-.8-3.6-38.8-9.7-56.2-11.8,5.3,9.2,8.6,4.9-4,10.1,9.4,2.4,11,7.8,11,7.8,24-.3,49.2-2.3,49.1-6h.1Z"/>
    <path class="wst3" d="M91.7,278.8c-19.3,2.5-52.4,8.2-52.4,11.3"/>
    <path class="wst3" d="M168.6,290c0-3.9-50.4-11.8-56.6-11.8"/>
    <path class="wst3" d="M39.3,292.6c-3.1,9.1,132.4,9.1,129.3,0"/>
    <path class="wst3" d="M39.3,290c-3.1,9.1,132.4,9.1,129.3,0"/>
    <line class="wst3" x1="39.3" y1="292.6" x2="39.3" y2="290"/>
    <line class="wst3" x1="168.6" y1="290" x2="168.6" y2="292.6"/>
  </g>
  <g name="stem">
    <path class="wst" d="M119,181.5s-9.1,2.2-15.7,2.2c-1.6,24.2-3.6,98.6,4.8,104.4,8-.9,11-2.9,11-2.9,0,0-9.1-6-10.2-17.4-1.4-16-1-51.5-.2-70.5,1.4-10.7,10.2-15.9,10.2-15.9h0Z"/>
    <path class="wst3" d="M102.3,183.4c-6.6,0-16.6-2.2-16.6-2.2,0,0,8.9,5.2,10.2,15.9,1.4,18.9,1.2,54.5-.2,70.5-1,11.4-10.2,17.4-10.2,17.4,0,0,7,3.6,16.7,3.5h0c9.7.1,16.7-3.5,16.7-3.5,0,0-9.1-6-10.2-17.4-1.4-16-1.6-51.6-.2-70.5,1.4-10.7,10.2-15.9,10.2-15.9,0,0-10,2.2-16.6,2.2"/>
  </g>
  <ellipse name="neck" class="wst3" cx="104" cy="6.3" rx="53.1" ry="5.1"/>
  <path name="right-edge-glass" class="wst3" d="M51,7.4s-26.6,64.8-26.4,98.4c.5,76.8,79.5,76.9,79.5,76.9,0,0,76.7,0,79.3-79.5,1-30.3-27-96.9-27-96.9"/>
</svg>`;

SVG_TEMPLATES['champagne_glass'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.cst{fill:#c7d2d4}.cli{fill:#fff}.cst2{fill:none;stroke:${STROKE};stroke-miterlimit:10}</style></defs>
  <path class="cst" d="M140.9,7.4c13.6,115.3,7.3,167.6-41.5,175.6,36.1-32.1,39.7-89.1,24-179.8,0,0,13.9.5,17.5,4.2Z"/>
  <rect id="Liquid" y="183" width="195" height="0" style="fill:LIQUID_COLOR"/>
  <path style="fill:BG_COLOR" d="M0,0v300h200V0H0ZM146.1,103.8c-1.5,79.5-47.9,79.5-47.9,79.5,0,0-47.8,0-48.1-76.9-.2-33.6,7.1-99.5,7.1-99.5,0,2.8,18.4,5.1,41.1,5.1s41.2-2.3,41.2-5.1h.1s7.1,66.6,6.5,96.9Z"/>
  <path class="cli" d="M68.2,10.1c2.1.4,6.2.6,9.1.7-17.8,72.7-6.8,134.6,6.3,160-26.1-32.3-32.1-85-15.5-160.7h0Z"/>
  <g>
    <path class="cst" d="M152.3,288.7c-.6-3.6-31.4-9.7-45.4-11.8,4.3,9.2,7,4.9-3.2,10.1,7.6,2.4,8.9,7.8,8.9,7.8,19.4-.3,39.8-2.3,39.7-6h0Z"/>
    <path class="cst2" d="M88.7,277.9c-15.5,2.5-41,7.8-41,10.9"/>
    <path class="cst2" d="M152.3,288.7c0-3.9-40.5-10.7-45.4-11.8"/>
    <path class="cst2" d="M47.8,291.3c-2.5,9.1,107,9.1,104.5,0"/>
    <path class="cst2" d="M47.8,288.7c-2.5,9.1,107,9.1,104.5,0"/>
    <line class="cst2" x1="47.8" y1="291.3" x2="47.8" y2="288.7"/>
    <line class="cst2" x1="152.3" y1="288.7" x2="152.3" y2="291.3"/>
  </g>
  <g>
    <path class="cst" d="M113.2,181.1s-8.1,2.2-13.9,2.2c-1.4,24.2-3.2,98.6,4.2,104.4,7.1-.9,9.7-2.9,9.7-2.9,0,0-8.1-6-9-17.4-1.2-16-.9-51.5-.2-70.5,1.2-10.7,9-15.9,9-15.9h.2Z"/>
    <path class="cst2" d="M98.6,183.3c-5.8,0-14.8-3.4-14.8-3.4,0,0,7.9,5.2,9,15.9,1.2,18.9,1.1,54.5-.2,70.5-.9,11.4-9,17.4-9,17.4,0,0,6.2,3.6,14.8,3.5h0c8.6.1,14.8-3.5,14.8-3.5,0,0-8.1-6-9-17.4-1.2-16-1.4-51.6-.2-70.5,1.2-10.7,8.8-16,8.8-16,0,0-8.3,3.5-14.2,3.5"/>
  </g>
  <path class="cst2" d="M98.4,1.8c17.7,0,41.5,2.3,41.5,5.1s-23.8,5.1-41.5,5.1-40.8-2.3-40.8-5.1S80.7,1.8,98.4,1.8Z"/>
  <path class="cst2" d="M57.6,6.9s-7.3,65.9-7.1,99.5c.3,76.8,48.1,76.9,48.1,76.9,0,0,46.4,0,47.9-79.5.6-30.3-6.5-96.9-6.5-96.9"/>
</svg>`;

SVG_TEMPLATES['stemless_glass'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.sli{fill:#fff}.sst{fill:#c7d2d4}.sst1{fill:#8f989a}.sst3{fill:none;stroke:${STROKE};stroke-miterlimit:10}</style></defs>
  <path class="sst" d="M157,97.4c33.2,138.8,29.5,193.4-56.8,187.2,63.6-34.7,42.9-80.4,28.1-190.8,0,0,26.7,1.1,28.7,3.6h0Z"/>
  <rect id="Liquid" y="285.5" width="195" height="0" style="fill:LIQUID_COLOR"/>
  <path style="fill:BG_COLOR" d="M-.2,0v300h200V0H-.2ZM100.2,284.6c-26.3.3-81,3.7-76.7-77.9,1.5-37.5,20.2-110.3,20.2-110.3l5.8,1.4c9.1,1.3,28.4,2.2,50.7,2.2s56.2-1.7,56.3-3.9h.4s21.2,76.1,20.1,110.6c2.3,87.3-50.5,77.5-76.7,77.9Z"/>
  <path class="sli" d="M57.6,100c6.1.7,4.7,1.2,13.6,1.4-25.5,102-26.2,126.2,5.8,162.5-62.4-12.6-39.2-76.4-19.3-163.9h0Z"/>
  <g>
    <path class="sst1" d="M176.5,213.4v3.4-5,1.8-.2h0Z"/>
    <path class="sst1" d="M24.5,234.6l-1.3-21.2c0,7.8.4,14.8,1.3,21.2Z"/>
    <path class="sst1" d="M99.9,284.5c-22.6-.9-66.9,2.5-75.4-49.8,7.6,62.9,50.1,63.6,75.4,63.6s75.4,3,76.7-81.6c-2,76.4-52.8,68.6-76.7,67.7h0Z"/>
  </g>
  <path class="sst" d="M140,293.4c0,1.1-17.7,4.1-39.4,4.1s-38.3-3.6-38.3-4.4,16.4-.7,38.2-.7,39.5,0,39.5,1.1h0Z"/>
  <path class="sst3" d="M43.3,97.9s-18.4,71.3-19.9,108.8c-4.3,81.6,50.4,78.2,76.7,77.9,26.2-.4,79,9.4,76.7-77.9,1.1-34.5-20.1-110.6-20.1-110.6"/>
  <path class="sst3" d="M43.8,96.1s-20.5,76.8-20.4,117.5c0,83.9,48.6,84.8,76.7,84.8s76.7,3,76.7-85c1.1-36.6-20.1-117.5-20.1-117.5"/>
  <ellipse class="sst3" cx="100" cy="96.1" rx="56.3" ry="3.9"/>
</svg>`;

SVG_TEMPLATES['thumbler_glass'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.tli{fill:#fff}.tst{fill:#c7d2d4}.tst3{fill:none;stroke:${STROKE};stroke-miterlimit:10}.tst3s{fill:#8f989a}</style></defs>
  <path class="tst" d="M124.6,90.9s2.6,130.8,1.1,172.3c0,1.9-1.5,6.9-4.3,6.9,9.9.9,48.2-.7,51.7-9.1-.7-32.9,0-129-.4-166.5-9.7-2.6-48.1-3.7-48.1-3.7h0Z"/>
  <rect id="Liquid" y="270.8" width="195" height="0" style="fill:LIQUID_COLOR"/>
  <path style="fill:BG_COLOR;stroke:none" d="M0,0v300h200V0H0ZM172.9,262.4v.3c0,4.5-33.2,8.1-74.2,8.1s-74-3-74-7.5l-.2-.6V94.5h.6c2.5,2,34.5,3.6,73.6,3.6s73.8-1.7,73.8-3.9h.5s-.1,168.2-.1,168.2Z"/>
  <path class="tli" d="M53,98.5l-2.4,123.2c-6.2,0-12.2-1.3-15.8-4.7.7-32.9,1-82.3,1.4-119.7,10.5,1.2,16.8,1.1,16.9,1.2h0Z"/>
  <ellipse class="tst3" cx="98.8" cy="94.5" rx="73.8" ry="3.9"/>
  <g>
    <path class="tst" d="M173.1,262.7c0-.2-.1-.4-.3-.7-.9,4.9-33.7,8.8-74,8.8s-72.2-3.8-74-8.6c0,.2-.1.3-.1.5v22.4c0,4.5,33.2,13.3,74.2,13.3s73.5-8.8,73.5-13.3"/>
    <path class="tst3s" d="M25.5,264.8l-.3,21.4s0,3.6,30.5,8.9c-23.5-5.3-22.5-6.4-22.1-16.7s2.1-10,22.7-8.3c-20.9-1.1-30.8-5.3-30.8-5.3h0Z"/>
    <path class="tst3s" d="M172.4,264.8l.3,21.4s0,3.6-30.5,8.9c23.5-5.3,22.5-6.4,22.1-16.7-.4-11.3-2.1-10-22.7-8.3,20.9-1.1,30.8-5.3,30.8-5.3h0Z"/>
    <path class="tst3s" d="M172.7,207.1h0v54.8s3.4,4.8-22.1,6.6c18.8-4.5,18.1-11.6,22.1-61.4Z"/>
    <path class="tst3s" d="M46.9,268.7c-25.5-1.7-22.1-6.6-22.1-6.6v-54.8h0c4,49.8,3.3,56.8,22.1,61.4Z"/>
    <line class="tst3" x1="173.1" y1="285" x2="173.1" y2="94.5"/>
    <line class="tst3" x1="24.6" y1="285" x2="24.6" y2="94.5"/>
    <path class="tst3" d="M24.6,285c0,4.5,33.3,13.3,74.2,13.3s74.2-8.8,74.2-13.3"/>
    <path class="tst3" d="M173,262.7c0,4.5-33.2,8.1-74.2,8.1s-74.2-3.6-74.2-8.1"/>
  </g>
</svg>`;

SVG_TEMPLATES['water_glass'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.wgli{fill:#fff}.wgst{fill:#c7d2d4}.wgst1{fill:#8f989a}.wgst3{fill:none;stroke:${STROKE};stroke-miterlimit:10}</style></defs>
  <path class="wgst" d="M117.9,90.9s1.9,130.8.8,172.3c0,1.9-1.1,6.9-3.1,6.9,7.1.9,34.4-.7,36.9-9.1-.5-32.9,0-129-.3-166.5-6.9-2.6-34.3-3.7-34.3-3.7h0Z"/>
  <rect id="Liquid" y="270.8" width="195" height="0" style="fill:LIQUID_COLOR"/>
  <path style="fill:BG_COLOR;stroke:none" d="M0,0v300h200V0H0ZM152.5,262.6c0,4.5-23.7,8.1-52.9,8.1s-52.9-3.6-52.9-8.1h.3V94.4c0,2.2,23.6,3.9,52.7,3.9s52.7-1.7,52.7-3.9h.3v168.2Z"/>
  <path class="wgli" d="M66.9,98.5l-1.7,123.2c-4.4,0-8.7-1.3-11.3-4.7.5-32.9.7-82.3,1-119.7,7.5,1.2,12,1.1,12.1,1.2h0Z"/>
  <ellipse class="wgst3" cx="99.5" cy="94.5" rx="52.7" ry="3.9"/>
  <g>
    <path class="wgst" d="M152.6,262.7c0-.2,0-.4-.2-.7-.6,4.9-24,8.8-52.8,8.8s-51.5-3.8-52.8-8.6c0,.2,0,.3,0,.5v22.4c0,4.5,23.7,13.3,52.9,13.3s52.4-8.8,52.4-13.3"/>
    <path class="wgst1" d="M152.1,264.8l.2,21.4s-2.9,3.6-24.6,8.9c16.8-5.3,17.6-6.3,17.4-16.6-.3-11.3-5.2-9.9-19.9-8.2,14.9-1.1,27-5.5,27-5.5h0Z"/>
    <path class="wgst1" d="M47,264.8h0s12.1,4.4,27,5.5c-14.7-1.7-19.6-3.1-19.9,8.2-.3,10.3.6,11.3,17.4,16.6-21.8-5.3-24.6-8.9-24.6-8.9l.2-22.3v.9Z"/>
    <path class="wgst1" d="M66.2,268.7c-19.9-1.9-19.2-4.5-19.2-4.5l.4-57.1h0c2.9,49.8,6,54.9,18.8,61.6Z"/>
    <path class="wgst1" d="M152.3,207.1h0v54.8s1.1,4.9-18.8,6.8c12.8-6.7,15.9-11.8,18.8-61.6Z"/>
    <path class="wgst3" d="M46.6,285c0,4.5,23.8,13.3,52.9,13.3s52.9-8.8,52.9-13.3"/>
    <path class="wgst3" d="M152.5,262.7c0,4.5-23.7,8.1-52.9,8.1s-52.9-3.6-52.9-8.1"/>
    <line class="wgst3" x1="152.6" y1="285" x2="152.6" y2="94.5"/>
    <line class="wgst3" x1="46.6" y1="285" x2="46.6" y2="94.5"/>
  </g>
</svg>`;

// ── STATE ─────────────────────────────────────────────────────────────────────
let staffNumber    = null;   // 6-digit staff ID entered at welcome
let selectedCabin  = null;
let currentDrink   = null;
let fillPct        = 0;
let holding        = false;
let stopped        = false;
let animId         = null;
let totalScore     = SCORE_START;
let levelHistory   = [];   // history for the current level (up to 5 drinks)
let roundNumber    = 1;    // total drinks poured so far (ever-incrementing)
let levelNumber    = 1;    // current level (increments every 5 drinks)
const DRINKS_PER_LEVEL = 5;
let fillSpeed      = SPEED_MAP[1];
let currentSpeedLevel = 1;
let settingsOpen   = false;
let scoreSubmitted = false;  // ensure only one hub submission per play session
let isBonusLevel   = false;  // true during the bonus round after level 5
const MAX_MAIN_LEVELS = 5;   // bonus offered after this many levels

// ── UTIL ──────────────────────────────────────────────────────────────────────
function randomFrom(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

// True when a game session is actively in progress (game screen visible)
function gameInProgress() {
  return !document.getElementById('game').classList.contains('hidden');
}

function showOverlay(id) {
  ['overlayWelcome','overlayStaffNum','overlayTutorial','overlayCabin','overlayResults','overlayGameOver'].forEach(o=>{
    document.getElementById(o).classList.add('hidden');
  });
  if (id) document.getElementById(id).classList.remove('hidden');
  // Show resume button on the welcome screen only when a game is running
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) resumeBtn.style.display = (id === 'overlayWelcome' && gameInProgress()) ? '' : 'none';
}

function resumeGame() {
  showOverlay(null);   // hides all overlays, game stays visible
  setPourLabel('Hold glass to pour');
}

function setPourLabel(text) {
  const el = document.getElementById('gPourLabel');
  if (!el) return;
  // Only show the pour icon when the instruction is to "hold" (not "press")
  const isHoldInstruction = /\bhold\b/i.test(text);
  if (isHoldInstruction) {
    el.innerHTML = `<img src="./src/sys/hold.png" alt="" class="pour-label-icon">${text}`;
  } else {
    el.textContent = text;
  }
}

// ── STAFF NUMBER ──────────────────────────────────────────────────────────────
function showStaffEntry() {
  staffNumber = null;
  selectedCabin = null;
  showOverlay('overlayStaffNum');
  const inp = document.getElementById('staffInput');
  inp.value = '';
  inp.focus();
  validateStaffInput();
}

function validateStaffInput() {
  const inp = document.getElementById('staffInput');
  const val = inp.value.replace(/\D/g,'').slice(0,6);
  inp.value = val;
  const ok = val.length === 6;
  document.getElementById('staffConfirmBtn').disabled = !ok;
  document.getElementById('staffError').style.display = ok || val.length === 0 ? 'none' : 'block';
}

function confirmStaffNumber() {
  const val = document.getElementById('staffInput').value.replace(/\D/g,'');
  if (val.length !== 6) return;
  staffNumber = val;
  showCabinSelect();
}

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function toggleSettings() {
  settingsOpen = !settingsOpen;
  document.getElementById('settingsBtn').classList.toggle('active', settingsOpen);
  ['targetDial','speedControl','skipBtnWrap'].forEach(id=>{
    document.getElementById(id).classList.toggle('hidden-panel', !settingsOpen);
  });
}

// ── CABIN SELECT ──────────────────────────────────────────────────────────────
function showCabinSelect() {
  buildCabinGrid();
  showOverlay('overlayCabin');
}

function buildCabinGrid() {
  const grid = document.getElementById('cabinGrid');
  grid.innerHTML = '';
  cabins.forEach(c => {
    const el = document.createElement('div');
    el.className = 'cabin-card'
      + (c.Active ? '' : ' disabled')
      + (selectedCabin && selectedCabin.Id === c.Id ? ' selected' : '');
    el.innerHTML = `
      <div class="cabin-label" style="color:${c.Color}">${c.Label}</div>
      <div class="cabin-name">${c.Name}</div>
      ${!c.Active ? `<div class="cabin-badge" style="background:${c.Color}22;color:${c.Color};border:1px solid ${c.Color}55">Coming Soon</div>` : ''}
    `;
    if (c.Active) {
      el.addEventListener('click', () => {
        selectedCabin = c;
        document.querySelectorAll('.cabin-card').forEach(x=>x.classList.remove('selected'));
        el.classList.add('selected');
        startGame();
      });
    }
    grid.appendChild(el);
  });
}

function startGame() {
  if (!selectedCabin) selectedCabin = cabins.find(c=>c.Active);
  totalScore = SCORE_START;
  levelHistory = [];
  roundNumber = 1;
  levelNumber = 1;
  currentSpeedLevel = 1;
  fillSpeed = SPEED_MAP[1];
  scoreSubmitted = false;
  isBonusLevel = false;
  document.getElementById('speedSlider').value = currentSpeedLevel;
  document.getElementById('speedVal').textContent = SPEED_NAMES[currentSpeedLevel];
  showOverlay(null);
  document.getElementById('game').classList.remove('hidden');
  setupCabinHeader();
  updateScoreDisplay(0);
  loadNextDrink();

  const staffBadge = document.getElementById("header-staff-num");
  if (staffBadge) staffBadge.textContent = staffNumber;
}

function newLevel() {
  if (isBonusLevel) {
    // After bonus level, the game is truly done — submit and go to menu
    submitScoreToHub();
    showOverlay('overlayWelcome');
    return;
  }
  levelHistory = [];
  levelNumber++;
  currentSpeedLevel = Math.min(5, currentSpeedLevel + 1);
  fillSpeed = SPEED_MAP[currentSpeedLevel];
  document.getElementById('speedSlider').value = currentSpeedLevel;
  document.getElementById('speedVal').textContent = SPEED_NAMES[currentSpeedLevel];
  showOverlay(null);
  loadNextDrink();
}

function startBonusLevel() {
  isBonusLevel = true;
  levelHistory = [];
  // Bonus always at max speed
  currentSpeedLevel = 5;
  fillSpeed = SPEED_MAP[5];
  document.getElementById('speedSlider').value = 5;
  document.getElementById('speedVal').textContent = SPEED_NAMES[5];
  showOverlay(null);
  loadNextDrink();
}

function setupCabinHeader() {
  const badge = document.getElementById('gCabinBadge');
  const name  = document.getElementById('gCabinName');
  badge.textContent = selectedCabin.Label;
  badge.style.background = selectedCabin.Color+'28';
  badge.style.color = selectedCabin.Color;
  badge.style.border = `1px solid ${selectedCabin.Color}55`;
  name.textContent = selectedCabin.Name;
}

function getCabinDrinks() { return levels.filter(l=>l.cabin===selectedCabin.Label); }

function pickRandomDrink(exclude) {
  const pool = getCabinDrinks().filter(d=>!exclude||d.id!==exclude.id);
  return pool.length ? pool[Math.floor(Math.random()*pool.length)] : getCabinDrinks()[0];
}

function loadNextDrink() {
  currentDrink = pickRandomDrink(currentDrink);
  fillPct = 0; holding = false; stopped = false;
  cancelAnimationFrame(animId);

  document.getElementById('gDrinkName').textContent = currentDrink.name;
  document.getElementById('gDrinkCabin').textContent = selectedCabin.Label+' · '+selectedCabin.Name;
  document.getElementById('gHint').textContent = isBonusLevel
    ? '🎲 BONUS: ±1% target! Hold to pour'
    : 'Hold the glass to pour';
  document.getElementById('gPraise').className = 'praise-box hidden';
  setPourLabel(isBonusLevel ? '±1% target — hold to pour' : 'Hold glass to pour');
  const btn = document.getElementById('gActionBtn');
  btn.style.display = 'none';
  btn.disabled = false;
  document.getElementById('gLevelNum').textContent = isBonusLevel ? '★' : levelNumber;

  renderGlass();
  updateDial(0);
  buildPlaysTrack();
}

// ── GLASS ─────────────────────────────────────────────────────────────────────
function renderGlass() {
  const key = currentDrink.glass;
  const BG  = '#1A1209';
  let svg = SVG_TEMPLATES[key]
    .replace(/LIQUID_COLOR/g, currentDrink.color)
    .replace(/BG_COLOR/g, BG);
  const wrap = document.getElementById('glassWrap');
  const old  = wrap.querySelector('svg');
  if (old) wrap.removeChild(old);
  const tmp = document.createElement('div');
  tmp.innerHTML = svg;
  wrap.insertBefore(tmp.firstElementChild, wrap.firstChild);
  setFill(0);
}

// setFill: drives the #Liquid rect using per-glass coordinates from GLASS_CONFIG.
// At 0%  → y = initialY,              height = 0          (rect sits at bottom edge, invisible)
// At pct% → y = initialY - fillH,     height = fillH
// At 100% → y = initialY - fullRange, height = fullRange  (rect fills the full interior)
function setFill(pct) {
  const cfg = GLASS_CONFIG[currentDrink.glass];
  const el  = document.querySelector('#glassWrap svg #Liquid');
  if (!el || !cfg) return;
  const fillH = (pct / 100) * cfg.fullRange;
  el.setAttribute('y',      cfg.initialY - fillH);
  el.setAttribute('height', fillH);
}

// ── DIAL ──────────────────────────────────────────────────────────────────────
function updateDial(pct) {
  document.getElementById('dialPct').textContent = Math.round(pct)+'%';
  const fillArc = (pct/100)*CIRC;
  document.getElementById('dialFill').setAttribute('stroke-dasharray', `${fillArc} ${CIRC}`);
  if (!currentDrink) return;
  const tgt = currentDrink.target;
  const tgtArc = (tgt/100)*CIRC;
  document.getElementById('dialTarget').setAttribute('stroke-dasharray', `2 ${CIRC-2}`);
  document.getElementById('dialTarget').setAttribute('stroke-dashoffset', -(tgtArc-1));
  const activeRange = isBonusLevel ? 1 : RANGE_PCT;
  const lo = Math.max(0,tgt-activeRange), hi = Math.min(100,tgt+activeRange);
  const loArc=(lo/100)*CIRC, bandArc=((hi-lo)/100)*CIRC;
  document.getElementById('dialRange').setAttribute('stroke-dasharray', `${bandArc} ${CIRC-bandArc}`);
  document.getElementById('dialRange').setAttribute('stroke-dashoffset', -loArc);
}

// ── PLAYS TRACK ───────────────────────────────────────────────────────────────
function buildPlaysTrack() {
  const track = document.getElementById('playsTrack');
  track.innerHTML = '';
  const count = isBonusLevel ? 1 : DRINKS_PER_LEVEL;
  for (let i=0; i<count; i++) {
    const h = levelHistory[i];
    const dot = document.createElement('div');
    if (isBonusLevel) {
      dot.className = 'play-dot' + (h ? (h.perfect ? ' perfect' : ' done') : '');
      dot.style.width = '14px';
      dot.style.height = '14px';
      dot.style.borderColor = 'var(--gold)';
    } else {
      dot.className = 'play-dot'+(h ? (h.perfect?' perfect':' done') : '');
    }
    track.appendChild(dot);
  }
}

// ── SCORING ───────────────────────────────────────────────────────────────────
// Graduated table: index = % off target (0–15+), value = points delta
// 0%=perfect(40), 1%=15, 2%=12, 3%=10, 4%=6, 5%=3, 6%=3,
// 7%=-6, 8%=-10, 9%=-12, 10%=-15, 11–15%=-20, 16+%=-25
const SCORE_TABLE = [40, 15, 12, 10, 6, 3, 3, -6, -10, -12, -15, -20, -20, -20, -20, -20];

function calcScore(pct, target, rangePct) {
  const diff = Math.abs(Math.round(pct) - target);
  const range = rangePct !== undefined ? rangePct : RANGE_PCT;
  const perfect = diff === 0;
  // For bonus level the "perfect" zone is <=range (1%)
  const isPerfect = diff <= (range === 1 ? 0 : 0);
  const idx = Math.min(diff, SCORE_TABLE.length - 1);
  let delta = SCORE_TABLE[idx];
  if (diff > SCORE_TABLE.length - 1) delta = -25;
  delta = Math.max(-25, delta);
  return { delta, perfect: diff === 0 };
}

function updateScoreDisplay(delta) {
  document.getElementById('gScore').textContent = totalScore;
  const el = document.getElementById('gScoreChange');
  el.classList.remove('fade-out');
  if (delta>0)      { el.textContent='+'+delta+' pts'; el.className='score-change pos'; }
  else if (delta<0) { el.textContent=delta+' pts';     el.className='score-change neg'; }
  else              { el.textContent='';                el.className='score-change'; return; }
  clearTimeout(el._fadeTimer);
  el._fadeTimer = setTimeout(()=>{ el.classList.add('fade-out'); }, 2000);
  const sv = document.getElementById('gScore');
  sv.classList.remove('bump');
  requestAnimationFrame(()=>{ sv.classList.add('bump'); setTimeout(()=>sv.classList.remove('bump'),250); });
}

// ── POINTS FLOAT ANIMATION ────────────────────────────────────────────────────
function spawnFloatingPts(delta) {
  const wrap  = document.getElementById('glassWrap');
  const wRect = wrap.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'pts-float';
  el.textContent = (delta>0?'+':'')+delta;
  el.style.color = delta>0 ? '#E8C97A' : '#E87878';
  el.style.textShadow = delta>0 ? '0 0 20px rgba(232,201,122,0.6)' : '0 0 20px rgba(232,120,120,0.5)';
  el.style.position = 'fixed';
  el.style.left = (wRect.left + wRect.width/2 - 30) + 'px';
  el.style.top  = (wRect.top  + wRect.height/2 - 20) + 'px';
  el.style.zIndex = '200';
  document.body.appendChild(el);
  animateScoreTick(totalScore - delta, totalScore, delta > 0);
  el.addEventListener('animationend', ()=>el.remove());
}

function animateScoreTick(from, to, positive) {
  const el = document.getElementById('gScore');
  const steps = 20;
  const step = (to-from)/steps;
  let cur = from, i=0;
  const tick = ()=>{
    i++;
    cur = i>=steps ? to : Math.round(from + step*i);
    el.textContent = cur;
    if (i<steps) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── LEADERBOARD SUBMISSION ────────────────────────────────────────────────────
function submitScoreToHub() {
  if (!staffNumber || !selectedCabin) return;
  if (scoreSubmitted) return;  // only submit once per play session
  scoreSubmitted = true;
  try {
    const existing = JSON.parse(localStorage.getItem('aeroplay_pending_scores') || '[]');
    const entry = {
      id:       `pourfect-${staffNumber}-${Date.now()}`,
      nickname: staffNumber,
      game:     'pourfect',
      score:    totalScore,
      date:     new Date().toISOString(),
      cabinId:  selectedCabin.Id,
    };
    existing.push(entry);
    localStorage.setItem('aeroplay_pending_scores', JSON.stringify(existing));
  } catch(e) { /* localStorage unavailable — silent fail */ }
}

// ── GAME FLOW ─────────────────────────────────────────────────────────────────
function startPour() {
  if (stopped || fillPct>=100) return;
  holding = true;
  document.getElementById('gPraise').className='praise-box hidden';
  document.getElementById('gHint').textContent = 'Pouring… release to stop';
  setPourLabel('Release to stop');
  loop();
}

function loop() {
  if (!holding || fillPct>=100) { holding=false; evaluate(); return; }
  fillPct = Math.min(100, fillPct+fillSpeed);
  setFill(fillPct);
  updateDial(fillPct);
  animId = requestAnimationFrame(loop);
}

function stopPour() { if (!holding) return; holding=false; }

function evaluate() {
  if (stopped) return;
  stopped = true;
  cancelAnimationFrame(animId);

  const pct = Math.round(fillPct);
  const bonusRange = 1; // ±1% for bonus level
  const activeRange = isBonusLevel ? bonusRange : RANGE_PCT;
  const {delta, perfect} = calcScore(pct, currentDrink.target, activeRange);

  // Bonus level: double if within ±1%, lose all if outside
  let actualDelta = delta;
  if (isBonusLevel) {
    const diff = Math.abs(pct - currentDrink.target);
    if (diff <= bonusRange) {
      // Success: double the score
      actualDelta = totalScore; // add totalScore (so total becomes 2×)
    } else {
      // Failure: lose everything
      actualDelta = -totalScore;
    }
  }

  totalScore = Math.max(0, totalScore + actualDelta);

  // 1 drink = 1 round; track within current level
  levelHistory.push({drink:currentDrink.name, pct, delta: actualDelta, perfect: isBonusLevel ? Math.abs(pct - currentDrink.target) <= bonusRange : perfect});
  roundNumber++;  // total drinks ever poured

  spawnFloatingPts(actualDelta);
  setTimeout(()=>updateScoreDisplay(actualDelta), 200);
  buildPlaysTrack();
  updateDial(pct);

  const praise = document.getElementById('gPraise');
  const offset = pct - currentDrink.target;
  const offsetStr = (offset > 0 ? '+' : '') + offset + '%';
  const ptStr = (actualDelta > 0 ? '+' : '') + actualDelta + ' pts';
  let phrase, cls;
  if (isBonusLevel) {
    const bonusHit = Math.abs(pct - currentDrink.target) <= bonusRange;
    phrase = bonusHit ? '🎯 Bonus! Score doubled!' : '💥 Missed bonus — score lost!';
    cls = bonusHit ? 'praise-box good' : 'praise-box bad';
  } else if (perfect) {
    phrase = randomFrom(MSG_PERFECT); cls = 'praise-box good';
  } else if (actualDelta > 0) {
    phrase = randomFrom(MSG_GOOD);    cls = 'praise-box good';
  } else {
    phrase = randomFrom(pct > currentDrink.target ? MSG_BAD_OVER : MSG_BAD_UNDER);
    cls = 'praise-box bad';
  }
  praise.innerHTML = `
    <div class="praise-row"><span>${phrase}</span></div>
    <div class="praise-row"><span class="praise-row-label">Poured</span><span class="praise-row-val">${pct}%</span></div>
    <div class="praise-row"><span class="praise-row-label">Target</span><span class="praise-row-val">${currentDrink.target}%</span></div>
    <div class="praise-row"><span class="praise-row-label">Difference</span><span class="praise-row-val">${offsetStr}</span></div>
    <div class="praise-row"><span class="praise-row-label">Points</span><span class="praise-row-val">${ptStr}</span></div>
  `;
  praise.className = cls;

  if (totalScore <= 0) {
    submitScoreToHub();
    setTimeout(()=>{ showOverlay('overlayGameOver'); }, 1400);
    document.getElementById('gHint').textContent = '⚠ Score reached zero…';
    setPourLabel('');
    return;
  }

  if (isBonusLevel) {
    // Bonus level: show results after the single drink
    setTimeout(showBonusResults, 1300);
    document.getElementById('gActionBtn').style.display = 'none';
    setPourLabel('');
    return;
  }

  // Every 5 drinks = end of level → show results screen
  if (levelHistory.length >= DRINKS_PER_LEVEL) {
    setTimeout(showResults, 1300);
    document.getElementById('gActionBtn').style.display = 'none';
    setPourLabel('');
  } else {
    document.getElementById('gHint').textContent = 'Tap glass or Next to continue';
    const btn = document.getElementById('gActionBtn');
    btn.textContent = 'Next drink →';
    btn.style.display = '';
    btn.disabled = false;
    setPourLabel('Tap glass for next drink');
  }
}

function handleAction() {
  if (!stopped) return;
  if (isBonusLevel) { showBonusResults(); return; }
  if (levelHistory.length >= DRINKS_PER_LEVEL) { showResults(); } else { loadNextDrink(); }
}

function skipDrink() { if (!stopped) stopPour(); loadNextDrink(); }

function showResults() {
  const drinks = document.getElementById('resultsDrinks');
  drinks.innerHTML='';
  levelHistory.forEach(h=>{
    const row = document.createElement('div');
    row.className='result-row';
    const sc=h.delta>=0?'pos':'neg', pf=h.delta>=0?'+':'';
    row.innerHTML=`<span class="rr-drink">${h.drink} <span style="color:var(--text-dim);font-size:10px">${h.pct}%${h.perfect?' 🎯':''}</span></span><span class="rr-score ${sc}">${pf}${h.delta}</span>`;
    drinks.appendChild(row);
  });
  document.getElementById('resultsRoundBadge').textContent = `Level ${levelNumber} complete`;
  document.getElementById('resultsTotal').textContent = `Total Score: ${totalScore}`;

  const isLastMainLevel = levelNumber >= MAX_MAIN_LEVELS;
  const nextBtn = document.getElementById('nextLevelBtn');

  if (isLastMainLevel) {
    // Offer bonus level
    document.getElementById('resultsSpeedBadge').textContent = `⚡ Bonus Round available — double or nothing!`;
    const msg = totalScore>=100 ? "Outstanding service! ✈" : totalScore>=70 ? "Solid round, keep it up!" : "Hanging in there — stay focused!";
    document.getElementById('resultsMsg').textContent = msg;
    nextBtn.textContent = '🎲 Enter Bonus Round';
    nextBtn.onclick = startBonusLevel;
    // Also add a "finish" option
    document.getElementById('resultsMsg').innerHTML = `${msg}<br><br><button class="btn btn-ghost" style="margin-top:8px;font-size:11px;" onclick="submitScoreToHub();showOverlay('overlayWelcome')">Skip bonus & finish →</button>`;
  } else {
    const nextSpeed = Math.min(5, currentSpeedLevel+1);
    document.getElementById('resultsSpeedBadge').textContent = `Level ${levelNumber+1}: ${SPEED_NAMES[nextSpeed]} speed ↑`;
    const msg = totalScore>=100 ? "Outstanding service! ✈" : totalScore>=70 ? "Solid round, keep it up!" : "Hanging in there — stay focused!";
    document.getElementById('resultsMsg').textContent = msg;
    nextBtn.textContent = `Level ${levelNumber+1} →`;
    nextBtn.onclick = newLevel;
  }

  showOverlay('overlayResults');
}

function showBonusResults() {
  const h = levelHistory[0];
  const hit = h && h.perfect;
  const drinks = document.getElementById('resultsDrinks');
  drinks.innerHTML = '';
  if (h) {
    const row = document.createElement('div');
    row.className = 'result-row';
    const sc = h.delta >= 0 ? 'pos' : 'neg', pf = h.delta >= 0 ? '+' : '';
    row.innerHTML = `<span class="rr-drink">${h.drink} <span style="color:var(--text-dim);font-size:10px">${h.pct}%${hit?' 🎯':''}</span></span><span class="rr-score ${sc}">${pf}${h.delta}</span>`;
    drinks.appendChild(row);
  }
  document.getElementById('resultsRoundBadge').textContent = `Bonus Round`;
  document.getElementById('resultsTotal').textContent = `Final Score: ${totalScore}`;
  document.getElementById('resultsSpeedBadge').textContent = hit ? '🎉 Score doubled!' : '💥 Score lost!';
  document.getElementById('resultsMsg').textContent = hit ? 'Incredible precision — you nailed the bonus!' : 'So close! Better luck next time.';

  const nextBtn = document.getElementById('nextLevelBtn');
  nextBtn.textContent = 'Finish ✓';
  nextBtn.onclick = () => { submitScoreToHub(); showOverlay('overlayWelcome'); };

  showOverlay('overlayResults');
}

// ── SPEED SLIDER ──────────────────────────────────────────────────────────────
document.getElementById('speedSlider').addEventListener('input', ()=>{
  const v = parseInt(document.getElementById('speedSlider').value);
  fillSpeed = SPEED_MAP[v];
  currentSpeedLevel = v;
  document.getElementById('speedVal').textContent = SPEED_NAMES[v];
});

// ── POUR EVENTS ───────────────────────────────────────────────────────────────
const glassWrap = document.getElementById('glassWrap');
glassWrap.addEventListener('mousedown', ()=>{ if (stopped) { handleAction(); } else { startPour(); } });
document.addEventListener('mouseup', stopPour);
glassWrap.addEventListener('touchstart', e=>{
  e.preventDefault();
  if (stopped) { handleAction(); } else { startPour(); }
},{passive:false});
document.addEventListener('touchend', stopPour);

// ── INIT ──────────────────────────────────────────────────────────────────────
['targetDial','speedControl','skipBtnWrap'].forEach(id=>document.getElementById(id).classList.add('hidden-panel'));
showOverlay('overlayWelcome');