const fs = require('fs');
const html = fs.readFileSync('public/quote-builder/index.html', 'utf8');
const lines = html.split('\n');
const newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// 5. Zero-State Helper for Equipment via goStep Intercept')) {
    skip = true;
  }
  if (!skip) {
    newLines.push(lines[i]);
  }
  if (skip && lines[i].includes('if(originalGoStep3) originalGoStep3(n);')) {
    skip = false;
    i++; // skip the `  };` line
  }
}
fs.writeFileSync('public/quote-builder/index.html', newLines.join('\n'));
console.log('Removed by lines');
