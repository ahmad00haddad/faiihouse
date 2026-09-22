const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldSetPostQty = `function setPostQty(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.qty = Math.max(1, parseInt(val) || 1);
  state.post[id] = sel;
  renderPostOptions();
  updateQuote();
  saveState();
}`;

const newSetPostQty = `function setPostQty(id, val) {
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

html = html.replace(oldSetPostQty, newSetPostQty);
fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed setPostQty to not re-render');
