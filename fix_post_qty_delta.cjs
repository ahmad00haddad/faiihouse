const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Change the HTML to pass +1 and -1 delta
const btnMinusOld = /<button onclick="setPostQty\('\$\{p\.id\}', \$\{sel\.qty-1\}\)">−<\/button>/g;
const btnPlusOld = /<button onclick="setPostQty\('\$\{p\.id\}', \$\{sel\.qty\+1\}\)">\+<\/button>/g;
html = html.replace(btnMinusOld, `<button onclick="setPostQty('\${p.id}', -1)">−</button>`);
html = html.replace(btnPlusOld, `<button onclick="setPostQty('\${p.id}', 1)">+</button>`);

// 2. Fix the setPostQty function to use delta
const setPostQtyOld = `function setPostQty(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.qty = Math.max(1, parseInt(val) || 1);
  state.post[id] = sel;
  
  // Update the visible quantity text manually to avoid re-rendering and stealing focus
  const cards = document.querySelectorAll('.post-option');
  cards.forEach(card => {
    if(card.innerHTML.includes(\`'\${id}'\`)) {
      const qtySpan = card.querySelector('.post-qty-box span');
      if(qtySpan) qtySpan.textContent = sel.qty;
      const display = card.querySelector('.rate-display');
      if(display) display.textContent = (sel.qty > 1 ? sel.qty + ' × ' : '') + sel.rate + ' ' + (state.currency||'JOD');
    }
  });

  updateQuote();
  saveState();
}`;

const setPostQtyNew = `function setPostQty(id, d) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.qty = Math.max(1, (sel.qty||1) + d);
  state.post[id] = sel;
  
  // Update the visible quantity text manually to avoid re-rendering and stealing focus
  const cards = document.querySelectorAll('.post-option');
  cards.forEach(card => {
    if(card.innerHTML.includes(\`'\${id}'\`)) {
      const qtySpan = card.querySelector('.post-qty-box span');
      if(qtySpan) qtySpan.textContent = sel.qty;
      const display = card.querySelector('.rate-display');
      if(display) display.textContent = (sel.qty > 1 ? sel.qty + ' × ' : '') + sel.rate + ' ' + (state.currency||'JOD');
    }
  });

  updateQuote();
  saveState();
}`;

html = html.replace(setPostQtyOld, setPostQtyNew);
fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed setPostQty to use delta correctly');
