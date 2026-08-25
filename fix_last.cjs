const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

html = html.replace(
  /\$\{q\.discountPct>0\?`<div class="sb-discount-badge">\$\{L\('توفير','SAVE`\)\} \$\{q\.discountAmt\} \$\{state\.currency\|\|"JOD"\}<\/div>`:`'\}/g,
  "${q.discountPct>0?`<div class=\"sb-discount-badge\">\${L('توفير','SAVE')} \${q.discountAmt} \${state.currency||\"JOD\"}</div>`:''}"
);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed line 1951');
