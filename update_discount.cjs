const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldDiscount = `  if(subtotal>=2000 && !isReels) {
    discountPct=7; discountLabel='Project Discount −7%'; discountLabelAr='خصم مشروع −7%';
  } else if(subtotal>=1000 && !isReels) {
    discountPct=5; discountLabel='Bulk Discount −5%'; discountLabelAr='خصم كمية −5%';
  }`;

const newDiscount = `  // Advanced Tiered Discount System (Benefits the company by encouraging higher spending)
  if (subtotal >= 3000) {
    discountPct = 10; 
    discountLabel = 'Premium Volume Discount −10%'; 
    discountLabelAr = 'خصم ذهبي (حجم عمل) −10%';
  } else if (subtotal >= 1500) {
    discountPct = 7; 
    discountLabel = 'Volume Discount −7%'; 
    discountLabelAr = 'خصم فضي (حجم عمل) −7%';
  } else if (subtotal >= 800) {
    discountPct = 5; 
    discountLabel = 'Project Discount −5%'; 
    discountLabelAr = 'خصم تشجيعي −5%';
  }`;

html = html.replace(oldDiscount, newDiscount);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Discount logic updated');
