const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const r1 = /<div class="post-qty-box" style="margin-right:15px; margin-left:15px;">/g;
html = html.replace(r1, `<div class="post-qty-box" onclick="event.stopPropagation()" style="margin-right:15px; margin-left:15px;">`);

const r2 = /<div class="rate-input-wrap">/g;
html = html.replace(r2, `<div class="rate-input-wrap" onclick="event.stopPropagation()">`);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Restored stopPropagation');
