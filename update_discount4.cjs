const fs = require('fs');
const html = fs.readFileSync('public/quote-builder/index.html', 'utf8');
const lines = html.split(/\r?\n/);

const newLines = [];
let skip = false;

const replacement = `  // Advanced Tiered Discount System
  // Dynamically scale thresholds based on currency so it remains fair.
  let exScale = 1;
  if (state.currency === 'USD') exScale = 1.41;
  else if (state.currency === 'SAR') exScale = 5.29;
  else if (state.currency === 'AED') exScale = 5.18;

  const t1 = 800 * exScale;
  const t2 = 1500 * exScale;
  const t3 = 3000 * exScale;

  if (subtotal >= t3) {
    discountPct = 10; 
    discountLabel = 'Premium Volume Discount −10%'; 
    discountLabelAr = 'خصم ذهبي (حجم عمل) −10%';
  } else if (subtotal >= t2) {
    discountPct = 7; 
    discountLabel = 'Volume Discount −7%'; 
    discountLabelAr = 'خصم فضي (حجم عمل) −7%';
  } else if (subtotal >= t1) {
    discountPct = 5; 
    discountLabel = 'Project Discount −5%'; 
    discountLabelAr = 'خصم تشجيعي −5%';
  }`;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('if(subtotal>=2000 && !isReels) {')) {
    skip = true;
    newLines.push(replacement);
  }
  
  if (!skip) {
    newLines.push(lines[i]);
  }
  
  if (skip && lines[i].includes('discountPct=5; discountLabel=')) {
    // skip this line and the next one '  }'
    i++;
    skip = false;
  }
}

fs.writeFileSync('public/quote-builder/index.html', newLines.join('\n'));
console.log('Done replacing lines');
