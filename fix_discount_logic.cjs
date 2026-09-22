const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldDiscountCalc = `let discountAmt = Math.round(subtotal * discountPct/100);
  if (state.discountMode === 'custom_amt') {
    discountAmt = state.discountVal || 0;
    discountLabel = 'Special Discount';
    discountLabelAr = 'خصم خاص';
  }
  const afterDiscount = subtotal - discountAmt;
  const totalRounded = Math.round(afterDiscount/50)*50 || afterDiscount;`;

const newDiscountCalc = `let rawDiscount = Math.round(subtotal * discountPct/100);
  if (state.discountMode === 'custom_amt') {
    rawDiscount = state.discountVal || 0;
    discountLabel = 'Special Discount';
    discountLabelAr = 'خصم خاص';
  }
  let afterDiscount = subtotal - rawDiscount;
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

html = html.replace(oldDiscountCalc, newDiscountCalc);
fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed discount calculation');
