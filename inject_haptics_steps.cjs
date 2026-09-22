const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

html = html.replace(/function nextStep\(\) \{/g, `function nextStep() {\n  if(window.hapticPulse) hapticPulse('medium');`);
html = html.replace(/function prevStep\(\) \{/g, `function prevStep() {\n  if(window.hapticPulse) hapticPulse('medium');`);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Added haptics to next/prev steps');
