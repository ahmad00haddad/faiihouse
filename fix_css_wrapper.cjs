const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldCSS = `.type-card:hover .type-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}`;
const newCSS = `.type-wrapper:hover .type-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}
.type-wrapper {
  position: relative;
}`;
html = html.replace(oldCSS, newCSS);

// Just in case it was written on one line
html = html.replace(/\.type-card:hover \.type-tooltip\s*\{\s*opacity:\s*1;\s*visibility:\s*visible;\s*transform:\s*translateX\(-50%\) translateY\(0\) scale\(1\);\s*\}/, newCSS);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed CSS');
