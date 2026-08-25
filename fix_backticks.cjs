const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

html = html.replace(/\\\`/g, '`');

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed escaped backticks');
