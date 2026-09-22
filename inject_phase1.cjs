const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Inject CDNs (GSAP, ScrollTrigger, Lenis) in <head>
const cdns = `
  <!-- GSAP & Lenis Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>
`;
if(!html.includes('gsap.min.js')) {
  html = html.replace('</head>', cdns + '\n</head>');
}

// 2. Inject CSS
const engineCSS = `
/* Phase 1 Engine CSS */
:root { --vh: 1vh; }
#page-transition-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; 
  height: 100vh; height: calc(var(--vh, 1vh) * 100);
  background-color: #0b0a0a; z-index: 999999;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }
.lenis.lenis-scrolling iframe { pointer-events: none; }
`;
if(!html.includes('Phase 1 Engine CSS')) {
  html = html.replace('</style>', engineCSS + '\n</style>');
}

// 3. Inject Overlay DOM
const overlayDOM = `<div id="page-transition-overlay"></div>`;
if(!html.includes('id="page-transition-overlay"')) {
  html = html.replace('<body>', '<body>\n  ' + overlayDOM);
}

// 4. Inject Core Engine JS
const engineJS = `
// ══════════════════════════════════════════════════════════════
// PHASE 1: CORE UX ENGINE (GSAP, LENIS, HAPTICS, BATTERY)
// ══════════════════════════════════════════════════════════════

// 1. Dynamic Viewport Fix
const setVh = () => { document.documentElement.style.setProperty('--vh', \`\${window.innerHeight * 0.01}px\`); };
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);
setVh();

// 2. Battery Saver & Reduced Motion Detection
window.isBatterySaver = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (navigator.getBattery) {
  navigator.getBattery().then(batt => {
    if (batt.level <= 0.2 && !batt.charging) window.isBatterySaver = true;
  });
}

// 3. Lenis & GSAP Setup
let lenis;
if (!window.isBatterySaver && typeof Lenis !== 'undefined' && typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false, // Native touch scrolling for mobile, but syncs with ScrollTrigger
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000) });
  gsap.ticker.lagSmoothing(0);
}

// 4. Mobile Haptic Feedback
window.hapticPulse = function(type = 'light') {
  if (window.isBatterySaver || !navigator.vibrate) return;
  try {
    if (type === 'light') navigator.vibrate(15);
    else if (type === 'medium') navigator.vibrate(30);
    else if (type === 'heavy') navigator.vibrate([30, 50, 30]);
  } catch(e) {}
};

// 5. Page Transition "Press Play"
window.addEventListener('load', () => {
  const overlay = document.getElementById('page-transition-overlay');
  if (overlay) {
    if (!window.isBatterySaver && typeof gsap !== 'undefined') {
      gsap.to(overlay, {opacity: 0, duration: 1.2, ease: 'power2.inOut', onComplete: () => overlay.style.display = 'none'});
    } else {
      overlay.style.display = 'none';
    }
  }
});
`;

if(!html.includes('PHASE 1: CORE UX ENGINE')) {
  // Inject before the last closing script tag
  const lastScriptTag = html.lastIndexOf('</script>');
  html = html.substring(0, lastScriptTag) + engineJS + html.substring(lastScriptTag);
}

// 5. Hook Haptics into user actions (toggleRole, setQty)
html = html.replace(/function toggleRole\(id, checked\) \{/g, `function toggleRole(id, checked) {\n  if(window.hapticPulse) hapticPulse('light');`);
html = html.replace(/function setQty\(id, d, e\) \{/g, `function setQty(id, d, e) {\n  if(window.hapticPulse) hapticPulse('light');`);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Phase 1 Engine injected successfully.');
