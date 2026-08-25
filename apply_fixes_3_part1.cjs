const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Fix viewport meta tag to disable double-tap zoom
html = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
);

// 2. Add touch-action manipulation to CSS globally
const touchActionCss = `
<style>
/* Prevent double tap to zoom on all interactive elements */
a, button, input, select, textarea, .type-card, .equip-card, .region-card, .stepper-btn, .seg-btn {
  touch-action: manipulation;
}
</style>
`;
html = html.replace('</head>', touchActionCss + '</head>');

// 3. Remove the bulky savings-ticker CSS
// Since it's injected via previous scripts, let's use regex to strip it.
html = html.replace(/\.savings-ticker \{[\s\S]*?@media\(max-width:768px\) \{ \.savings-ticker \{ bottom: 80px; right: 20px; left: 20px; justify-content:center; \} \}/g, '');
// Remove it from the CSS string completely (if it was a single line)
html = html.replace(/\.savings-ticker \{[^}]+\}/g, '');
html = html.replace(/\.savings-ticker\.show \{[^}]+\}/g, '');
html = html.replace(/@media\(max-width:768px\)\s*\{\s*\.savings-ticker\s*\{[^}]+\}\s*\}/g, '');

// 4. Remove the JS that injects the bulky ticker
const injectedTickerHTMLRegex = /const tickerHtml = '<div id="savingsTicker"[^>]+>.*?<\/div>';\s*document\.body\.insertAdjacentHTML\('beforeend', tickerHtml\);/g;
html = html.replace(injectedTickerHTMLRegex, '');
// Also remove the fallback static HTML if it was injected
html = html.replace(/<div id="savingsTicker" class="savings-ticker">.*?<\/div>/g, '');

// 5. Inject the sleek inline savings into the mobile-quote-bar
// Find the mq-price block
const mqPriceBlockRegex = /<div class="mq-val" id="mobileTotal">0 ' \+ \(state\.currency\|\|'JOD'\)<\/div>/g;
// Wait, the mq-val currently looks like this in the HTML string:
// <div class="mq-val" id="mobileTotal">0 JD</div> 
// Oh, the previous script replaced ' JD' with ` ' + (state.currency||'JOD')` only in JS, in HTML it didn't change it.
// Let's find exactly what it looks like.
