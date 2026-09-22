const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// Fix setQty event injection
html = html.replace(/onclick="setQty\('\\$\\{r\.id\\}',-1\)"/g, `onclick="setQty('\${r.id}', -1, event)"`);
html = html.replace(/onclick="setQty\('\\$\\{r\.id\\}',1\)"/g, `onclick="setQty('\${r.id}', 1, event)"`);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed button spaces');
