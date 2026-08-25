const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const calcQuoteRegex = /let postTotal = 0;[\s\S]*?\/\/ ── TRAVEL/g;

const newPostQuote = `let postTotal = 0;
  const postLines = [];
  const isRush = state.deliveryDays==='rush';
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
    
    // Rush multiplier
    if(isRush && (p.id==='editing'||p.id==='colorgrade')) price = Math.round(price*1.5);
    
    postTotal += price;
    postLines.push({
      name: p.name + (sel.qty>1?' ×'+sel.qty:'') + (isRush&&(p.id==='editing'||p.id==='colorgrade')?' (Rush +50%)':''),
      nameAr: p.ar + (sel.qty>1?' ×'+sel.qty:'') + (isRush&&(p.id==='editing'||p.id==='colorgrade')?' (سريع +50%)':''),
      price
    });
  });

  // ── TRAVEL`;

html = html.replace(calcQuoteRegex, newPostQuote);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('calcQuote totally fixed');
