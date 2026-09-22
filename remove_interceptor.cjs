const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const regex = /\/\/ 5\. Zero-State Helper for Equipment via goStep Intercept[\s\S]*?if\(originalGoStep3\) originalGoStep3\(n\);\n  };\n/g;

html = html.replace(regex, '');

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Removed annoying equipment double-click warning interceptor');
