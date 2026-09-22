const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Fix Crew input to use oninput for true realtime
html = html.replace(/onchange="setRate\('\$\{r\.id\}',this\.value\)"/g, `oninput="setRate('\${r.id}',this.value)"`);

// 2. Fix Post Production input to match Crew styling and use oninput
const oldPostInput = /<input type="number" class="post-rate-input" value="\$\{sel\.rate\}" onchange="setPostRate\('\$\{p\.id\}', this\.value\)" style="width:60px;">/g;
const newPostInput = `<input type="number" value="\${sel.rate}" min="0" step="10" oninput="setPostRate('\${p.id}', this.value)" style="width:72px; background:var(--dark4); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--foreground); font-size:13px; padding:5px 8px; text-align:center;">`;
html = html.replace(oldPostInput, newPostInput);

// 3. Remove renderPostOptions() from setPostRate so it doesn't destroy focus while typing
const oldSetPostRate = `function setPostRate(id, val) {
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

const newSetPostRate = `function setPostRate(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.rate = parseInt(val) || 0;
  state.post[id] = sel;
  
  // Update the visible rate text so it syncs if user exits owner mode
  const cards = document.querySelectorAll('.post-option');
  cards.forEach(card => {
    if(card.innerHTML.includes(\`'\${id}'\`)) {
      const display = card.querySelector('.rate-display');
      if(display) display.textContent = (sel.qty > 1 ? sel.qty + ' × ' : '') + sel.rate + ' ' + (state.currency||'JOD');
    }
  });

  updateQuote();
  saveState();
}`;

html = html.replace(oldSetPostRate, newSetPostRate);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Realtime editing fixed for Post Production and Crew');
