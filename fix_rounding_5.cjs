const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const targetBlock = `let rawDiscount = Math.round(subtotal * discountPct/100);
  if (state.discountMode === 'custom_amt') {
    rawDiscount = state.discountVal || 0;
    discountLabel = 'Special Discount';
    discountLabelAr = 'خصم خاص';
  }
  let afterDiscount = subtotal - rawDiscount;
  let totalRounded = afterDiscount; // Removed illogical 50 JOD rounding
  
  let discountAmt = rawDiscount;`;

const newBlock = `let rawDiscount = Math.round(subtotal * discountPct/100);
  if (state.discountMode === 'custom_amt') {
    rawDiscount = state.discountVal || 0;
    discountLabel = 'Special Discount';
    discountLabelAr = 'خصم خاص';
  }
  
  let afterDiscount = subtotal - rawDiscount;
  
  // Round DOWN to the nearest 5 to guarantee a clean number and a better deal for the customer
  let totalRounded = Math.floor(afterDiscount / 5) * 5; 
  
  // The final discount amount they saved is the exact difference
  let discountAmt = subtotal - totalRounded;

  // If there was no formal discount, but rounding triggered a discount, give it a nice name
  if (discountAmt > 0 && discountPct === 0 && state.discountMode !== 'custom_amt') {
    discountLabel = 'Promo Discount';
    discountLabelAr = 'خصم تشجيعي';
  }`;

html = html.replace(targetBlock, newBlock);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed rounding to nearest 5 (floor)');
