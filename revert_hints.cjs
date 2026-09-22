const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldStaticHint = `\${r.hint ? \`<div class="role-hint" style="font-size:10px; color:var(--text3); margin-top:4px; line-height:1.4;">\${L(r.hintAr, r.hint)}</div>\` : ''}`;
const newHoverTooltip = `\${r.hint ? \`<div class="hint-tooltip" style="bottom: 80%; right: 0; transform: translateY(5px); z-index: 1000;">\${L(r.hintAr, r.hint)}</div>\` : ''}`;

html = html.replace(oldStaticHint, newHoverTooltip);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Reverted crew hints to hover tooltips.');
