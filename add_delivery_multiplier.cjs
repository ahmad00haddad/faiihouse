const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const regex = /const isRush = state\.deliveryDays==='rush';[\s\S]*?price\n    \}\);/g;

// Only replace inside calcQuote
let matchCount = 0;
html = html.replace(regex, (match) => {
  matchCount++;
  if (matchCount === 1) { 
    return `const isRush = state.deliveryDays==='rush';
  const isSeven = state.deliveryDays==='7';
  POST_OPTIONS.forEach(p=>{
    let sel = state.post[p.id];
    if(!sel) return;
    if(typeof sel === 'boolean') {
      if(!sel) return;
      sel = { enabled: true, rate: p.basePrice, qty: 1 };
    } else {
      if(!sel.enabled) return;
    }

    if(state.projectType === 'reels' && p.id === 'editing') {
      postLines.push({
        name: p.name + L(' (مشمول بالسعر)','  (included in reel price)'),
        nameAr: p.ar + ' (مشمول بالسعر)',
        price: 0,
        isFree: true
      });
      return;
    }

    let price = sel.rate * sel.qty;
    let extraStrEn = '';
    let extraStrAr = '';
    
    // Delivery multiplier
    if (p.id==='editing' || p.id==='colorgrade') {
      if (isRush) {
        price = Math.round(price * 1.5);
        extraStrEn = ' (Rush +50%)';
        extraStrAr = ' (سريع +50%)';
      } else if (isSeven) {
        price = Math.round(price * 1.25);
        extraStrEn = ' (7 Days +25%)';
        extraStrAr = ' (7 أيام +25%)';
      }
    }
    
    postTotal += price;
    postLines.push({
      name: p.name + (sel.qty>1?' ×'+sel.qty:'') + extraStrEn,
      nameAr: p.ar + (sel.qty>1?' ×'+sel.qty:'') + extraStrAr,
      price
    });`;
  }
  return match;
});

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Delivery multipliers added');
