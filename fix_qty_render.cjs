const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldQty = `function setPostQty(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.qty = Math.max(1, parseInt(val) || 1);
  state.post[id] = sel;
  updateQuote();
  saveState();
}`;

const newQty = `function setPostQty(id, val) {
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

html = html.replace(oldQty, newQty);

const oldRate = `function setPostRate(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.rate = parseInt(val) || 0;
  state.post[id] = sel;
  updateQuote();
  saveState();
}`;

const newRate = `function setPostRate(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.rate = parseInt(val) || 0;
  state.post[id] = sel;
  renderPostOptions();
  updateQuote();
  saveState();
}`;

html = html.replace(oldRate, newRate);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Added renderPostOptions to setPostQty and setPostRate');
