/* =====================================================
   COCKTAIL CODEX — All-in-one: data + game logic
   ===================================================== */

// ─── MEASURES ────────────────────────────────────────

const toolMeasures = [
  { label: "1/3 single", value: 0.3 },
  { label: "1/2 single", value: 0.5 },
  { label: "single",     value: 1   },
  { label: "double",     value: 2   },
  { label: "top up",     value: 10  }
];

const toolItems = [
  { id: 1,  name: "Dry gin",            image: "./src/ingridients/dry_gin.png" },
  { id: 2,  name: "Martini Extra Dry",  image: "./src/ingridients/martini_extra_dry.png" },
  { id: 3,  name: "Cointreau",          image: "./src/ingridients/cointreau.png" },
  { id: 5,  name: "Lime juice",         image: "./src/ingridients/lime_juice.png" },
  { id: 6,  name: "Fresh orange juice", image: "./src/ingridients/fresh_orange_juice.png" },
  { id: 7,  name: "Vodka",              image: "./src/ingridients/vodka.png" },
  { id: 8,  name: "Cranberry juice",    image: "./src/ingridients/cranberry_juice.png" },
  { id: 9,  name: "Tomato juice",       image: "./src/ingridients/tomato_juice.png" },
  { id: 13, name: "Crème de Cassis",    image: "./src/ingridients/creme_de_cassis.png" },
  { id: 14, name: "Champagne",          image: "./src/ingridients/champagne.png" },
  { id: 15, name: "Bourbon whiskey",    image: "./src/ingridients/bourbon_whiskey.png" },
  { id: 17, name: "Martini Rosso",      image: "./src/ingridients/martini_rosso.png" },
  { id: 18, name: "Tia Maria",          image: "./src/ingridients/tia_maria.png" },
  { id: 19, name: "Espresso",           image: "./src/ingridients/espresso.png" },
  { id: 20, name: "White rum",          image: "./src/ingridients/white_rum.png" },
  { id: 24, name: "Soda",              image: "./src/ingridients/soda.png" },
  { id: 26, name: "Cognac",            image: "./src/ingridients/cognac.png" },
  { id: 27, name: "Campari",           image: "./src/ingridients/campari.png" },
  { id: 28, name: "Aperol Spritz",     image: "./src/ingridients/aperol_spritz.png" }
].map(item => ({ ...item, measureOptions: toolMeasures }));

const ingridients = [
  { id: 21, name: "Mint leaves",        image: "./src/ingridients/mint_leaves.png",
            measureOptions: [{ label: "1 leaf", value: 1 }, { label: "4 leaves", value: 4 }, { label: "6 leaves", value: 6 }, { label: "8 leaves", value: 8 }, { label: "10 leaves", value: 10 }]

   },
  { id: 22, name: "Lime wedges",        image: "./src/ingridients/lime_wedges.png",
    measureOptions: [{ label: "1 wedge", value: 1 }, { label: "2 wedges", value: 2 }, { label: "4 wedges", value: 4 }, { label: "6 wedges", value: 6 }, { label: "8 wedges", value: 8 }]

   },
  {
    id: 4, name: "Orange marmelade", image: "./src/ingridients/orange_marmelade.png",
    measureOptions: [{ label: "1 spoon", value: 1 }, { label: "2 spoons", value: 2 }, { label: "3 spoons", value: 3 }]
  },
  {
    id: 10, name: "Tabasco sauce", image: "./src/ingridients/tabasco_sauce.png",
    measureOptions: [{ label: "1 dash", value: 1 }, { label: "2 dashes", value: 2 }, { label: "3 dashes", value: 3 }]
  },
  {
    id: 11, name: "Worcestershire sauce", image: "./src/ingridients/worcestershire_sauce.png",
    measureOptions: [{ label: "1 dash", value: 1 }, { label: "2 dashes", value: 2 }, { label: "3 dashes", value: 3 }]
  },
  {
    id: 16, name: "Angostura bitters", image: "./src/ingridients/angostura_bitters.png",
    measureOptions: [{ label: "1 dash", value: 1 }, { label: "2 dashes", value: 2 }, { label: "3 dashes", value: 3 }]
  },
  {
    id: 25, name: "Sugar", image: "./src/ingridients/sugar.png",
    measureOptions: [{ label: "1 sachet", value: 1 }, { label: "2 sachets", value: 2 }, { label: "3 sachets", value: 3 }]
  },
  {
    id: 23, name: "Sugar syrup", image: "./src/ingridients/sugar_syrup.png",
    measureOptions: [{ label: "1 sachet", value: 1 }, { label: "2 sachets", value: 2 }, { label: "3 sachets", value: 3 }]
  },
  { id: 12, name: "Salt and pepper", image: "./src/ingridients/salt_and_pepper.png", measureOptions: [] },
  { id: 0,  name: "Ice",             image: "./src/ingridients/ice.png",             measureOptions: [] },
  ...toolItems
];

const garnishes = [
  { id: 1, name: "Olive",             image: "./src/garnishes/olive_on_skewer.png" },
  { id: 2, name: "Lemon slice",       image: "./src/garnishes/lemon_slice.png" },
  { id: 3, name: "Celery stick",      image: "./src/garnishes/celery_stick.png" },
  { id: 4, name: "Maraschino cherry", image: "./src/garnishes/maraschino_cherry.png" },
  { id: 5, name: "Orange slice",      image: "./src/garnishes/orange_slice.png" },
  { id: 6, name: "Mint sprig",        image: "./src/garnishes/mint_sprig.png" },
  { id: 7, name: "Coffee beans",      image: "./src/garnishes/coffee_beans.png" }
];

const glasses = [
  { id: 1, name: "Cocktail glass",              image: "./src/glasses/cocktail_glass.png" },
  { id: 2, name: "Tumbler / Crystal cut glass", image: "./src/glasses/tumbler_crystal_cut.png" },
  { id: 3, name: "Champagne flute",             image: "./src/glasses/champagne_flute.png" },
  { id: 4, name: "Wine glass",                  image: "./src/glasses/wine_glass.png" }
];

// ─── COCKTAILS (with color property) ─────────────────

const cocktails = [
  {
    id: 1, name: "Bloody Mary", glass: 2, garnish: [2, 3], useShaker: false,
    color: "#d04040",
    ingridient: [
      { id: 0, measure: 1 }, { id: 7, measure: 2 }, { id: 9, measure: 10 },
      { id: 10, measure: 1 }, { id: 11, measure: 1 }, { id: 12, measure: 1 }
    ]
  },
  {
    id: 2, name: "Cosmopolitan", glass: 1, garnish: [], useShaker: true,
    color: "#e07a8a",
    ingridient: [
      { id: 0, measure: 1 }, { id: 7, measure: 0.5 }, { id: 3, measure: 0.5 },
      { id: 8, measure: 1 }, { id: 5, measure: 0.5 }
    ]
  },
  {
    id: 3, name: "Classic Martini", glass: 1, garnish: [1], useShaker: true,
    color: "#dce8f2",
    ingridient: [
      { id: 0, measure: 1 }, { id: 1, measure: 2 }, { id: 2, measure: 0.5 }
    ]
  },
  {
    id: 4, name: "Kir Royale", glass: 3, garnish: [], useShaker: false,
    color: "#a060c0",
    ingridient: [
      { id: 13, measure: 0.3 }, { id: 14, measure: 10 }
    ]
  },
  {
    id: 5, name: "Manhattan", glass: 2, garnish: [4, 2], useShaker: true,
    color: "#c0702a",
    ingridient: [
      { id: 0, measure: 1 }, { id: 15, measure: 2 }, { id: 16, measure: 2 },
      { id: 2, measure: 0.5 }, { id: 17, measure: 0.5 }
    ]
  },
  {
    id: 6, name: "Breakfast Martini", glass: 1, garnish: [], useShaker: true,
    color: "#f0c050",
    ingridient: [
      { id: 0, measure: 1 }, { id: 1, measure: 1 }, { id: 3, measure: 0.5 },
      { id: 4, measure: 1 }, { id: 5, measure: 0.5 }, { id: 6, measure: 0.5 }
    ]
  },
  {
    id: 7, name: "Espresso Martini", glass: 1, garnish: [7], useShaker: true,
    color: "#1a1a1a",
    ingridient: [
      { id: 0, measure: 1 }, { id: 7, measure: 1 }, { id: 18, measure: 1 }, { id: 19, measure: 1 }
    ]
  },
  {
    id: 8, name: "Mojito", glass: 2, garnish: [6], useShaker: false,
    color: "#c8e0a0",
    ingridient: [
      { id: 0, measure: 1 }, { id: 20, measure: 2 }, { id: 21, measure: 10 },
      { id: 22, measure: 4 }, { id: 23, measure: 2 }, { id: 24, measure: 10 }
    ]
  },
  {
    id: 9, name: "Old Fashioned", glass: 2, garnish: [4, 5], useShaker: false,
    color: "#c07030",
    ingridient: [
      { id: 0, measure: 1 }, { id: 15, measure: 1 }, { id: 16, measure: 2 }, { id: 23, measure: 1 }
    ]
  },
  {
    id: 10, name: "Champagne Cocktail", glass: 3, garnish: [4, 5], useShaker: false,
    color: "#d0c070",
    ingridient: [
      { id: 14, measure: 10 }, { id: 16, measure: 2 }, { id: 25, measure: 1 }, { id: 26, measure: 0.5 }
    ]
  },
  {
    id: 11, name: "Negroni", glass: 2, garnish: [5], useShaker: true,
    color: "#e05060",
    ingridient: [
      { id: 0, measure: 1 }, { id: 1, measure: 1 }, { id: 27, measure: 1 }, { id: 17, measure: 1 }
    ]
  },
  {
    id: 12, name: "Aperol Spritz", glass: 4, garnish: [5], useShaker: false,
    color: "#f08030",
    ingridient: [
      { id: 0, measure: 1 }, { id: 28, measure: 10 }
    ]
  },
  {
    id: 13, name: "Vesper", glass: 1, garnish: [2], useShaker: true,
    color: "#dce8f2",
    ingridient: [
      { id: 0, measure: 1 }, { id: 1, measure: 2 }, { id: 7, measure: 1 }, { id: 2, measure: 0.5 }
    ]
  },
  {
    id: 14, name: "Rum Revolver", glass: 2, garnish: [5], useShaker: true,
    color: "#c08060",
    ingridient: [
      { id: 20, measure: 2 }, { id: 18, measure: 0.5 }, { id: 16, measure: 3 }
    ]
  }
];

// ─── GLASS SVG TEMPLATES ──────────────────────────────────────────────────────
// New illustrated SVGs. BG_COLOR is replaced with the page background so the
// glass "mask" works, LIQUID_COLOR is the cocktail colour.

const STROKE = '#8A7A5A';
const BG = '#0D1B2A'; // matches --navy

// initialY  = the y attribute of #Liquid at 0% fill (bottom of fillable area)
// fullRange = total fillable height in SVG units (0→100%)
// At pct%: y = initialY - (pct/100)*fullRange,  height = (pct/100)*fullRange
/*
const GLASS_CONFIG = {
  1: { initialY: 140, fullRange: 133 }, // cocktail/martini (triangle body)
  2: { initialY: 270.8, fullRange: 176.3 }, // tumbler
  3: { initialY: 183,   fullRange: 176.2 }, // champagne flute
  4: { initialY: 182.5, fullRange: 176.2 }, // wine glass
};
*/
const GLASS_CONFIG = { //to 80%
  1: { initialY: 140,   fullRange: 106.4 },   // cocktail/martini
  2: { initialY: 270.8, fullRange: 141 },  // tumbler
  3: { initialY: 183,   fullRange: 141 },  // champagne flute
  4: { initialY: 182.5, fullRange: 141 },  // wine glass
};


// Build SVG string from template, substituting colours
function buildGlassSVG(template, color) {
  return template
    .replace(/LIQUID_COLOR/g, color)
    .replace(/BG_COLOR/g, BG);
}

// SVG templates — id="Liquid" rect drives the fill animation
const SVG_TEMPLATES = {};

SVG_TEMPLATES[1] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.cli{fill:#fff}.cst{fill:#c7d2d4}.cst3{fill:none;stroke:${STROKE};stroke-miterlimit:10}</style></defs>
  <path class="cst" d="M194.3,6.9c-81.8,135.2-75.7,144.3-93.3,143.9,6.4-43.5,15.8-67.8,45.7-147.8,0,0,40.1.8,47.7,3.9h0Z"/>
  <rect id="Liquid" y="150" width="195" height="0" fill="LIQUID_COLOR"/>
  <path style="fill:BG_COLOR;stroke:none" d="M0,0v300h200V0H0ZM116.4,140.9c-7.7,13.1-25.9,13.1-33.5,0L5.6,7.7c3.7,2.6,44.4,4.6,94.1,4.6s90.4-2,94.1-4.6l-77.3,133.2Z"/>
  <path class="cli" d="M88.2,141.4c-6.2-36.8-14.8-55.3-42.5-129.4l-24.4-1.6,66.8,130.9h0Z"/>
  <ellipse class="cst3" cx="100" cy="7.5" rx="94.3" ry="5.2"/>
  <g id="Stem">
    <path class="cst" d="M112.6,146s-5.8,4.6-11.7,4.6c-1.4,32.5-3.2,132.2,4.2,140.1,7.1-1.2,9.8-3.8,9.8-3.8,0,0-8.1-8.1-9.1-23.4-1.3-21.4-.9-69.1-.2-94.6,1.3-14.4,6.8-22.9,6.8-22.9h.2,0Z"/>
    <path class="cst3" d="M101.2,151c-8.3,1-14.9-5.8-14.9-5.8,0,0,7.2,8.9,8.4,23.1,1.3,25.4,1.1,73.2-.2,94.6-.9,15.3-9.1,23.4-9.1,23.4,0,0,6.2,4.9,14.8,4.8h0c8.6,0,14.8-4.8,14.8-4.8,0,0-8.1-8.1-9.1-23.4-1.3-21.4-1.4-69.3-.2-94.6,1.3-14.4,6.8-22.5,6.8-22.5,0,0-5.8,5.1-11.7,5.1h.4,0Z"/>
  </g>
  <g>
    <path class="cst" d="M157.7,291.1c-.7-3.4-34.4-9.1-49.8-11.1,4.7,8.7,7.6,4.6-3.6,9.5,8.4,2.3,9.8,7.3,9.8,7.3,21.3-.3,43.6-2.2,43.5-5.6h0Z"/>
    <path class="cst3" d="M89.5,280.6c-17.1,2.4-46.5,7.7-46.5,10.5"/>
    <path class="cst3" d="M157.7,291.1c0-3.1-32.8-9.1-47.5-11.1"/>
    <path class="cst3" d="M43.1,293.6c-2.8,8.6,117.4,8.6,114.8,0"/>
    <path class="cst3" d="M43.1,291.1c-2.8,8.6,117.4,8.6,114.8,0"/>
    <line class="cst3" x1="43.1" y1="293.6" x2="43.1" y2="291.1"/>
    <line class="cst3" x1="157.7" y1="291.1" x2="157.7" y2="293.6"/>
  </g>
  <path class="cst3" d="M5.7,7.5l77.6,133.6c7.6,13.1,25.8,13.1,33.5,0L194.2,7.5"/>
  <g id="garnish-display" opacity="0"/>
</svg>`;

SVG_TEMPLATES[2] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.tli{fill:#fff}.tst{fill:#c7d2d4}.tst3{fill:none;stroke:${STROKE};stroke-miterlimit:10}.tst3s{fill:#8f989a}</style></defs>
  <path class="tst" d="M124.6,90.9s2.6,130.8,1.1,172.3c0,1.9-1.5,6.9-4.3,6.9,9.9.9,48.2-.7,51.7-9.1-.7-32.9,0-129-.4-166.5-9.7-2.6-48.1-3.7-48.1-3.7h0Z"/>
  <rect id="Liquid" y="270.8" width="195" height="0" fill="LIQUID_COLOR"/>
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
  <g id="garnish-display" opacity="0"/>
</svg>`;

SVG_TEMPLATES[3] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.cst{fill:#c7d2d4}.cli{fill:#fff}.cst2{fill:none;stroke:${STROKE};stroke-miterlimit:10}</style></defs>
  <path class="cst" d="M140.9,7.4c13.6,115.3,7.3,167.6-41.5,175.6,36.1-32.1,39.7-89.1,24-179.8,0,0,13.9.5,17.5,4.2Z"/>
  <rect id="Liquid" y="183" width="195" height="0" fill="LIQUID_COLOR"/>
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
  <g id="garnish-display" opacity="0"/>
</svg>`;

SVG_TEMPLATES[4] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <defs><style>.wst{fill:#c8d3d4}.wli{fill:#fff}.wst3{fill:none;stroke:${STROKE};stroke-miterlimit:10}</style></defs>
  <path class="wst" d="M157.1,6.3c46.7,104.2,29.3,169.5-53.2,176.4,43-31.6,70.2-92.9,35.8-179.8,0,0,15.8.9,17.4,3.4Z"/>
  <rect id="Liquid" y="182.5" width="195" height="0" fill="LIQUID_COLOR"/>
  <path style="fill:BG_COLOR" d="M0,0v300h200V0H0ZM183.4,103c-2.6,79.5-79.3,79.5-79.3,79.5,0,0-79-.1-79.5-76.9-.2-33.6,26.4-98.4,26.4-98.4l.3-.7c5.5,2.1,27.7,4.4,52.8,4.4s50.1-1.9,52.6-4.3c2.4,5.8,27.8,67.6,26.8,96.5h0Z"/>
  <path class="wli" d="M58.3,9.2c3.4.4,5.9,1.4,10.8,1.5-29.4,72.7-14.7,121.2,7,146.6C30.2,126.8,30.7,84.9,58.3,9.2Z"/>
  <g>
    <path class="wst" d="M168.6,290c-.8-3.6-38.8-9.7-56.2-11.8,5.3,9.2,8.6,4.9-4,10.1,9.4,2.4,11,7.8,11,7.8,24-.3,49.2-2.3,49.1-6h.1Z"/>
    <path class="wst3" d="M91.7,278.8c-19.3,2.5-52.4,8.2-52.4,11.3"/>
    <path class="wst3" d="M168.6,290c0-3.9-50.4-11.8-56.6-11.8"/>
    <path class="wst3" d="M39.3,292.6c-3.1,9.1,132.4,9.1,129.3,0"/>
    <path class="wst3" d="M39.3,290c-3.1,9.1,132.4,9.1,129.3,0"/>
    <line class="wst3" x1="39.3" y1="292.6" x2="39.3" y2="290"/>
    <line class="wst3" x1="168.6" y1="290" x2="168.6" y2="292.6"/>
  </g>
  <g>
    <path class="wst" d="M119,181.5s-9.1,2.2-15.7,2.2c-1.6,24.2-3.6,98.6,4.8,104.4,8-.9,11-2.9,11-2.9,0,0-9.1-6-10.2-17.4-1.4-16-1-51.5-.2-70.5,1.4-10.7,10.2-15.9,10.2-15.9h0Z"/>
    <path class="wst3" d="M102.3,183.4c-6.6,0-16.6-2.2-16.6-2.2,0,0,8.9,5.2,10.2,15.9,1.4,18.9,1.2,54.5-.2,70.5-1,11.4-10.2,17.4-10.2,17.4,0,0,7,3.6,16.7,3.5h0c9.7.1,16.7-3.5,16.7-3.5,0,0-9.1-6-10.2-17.4-1.4-16-1.6-51.6-.2-70.5,1.4-10.7,10.2-15.9,10.2-15.9,0,0-10,2.2-16.6,2.2"/>
  </g>
  <ellipse class="wst3" cx="104" cy="6.3" rx="53.1" ry="5.1"/>
  <path class="wst3" d="M51,7.4s-26.6,64.8-26.4,98.4c.5,76.8,79.5,76.9,79.5,76.9,0,0,76.7,0,79.3-79.5,1-30.3-27-96.9-27-96.9"/>
  <g id="garnish-display" opacity="0"/>
</svg>`;

// Build a glass SVG for a given glass id and cocktail color
function getGlassSVG(glassId, color) {
  const tmpl = SVG_TEMPLATES[glassId];
  if (!tmpl) return '';
  return buildGlassSVG(tmpl, color);
}

// ─── GAME STATE ──────────────────────────────────────

let state = {
  staffNumber: null,
  currentCocktail: null,
  cocktailQueue: [],
  cocktailIndex: 0,

  // Which palette section is currently visible (1-4)
  activeStep: 1,

  shakerConfirmed: false,
  glassConfirmed: false,
  droppedIngredientIds: new Set(),
  droppedGarnishIds: new Set(),

  totalScore: 20,
  cocktailScore: 0,
  cocktailMistakes: 0,
  cocktailsMade: 0,

  toastTimer: null,
  timerInterval: null,
  timerSeconds: 60,
  dragGhost: null,
  dragData: null,
  devToolsOpen: false,
  pendingMeasureIng: null,
};

// ─── DOM SHORTCUT ────────────────────────────────────

const $ = (id) => document.getElementById(id);

// ─── OVERLAY HELPERS ─────────────────────────────────

function showOverlay(id) {
  document.querySelectorAll(".overlay").forEach(el => {
    el.classList.toggle("hidden", el.id !== id);
  });
  // Reset staff input when returning to welcome
  if (id === "overlayWelcome") resetStaffInput();
}

function hideAllOverlays() {
  document.querySelectorAll(".overlay").forEach(el => el.classList.add("hidden"));
}

// ─── STAFF ENTRY ─────────────────────────────────────

function showStaffEntry() {
  showOverlay("overlayStaffNum");
  setTimeout(() => $("staffInput").focus(), 100);
}

function validateStaffInput() {
  const val = $("staffInput").value.replace(/\D/g, "");
  $("staffInput").value = val;
  // Hide error while user is typing (only show on submit attempt)
  $("staffError").style.opacity = "0";
}

function confirmStaffNumber() {
  const val = $("staffInput").value.trim();
  if (val.length !== 6) {
    $("staffError").style.opacity = "1";
    return;
  }
  $("staffError").style.opacity = "0";
  state.staffNumber = val;
  startGame();
}

function resetStaffInput() {
  $("staffInput").value = "";
  $("staffError").style.opacity = "0";
}

// ─── GAME START / RESTART ────────────────────────────

function startGame() {
  state.cocktailQueue = shuffleArray(cocktails.map(c => c.id));
  state.cocktailIndex = 0;

  state.cocktailsMade = 0;
  state.totalScore = 20;

  hideAllOverlays();
  $("game").classList.remove("hidden");
  $("resumeBtn").style.display = "block";

  const staffBadge = $("header-staff-num");
  if (staffBadge) staffBadge.textContent = state.staffNumber;

  renderPalette();
  loadCocktailByIndex(0);
}

function restartGame() { showStaffEntry(); }

function resumeGame() {
  hideAllOverlays();
  $("game").classList.remove("hidden");
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// ─── COCKTAIL TIMER ──────────────────────────────────

const TIMER_DURATION = 60;

function startCocktailTimer() {
  clearCocktailTimer();
  state.timerSeconds = TIMER_DURATION;
  updateTimerUI();
  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerUI();
    if (state.timerSeconds <= 0) {
      clearCocktailTimer();
      onTimerExpired();
    }
  }, 1000);
}

function clearCocktailTimer() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
}

function updateTimerUI() {
  const bar = $("timer-bar-fill");
  const label = $("timer-label");
  if (!bar || !label) return;
  const pct = Math.max(0, (state.timerSeconds / TIMER_DURATION) * 100);
  bar.style.width = pct + "%";
  label.textContent = state.timerSeconds + "s";
}

function onTimerExpired() {
  const c = state.currentCocktail;
  if (!c) return;
  let incomplete = 0;
  if (!state.shakerConfirmed) incomplete++;
  if (!state.glassConfirmed) incomplete++;
  incomplete += c.ingridient.filter(({id}) => !state.droppedIngredientIds.has(id)).length;
  incomplete += (c.garnish || []).filter(gid => !state.droppedGarnishIds.has(gid)).length;

  const penalty = incomplete * 5;
  if (penalty > 0) addScore(-penalty);

  state.cocktailsMade++;
  updateHeaderStats();
  $("feedback").textContent = "⏰ Time's up!";
  setTimeout(() => showCelebration(false, true, penalty, incomplete), 400);
}

// ─── LOAD COCKTAIL ───────────────────────────────────

function loadCocktailByIndex(idx) {
  if (idx >= cocktails.length) { saveScore(); showGameComplete(); return; }

  const cocktail = cocktails.find(c => c.id === state.cocktailQueue[idx]);
  state.currentCocktail = cocktail;
  state.cocktailIndex   = idx;

  state.shakerConfirmed      = false;
  state.glassConfirmed       = false;
  state.droppedIngredientIds = new Set();
  state.droppedGarnishIds    = new Set();
  state.cocktailScore        = 0;   // each cocktail starts at 0; total carries over
  state.cocktailMistakes     = 0;    // track mistakes for perfect bonus
  state.pendingMeasureIng    = null;

  // Reset UI text
  $("task-name").textContent = cocktail.name;
  $("feedback").textContent  = "";
  $("dropped-items").innerHTML = "";
  $("btn-next").classList.add("hidden");

  // Reset palette item highlights
  document.querySelectorAll(".palette-item, .glass-item").forEach(el =>
    el.classList.remove("correct", "wrong-flash", "wrong", "selected")
  );
  $("shakerYes").className = "palette-item shaker-btn-item";
  $("shakerNo").className  = "palette-item shaker-btn-item";

  // Hide glass SVG until correct glass is dropped
  $("glass-svg-wrap").innerHTML = "";
  hideMeasurePicker();

  // Always reset to step 1 first, then update UI that reads state.activeStep
  setActiveStep(1);
  startCocktailTimer();

  updateHeaderStats();
  updateTaskStepStatus();
  updateDevToolsChecklist();
}

function loadNextCocktail() { loadCocktailByIndex(state.cocktailIndex + 1); }

// ─── STEP SEQUENCING ─────────────────────────────────

function setActiveStep(step) {
  state.activeStep = step;
  // Show only the section for the current step; hide the rest
  ["step-shaker", "step-glass", "step-ingredients", "step-garnish"].forEach((id, i) => {
    const el = $(id);
    if (el) el.classList.toggle("step-hidden", i + 1 !== step);
  });
}

function advanceStep() {
  const c = state.currentCocktail;
  if (state.activeStep === 1 && state.shakerConfirmed) {
    setActiveStep(2);
  } else if (state.activeStep === 2 && state.glassConfirmed) {
    setActiveStep(3);
  } else if (state.activeStep === 3 && state.droppedIngredientIds.size >= c.ingridient.length) {
    const hasGarnish = (c.garnish || []).length > 0;
    if (hasGarnish) setActiveStep(4);
    else checkCompletion();
  }
}

// ─── RENDER PALETTE ──────────────────────────────────

function renderPalette() {
  // Shaker buttons — same size as palette items
  $("shakerYes").innerHTML = `<img class="item-img" src="./src/methods/shaker.png" alt="Use Shaker" onerror="this.style.display='none'"/><div class="item-name">Use Shaker</div>`;
  $("shakerNo").innerHTML  = `<img class="item-img" src="./src/methods/no_shaker.png" alt="No Shaker" onerror="this.style.display='none'"/><div class="item-name">No Shaker</div>`;

  // Glasses — draggable palette items
  const glGrid = $("glasses-grid");
  glGrid.innerHTML = "";
  glasses.forEach(item => {
    const el = document.createElement("div");
    el.className = "palette-item glass-item";
    el.dataset.type = "glass";
    el.dataset.id   = item.id;
    el.innerHTML = `<img class="item-img" src="${item.image}" alt="${item.name}" onerror="this.style.display='none'"/>
                    <div class="item-name">${item.name}</div>`;
    el.addEventListener("pointerdown", onDragStart);
    glGrid.appendChild(el);
  });

  // Ingredients
  const igGrid = $("ingredients-grid");
  igGrid.innerHTML = "";
  ingridients.forEach(item => {
    const el = makePaletteItem(item, "ingredient");
    igGrid.appendChild(el);
  });

  // Garnishes
  const gaGrid = $("garnishes-grid");
  gaGrid.innerHTML = "";
  garnishes.forEach(item => {
    const el = makePaletteItem(item, "garnish");
    gaGrid.appendChild(el);
  });
}

function makePaletteItem(item, type) {
  const el = document.createElement("div");
  el.className = "palette-item";
  el.dataset.type = type;
  el.dataset.id   = item.id;
  el.innerHTML = `<img class="item-img" src="${item.image}" alt="${item.name}" onerror="this.style.display='none'"/>
                  <div class="item-name">${item.name}</div>`;
  el.addEventListener("pointerdown", onDragStart);
  return el;
}

// ─── SHAKER BUTTONS ──────────────────────────────────

function selectShaker(useShaker) {
  if (state.shakerConfirmed) { showToast("Method already chosen!"); return; }
  const c = state.currentCocktail;
  const isCorrect = c.useShaker === useShaker;

  state.shakerConfirmed = true;
  const btn = useShaker ? $("shakerYes") : $("shakerNo");

  if (isCorrect) {
    btn.classList.add("correct");
    addScore(2);
    showToastSuccess("✓ Correct method!");
  } else {
    btn.classList.add("wrong-flash");
    setTimeout(() => btn.classList.remove("wrong-flash"), 400);
    showToast(`✗ Wrong — ${c.useShaker ? "shaker needed" : "no shaker needed"}`);
    addScore(-3);
    state.cocktailMistakes++;
  }

  updateTaskStepStatus();
  setTimeout(advanceStep, 400);
}

// ─── DRAG LOGIC ──────────────────────────────────────

function onDragStart(e) {
  
  e.preventDefault();
  e.currentTarget.setPointerCapture?.(e.pointerId); //iPad

  const el   = e.currentTarget;
  const type = el.dataset.type;
  const id   = parseInt(el.dataset.id);

  let item;
  if      (type === "ingredient") item = ingridients.find(i => i.id === id);
  else if (type === "garnish")    item = garnishes.find(g => g.id === id);
  else if (type === "glass")      item = glasses.find(g => g.id === id);
  if (!item) return;

  state.dragData = { type, id, name: item.name, image: item.image };
  el.classList.add("dragging");

  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.innerHTML = `<img src="${item.image}" style="width:34px;height:34px;object-fit:contain"/><div style="font-size:0.58rem">${item.name}</div>`;
  document.body.appendChild(ghost);
  state.dragGhost = ghost;

  moveGhost(e.clientX, e.clientY);
  document.addEventListener("pointermove", onDragMove);
  document.addEventListener("pointerup",   onDragEnd);
}

function onDragMove(e) {
  moveGhost(e.clientX, e.clientY);
  const rect = $("glass-drop-zone").getBoundingClientRect();
  const over = e.clientX >= rect.left && e.clientX <= rect.right &&
               e.clientY >= rect.top  && e.clientY <= rect.bottom;
  $("glass-drop-zone").classList.toggle("drag-over", over);
}

function onDragEnd(e) {
  
  try {
    e.target.releasePointerCapture?.(e.pointerId);
  } catch {}

  document.removeEventListener("pointermove", onDragMove);
  document.removeEventListener("pointerup",   onDragEnd);

  if (state.dragGhost) { state.dragGhost.remove(); state.dragGhost = null; }
  document.querySelectorAll(".dragging").forEach(el => el.classList.remove("dragging"));
  $("glass-drop-zone").classList.remove("drag-over");

  const rect = $("glass-drop-zone").getBoundingClientRect();
  const hit  = e.clientX >= rect.left && e.clientX <= rect.right &&
               e.clientY >= rect.top  && e.clientY <= rect.bottom;

  if (hit && state.dragData) handleDrop(state.dragData);
  state.dragData = null;
}

function moveGhost(x, y) {
  if (state.dragGhost) {
    state.dragGhost.style.left = x + "px";
    state.dragGhost.style.top  = y + "px";
  }
}

// ─── DROP HANDLER ────────────────────────────────────

function handleDrop({ type, id, name, image }) {
  const c = state.currentCocktail;
  if (!c) return;

  if (type === "glass") {
    if (state.glassConfirmed) { showToast("Glass already placed!"); return; }
    const isCorrect = c.glass === id;
    const el = document.querySelector(`.glass-item[data-id="${id}"]`);
    if (isCorrect) {
      state.glassConfirmed = true;
      el && el.classList.add("correct");
      // Inject the glass SVG now that the correct one has been dropped
      $("glass-svg-wrap").innerHTML = getGlassSVG(c.glass, c.color);
      addScore(3);
      showToastSuccess(`✓ ${name} — correct!`);
      updateTaskStepStatus();
      updateDevToolsChecklist();
      setTimeout(advanceStep, 400);
    } else {
      el && el.classList.add("wrong-flash");
      setTimeout(() => el && el.classList.remove("wrong-flash"), 400);
      showToast("✗ Wrong glass for this cocktail");
      addScore(-3);
      state.cocktailMistakes++;
    }
    return;
  }

  if (type === "ingredient") {
    if (state.droppedIngredientIds.has(id)) { showToast(`${name} already added!`); return; }
    const recipeItem = c.ingridient.find(i => i.id === id);
    if (!recipeItem) {
      showToast(`✗ ${name} doesn't belong here`);
      flashPaletteItem("ingredient", id);
      addScore(-2);
      state.cocktailMistakes++;
      return;
    }
    const ing = ingridients.find(i => i.id === id);
    if (!ing) return;
    if (!ing.measureOptions || ing.measureOptions.length === 0) {
      // No measure needed — accept directly
      finaliseIngredientDrop(id, name, image);
      addScore(2);
    } else {
      showMeasurePicker(id, name, image, recipeItem.measure, ing.measureOptions);
    }
    return;
  }

  if (type === "garnish") {
    if (state.droppedGarnishIds.has(id)) { showToast(`${name} already added!`); return; }
    const isCorrect = (c.garnish || []).includes(id);
    if (!isCorrect) {
      showToast(`✗ ${name} doesn't go with this cocktail`);
      flashPaletteItem("garnish", id);
      addScore(-2);
      state.cocktailMistakes++;
      return;
    }
    state.droppedGarnishIds.add(id);
    markPaletteCorrect("garnish", id);
    addDroppedBadge(image, name);
    addScore(2);
    showGarnishOnGlass(image);
    updateTaskStepStatus();
    updateDevToolsChecklist();
    checkCompletion();
  }
}

// ─── MEASURE PICKER ──────────────────────────────────

function showMeasurePicker(id, name, image, correctMeasure, measureOptions) {
  state.pendingMeasureIng = { id, name, image, correctMeasure };

  // Build overlay measure picker over the glass stage
  let overlay = $("measure-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "measure-overlay";
    overlay.className = "measure-overlay";
    const stage = document.querySelector(".glass-stage");
    stage.style.position = "relative";
    stage.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="measure-overlay-panel">
      <div class="measure-inline-name">${name}</div>
      <div class="measure-inline-sub">Select the correct measure</div>
      <div class="measure-inline-options" id="measureInlineOptions"></div>
    </div>
  `;
  overlay.classList.remove("hidden");

  const container = $("measureInlineOptions");
  measureOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "measure-inline-btn";
    btn.textContent = opt.label;
    btn.dataset.value = opt.value;
    // btn.addEventListener("click", () => handleMeasureChoice(opt.value, btn)); //Ipad!!!
    btn.addEventListener("pointerup", (e) => {
      e.preventDefault();
      handleMeasureChoice(opt.value, btn);
    });
    container.appendChild(btn);
  });
}

function hideMeasurePicker() {
  const overlay = $("measure-overlay");
  if (overlay) overlay.classList.add("hidden");
}

function handleMeasureChoice(chosenValue, clickedBtn) {
  const { id, name, image, correctMeasure } = state.pendingMeasureIng;
  const isCorrect = Math.abs(Number(chosenValue) - Number(correctMeasure)) < 0.01;

  const container = $("measureInlineOptions");
  if (container) container.querySelectorAll(".measure-inline-btn").forEach(b => {
    b.disabled = true;
    if (Math.abs(Number(b.dataset.value) - Number(correctMeasure)) < 0.01) b.classList.add("correct-measure");
  });
  if (!isCorrect && clickedBtn) clickedBtn.classList.add("wrong-measure");

  const pts = isCorrect ? 2 : 1;
  addScore(pts);
  if (!isCorrect) state.cocktailMistakes++;
  if (isCorrect) showToastSuccess("✓ Correct measure!");
  else showToast("✗ Wrong measure — correct answer highlighted");

  setTimeout(() => {
    hideMeasurePicker();
    finaliseIngredientDrop(id, name, image);
  }, isCorrect ? 400 : 900);
}

function finaliseIngredientDrop(id, name, image) {
  state.droppedIngredientIds.add(id);
  markPaletteCorrect("ingredient", id);
  addDroppedBadge(image, name);
  animateLiquidFill();
  updateTaskStepStatus();
  updateDevToolsChecklist();
  const c = state.currentCocktail;
  if (state.droppedIngredientIds.size >= c.ingridient.length) {
    setTimeout(advanceStep, 300);
  }
}

// ─── LIQUID FILL ─────────────────────────────────────
// The rect's bottom edge must stay at fillBottom. We grow upward.
// y = fillBottom - fillH,  height = fillH

function animateLiquidFill() {
  const fill = document.getElementById("Liquid");
  if (!fill) return;
  const c = state.currentCocktail;
  const cfg = GLASS_CONFIG[c.glass] || GLASS_CONFIG[1];

  // Calculate total measure of all ingredients (skip 0-measure ones like ice/salt)
  const totalMeasure = c.ingridient.reduce((sum, i) => sum + (i.measure || 0), 0);
  // Sum measure of dropped ingredients
  let droppedMeasure = 0;
  c.ingridient.forEach(i => {
    if (state.droppedIngredientIds.has(i.id)) droppedMeasure += (i.measure || 0);
  });

  const fraction = totalMeasure > 0 ? Math.min(droppedMeasure / totalMeasure, 1) : 0;
  const fillH = Math.round(fraction * cfg.fullRange);
  fill.setAttribute("y",      String(cfg.initialY - fillH));
  fill.setAttribute("height", String(fillH));
}

// ─── GARNISH ON GLASS ────────────────────────────────

function showGarnishOnGlass(image) {
  const g = document.getElementById("garnish-display");
  if (!g) return;
  g.setAttribute("opacity", "1");
  const count = g.querySelectorAll("image").length;
  const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
  img.setAttribute("href",   image);
  img.setAttribute("x",      String(150 + count * 22));
  img.setAttribute("y",      "5");
  img.setAttribute("width",  "30");
  img.setAttribute("height", "30");
  g.appendChild(img);
}

// ─── BADGE ───────────────────────────────────────────

function addDroppedBadge(image, name) {
  const badge = document.createElement("div");
  badge.className = "dropped-badge";
  badge.innerHTML = `<img src="${image}" style="width:12px;height:12px;object-fit:contain"/> ${name}`;
  $("dropped-items").appendChild(badge);
}

// ─── TASK STEP STATUS (right panel) ──────────────────

function updateTaskStepStatus() {
  const c = state.currentCocktail;
  if (!c) return;

  const shakerDone  = state.shakerConfirmed;
  const glassDone   = state.glassConfirmed;
  const ingTotal    = c.ingridient.length;
  const ingDone     = state.droppedIngredientIds.size;
  const ingComplete = ingDone >= ingTotal;
  const garnishTotal   = (c.garnish || []).length;
  const garnishDone    = state.droppedGarnishIds.size;
  const garnishComplete = garnishDone >= garnishTotal;
  const hasGarnish = garnishTotal > 0;

  // Derive active step from actual game state (not just state.activeStep)
  // The active step is the first incomplete step.
  let activeNum = 0;
  if (!shakerDone)        activeNum = 1;
  else if (!glassDone)    activeNum = 2;
  else if (!ingComplete)  activeNum = 3;
  else if (hasGarnish && !garnishComplete) activeNum = 4;
  // 0 = all done (celebration showing)

  const steps = [
    { label: "Choose method",   done: shakerDone,  num: 1 },
    { label: "Select glass",    done: glassDone,   num: 2 },
    { label: "Add ingredients", done: ingComplete, num: 3,
      progress: { done: ingDone, total: ingTotal } },
  ];

  // Only add garnish row if there are garnishes needed
  if (hasGarnish) {
    steps.push({
      label: "Add garnish", done: garnishComplete, num: 4,
      progress: garnishTotal > 1 ? { done: garnishDone, total: garnishTotal } : null,
    });
  }

  $("task-step-status").innerHTML = steps.map(s => `
    <div class="step-row ${s.done ? "done" : (s.num === activeNum ? "active" : "")}">
      <span class="step-dot"></span>
      <span>${s.label}</span>
    </div>
    ${s.progress ? `
    <div class="ing-progress-wrap">
      <div class="ing-progress-track">
        <div class="ing-progress-bar" style="width:${s.progress.total > 0 ? Math.round(s.progress.done / s.progress.total * 100) : 0}%"></div>
      </div>
      <span class="ing-progress-text">${s.progress.done} / ${s.progress.total}</span>
    </div>` : ""}
  `).join("");
}

// ─── DEV TOOLS ───────────────────────────────────────

function toggleDevTools() {
  state.devToolsOpen = !state.devToolsOpen;
  $("devToolsBtn").classList.toggle("active", state.devToolsOpen);
  $("devPanel").classList.toggle("hidden", !state.devToolsOpen);
  if (state.devToolsOpen) updateDevToolsChecklist();
}

function updateDevToolsChecklist() {
  const c = state.currentCocktail;
  if (!c) return;
  const list = $("required-list");
  if (!list) return;
  list.innerHTML = "";

  const addRow = (image, name, done) => {
    const row = document.createElement("div");
    row.className = "req-item" + (done ? " done" : "");
    row.innerHTML = `<div class="req-check">${done ? "✓" : ""}</div>
      <img src="${image}" style="width:16px;height:16px;object-fit:contain;flex-shrink:0"/>
      <span>${name}</span>`;
    list.appendChild(row);
  };

  const gl = glasses.find(g => g.id === c.glass);
  if (gl) addRow(gl.image, gl.name, state.glassConfirmed);

  c.ingridient.forEach(({ id }) => {
    const ing = ingridients.find(i => i.id === id);
    if (ing) addRow(ing.image, ing.name, state.droppedIngredientIds.has(id));
  });

  (c.garnish || []).forEach(gid => {
    const ga = garnishes.find(g => g.id === gid);
    if (ga) addRow(ga.image, ga.name, state.droppedGarnishIds.has(gid));
  });
}

// ─── SCORE ───────────────────────────────────────────

function addScore(pts) {
  state.cocktailScore = state.cocktailScore + pts; // allow negative
  const prevTotal = state.totalScore;
  state.totalScore = Math.max(0, state.totalScore + pts);
  updateHeaderStats();
  showScoreFlyout(pts);
  // Game over if total hits 0 (only when losing points)
  if (pts < 0 && state.totalScore === 0 && prevTotal > 0) {
    setTimeout(() => {
      $("go-cocktails").textContent = state.cocktailsMade;
      showOverlay("overlayGameOver");
      $("game").classList.add("hidden");
    }, 600);
  }
}

function updateHeaderStats() {
  animateStat("hdr-cocktail-score", state.cocktailScore);
  animateStat("hdr-total-score",    state.totalScore);
  animateStat("hdr-cocktails-made", state.cocktailsMade);
}

function showScoreFlyout(pts) {
  if (pts === 0) return;
  const zone = $("glass-drop-zone");
  if (!zone) return;
  const flyout = document.createElement("div");
  flyout.className = "score-flyout " + (pts > 0 ? "positive" : "negative");
  flyout.textContent = (pts > 0 ? "+" : "") + pts;
  zone.appendChild(flyout);
  setTimeout(() => flyout.remove(), 1000);
}

function animateStat(id, value) {
  const el = $(id);
  if (!el) return;
  if (parseInt(el.textContent) === value) return;
  el.textContent = value;
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

// ─── PALETTE HELPERS ─────────────────────────────────

function markPaletteCorrect(type, id) {
  const el = document.querySelector(`.palette-item[data-type="${type}"][data-id="${id}"]`);
  if (el) el.classList.add("correct");
}

function flashPaletteItem(type, id) {
  const el = document.querySelector(`.palette-item[data-type="${type}"][data-id="${id}"]`);
  if (el) {
    el.classList.add("wrong-flash");
    setTimeout(() => el.classList.remove("wrong-flash"), 400);
  }
}

// ─── COMPLETION ──────────────────────────────────────

function checkCompletion() {
  const c = state.currentCocktail;
  if (!c) return;
  const ingOk     = state.droppedIngredientIds.size >= c.ingridient.length;
  const garnishOk = (c.garnish || []).length === 0 || state.droppedGarnishIds.size >= (c.garnish || []).length;
  if (ingOk && garnishOk && state.glassConfirmed && state.shakerConfirmed) {
    clearCocktailTimer();
    const isPerfect = state.cocktailMistakes === 0;
    state.cocktailsMade++;
    updateHeaderStats();
    $("feedback").textContent = isPerfect ? "🌟 Perfect cocktail!" : "🎉 Cocktail complete!";
    setTimeout(() => showCelebration(isPerfect), 500);
  }
}

function showCelebration(isPerfect, timedOut = false, penalty = 0, missed = 0) {
  const c = state.currentCocktail;
  const isLast = state.cocktailIndex + 1 >= cocktails.length;
  const overlay = document.createElement("div");
  overlay.className = "celebrate-overlay";

  let emoji, title, sub;
  if (timedOut) {
    emoji = "⏰";
    title = c.name;
    sub = missed === 0
      ? "Time's up — but you got everything!"
      : `Time's up! ${missed} item${missed > 1 ? "s" : ""} missed — -${penalty} pts`;
  } else if (isPerfect) {
    emoji = "🌟";
    title = c.name;
    sub = "Perfect — no mistakes! All points earned.";
  } else {
    emoji = "🍸";
    title = c.name;
    sub = "Cocktail complete!";
  }

  overlay.innerHTML = `
    <div class="celebrate-card">
      <div class="celebrate-emoji">${emoji}</div>
      <div class="celebrate-title">${title}</div>
      <div class="celebrate-sub">${sub}</div>
      <div class="celebrate-score-row">
        <div class="celebrate-stat">
          <div class="celebrate-stat-val">${state.cocktailScore}</div>
          <div class="celebrate-stat-label">This Cocktail</div>
        </div>
        <div style="width:1px;height:40px;background:rgba(200,151,58,0.25)"></div>
        <div class="celebrate-stat">
          <div class="celebrate-stat-val">${state.totalScore}</div>
          <div class="celebrate-stat-label">Total Score</div>
        </div>
        <div style="width:1px;height:40px;background:rgba(200,151,58,0.25)"></div>
        <div class="celebrate-stat">
          <div class="celebrate-stat-val">${state.cocktailsMade}/14</div>
          <div class="celebrate-stat-label">Made</div>
        </div>
      </div>
      <button class="celebrate-btn" id="celebrate-next">
        ${isLast ? "See Final Results →" : "Next Cocktail →"}
      </button>
    </div>`;
  document.body.appendChild(overlay);
  $("celebrate-next").addEventListener("click", () => {
    overlay.remove();
    if (isLast) { saveScore(); showGameComplete(); }
    else loadNextCocktail();
  });
}

// ─── GAME COMPLETE ───────────────────────────────────

function showGameComplete() {
  $("comp-score").textContent = state.totalScore;
  showOverlay("overlayComplete");
  $("game").classList.add("hidden");
}

// ─── SAVE SCORE ──────────────────────────────────────

function saveScore() {
  try {
    const entry = { staffNumber: state.staffNumber, score: state.totalScore, cocktailsMade: state.cocktailsMade, date: new Date().toISOString(), game: "cocktailCodex" };
    const existing = JSON.parse(localStorage.getItem("cocktailCodexScores") || "[]");
    existing.push(entry);
    localStorage.setItem("cocktailCodexScores", JSON.stringify(existing));
    localStorage.setItem("cocktailCodex_lastScore", JSON.stringify(entry));
  } catch(e) { console.warn("Score save failed:", e); }
}

// ─── TOAST ───────────────────────────────────────────

function showToast(msg) {
  clearTimeout(state.toastTimer);
  const el = $("toast");
  el.textContent = msg;
  el.className = "toast show";
  state.toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function showToastSuccess(msg) {
  clearTimeout(state.toastTimer);
  const el = $("toast");
  el.textContent = msg;
  el.className = "toast success show";
  state.toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

// ─── DEV RESET ───────────────────────────────────────

function resetCurrentCocktail() { loadCocktailByIndex(state.cocktailIndex); }

// ─── INIT ────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  $("staffInput").addEventListener("input",   validateStaffInput);
  $("staffInput").addEventListener("keydown", e => { if (e.key === "Enter") confirmStaffNumber(); });
  $("btn-reset").addEventListener("click",    resetCurrentCocktail);
  $("btn-skip").addEventListener("click",     () => loadNextCocktail());

  const dz = $("glass-drop-zone");
  dz.addEventListener("dragover",  e => { e.preventDefault(); dz.classList.add("drag-over"); });
  dz.addEventListener("dragleave", ()  => dz.classList.remove("drag-over"));

  showOverlay("overlayWelcome");
});