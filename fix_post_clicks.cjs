const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const regex = /<div class="post-option grain-card \$\{sel\.enabled\?'sel':''\}" onclick="togglePost\('\$\{p\.id\}'\)">\s*<div class="post-option-left">/g;

const replaceWith = `<div class="post-option grain-card \${sel.enabled?'sel':''}">
      <div class="post-option-left" onclick="togglePost('\${p.id}')" style="flex:1; cursor:pointer;">`;

html = html.replace(regex, replaceWith);

// Also remove event.stopPropagation() from post-qty-box and rate-input-wrap since they are no longer inside an onclick parent
const regex2 = /<div class="post-qty-box" onclick="event\.stopPropagation\(\)"/g;
html = html.replace(regex2, `<div class="post-qty-box"`);

const regex3 = /<div class="rate-input-wrap" onclick="event\.stopPropagation\(\)"/g;
html = html.replace(regex3, `<div class="rate-input-wrap"`);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed post option click propagation');
