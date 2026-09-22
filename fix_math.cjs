const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const targetBlock = `let afterDiscount = subtotal - rawDiscount;
  let totalRounded = Math.round(afterDiscount/50)*50 || afterDiscount;
  
  // If custom discount, don't round the final total to preserve exact math
  if (state.discountMode === 'custom_amt' || state.discountMode === 'custom_pct') {
    totalRounded = afterDiscount;
  }
  
  // Calculate EXACT discount amount so UI math adds up perfectly
  let discountAmt = 0;
  if (discountPct > 0 || state.discountMode === 'custom_amt') {
    discountAmt = Math.max(0, subtotal - totalRounded);
  }`;

const newBlock = `let afterDiscount = subtotal - rawDiscount;
  let totalRounded = afterDiscount; // Removed illogical 50 JOD rounding
  
  let discountAmt = rawDiscount;`;

html = html.replace(targetBlock, newBlock);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed rounding bug');
