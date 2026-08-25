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
html = html.replace(/\.savings-ticker \{[\s\S]*?@media\(max-width:768px\)[^}]+\}\s*\}/g, '');
html = html.replace(/\.savings-ticker \{[^}]+\}/g, '');
html = html.replace(/\.savings-ticker\.show \{[^}]+\}/g, '');
html = html.replace(/@media\(max-width:768px\)\s*\{\s*\.savings-ticker\s*\{[^}]+\}\s*\}/g, '');

// 4. Remove the JS that injects the bulky ticker
const injectedTickerHTMLRegex = /const tickerHtml = '<div id="savingsTicker"[^>]*>.*?<\/div>';\s*document\.body\.insertAdjacentHTML\('beforeend', tickerHtml\);/g;
html = html.replace(injectedTickerHTMLRegex, '');
html = html.replace(/<div id="savingsTicker" class="savings-ticker">.*?<\/div>/g, '');

// 5. Inject the sleek inline savings into the mobile-quote-bar
const newMobileTotalHtml = `    <span class="mq-amount" id="mobileTotal">0 \${state.currency||'JOD'}</span>
    <div id="mobileSavings" style="font-size:11px; color:var(--gold); font-weight:bold; opacity:0; transition:0.3s; margin-top:2px;"></div>`;
html = html.replace(/<span class="mq-amount" id="mobileTotal">0 \${state\.currency\|\|'JOD'}<\/span>/g, newMobileTotalHtml);

// 6. Update updateQuote to manage `#mobileSavings` instead of the old ticker
const oldTickerUpdateLogic = /const ticker = document\.getElementById\('savingsTicker'\);[\s\S]*?ticker\.classList\.remove\('show'\);\s*}\s*}/g;
const newSavingsLogic = `
    const mobSav = document.getElementById('mobileSavings');
    if(mobSav) {
      if(discountAmt > 0) {
        mobSav.innerHTML = '✦وفرت ' + discountAmt + ' ' + (state.currency||'JOD');
        mobSav.style.opacity = '1';
      } else {
        mobSav.style.opacity = '0';
      }
    }
`;
html = html.replace(oldTickerUpdateLogic, newSavingsLogic);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Zoom and ticker fixes applied!');
