const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

html = html.replace(
  /projectNotes:'',/g,
  "projectNotes:'',\n  currency:'JOD',\n  paymentTerms:'50_50',"
);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Currency defaults added to DEFAULT_STATE');
