const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldHint = `<div class="hint-tooltip" style="bottom: 80%; right: 20%; transform: translateY(5px); z-index: 1000;">\${L(r.hintAr, r.hint)}</div>`;
const newHint = `<div class="hint-tooltip" style="bottom: 80%; right: 0; transform: translateY(5px); z-index: 1000;">\${L(r.hintAr, r.hint)}</div>`;

html = html.replace(oldHint, newHint);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed tooltip alignment');
