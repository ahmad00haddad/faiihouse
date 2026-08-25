const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Update POST_OPTIONS prices
html = html.replace(
  /id:'colorgrade'(.*?)basePrice:75/g,
  "id:'colorgrade'$1basePrice:150"
);
html = html.replace(
  /id:'voiceover'(.*?)basePrice:75/g,
  "id:'voiceover'$1basePrice:100"
);

// 2. Add owner-only CSS class for post inputs
const cssInjection = `
.owner-only { display: none; }
.owner-mode .owner-only { display: flex; align-items:center; gap:5px; margin-right:10px; }
.owner-mode .post-price { flex-direction: column; align-items: flex-end; gap:5px; }
.post-qty-box { display:flex; align-items:center; background:var(--surface); border:1px solid var(--border); border-radius:6px; overflow:hidden; }
.post-qty-box button { background:transparent; border:none; color:var(--text); padding:4px 8px; cursor:pointer; font-weight:bold; }
.post-qty-box button:hover { background:var(--gold-dim); color:var(--gold); }
.post-qty-box span { font-size:11px; min-width:20px; text-align:center; font-weight:600; }
.post-rate-input { width: 50px; background:var(--surface); border:1px solid var(--border); color:var(--text); font-size:11px; padding:4px; border-radius:4px; text-align:center; }
`;
html = html.replace('/* 1. Badges & Ticker */', cssInjection + '\n/* 1. Badges & Ticker */');

// 3. Update renderPostOptions using a more robust replacement strategy.
// We will replace everything from `function renderPostOptions() {` to `// STEP 6: LOCATION`
const renderPostOptionsRegex = /function renderPostOptions\(\) \{[\s\S]*?\/\/ STEP 6:/;

const newRenderPost = `function togglePost(id, checked) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  if(typeof checked === 'boolean') {
    sel.enabled = checked;
  } else {
    sel.enabled = !sel.enabled;
  }
  state.post[id] = sel;
  renderPostOptions();
  updateQuote();
  saveState();
}

function setPostRate(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.rate = parseInt(val) || 0;
  state.post[id] = sel;
  updateQuote();
  saveState();
}

function setPostQty(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.qty = Math.max(1, parseInt(val) || 1);
  state.post[id] = sel;
  updateQuote();
  saveState();
}

function renderPostOptions() {
  const isReels = state.projectType === 'reels';
  document.getElementById('postOptions').innerHTML = POST_OPTIONS.map(p=>{
    let sel = state.post[p.id];
    if(typeof sel === 'boolean') {
      sel = { enabled: sel, rate: p.basePrice, qty: 1 };
      state.post[p.id] = sel;
    } else if(!sel) {
      sel = { enabled: false, rate: p.basePrice, qty: 1 };
    }

    if(isReels && p.id==='editing') {
      return \\\`<div class="post-option grain-card sel" style="pointer-events:none;opacity:0.85;">
        <div class="post-option-left">
          <input type="checkbox" checked disabled>
          <div>
            <div class="post-option-name">\${L(p.ar, p.name)}</div>
            <div class="post-option-desc" style="color:var(--green)">✓ \${L('مشمول في سعر الريل','Included in reel price')}</div>
          </div>
        </div>
        <div class="post-price" style="color:var(--green);">\${L('مشمول','Included')}</div>
      </div>\\\`;
    }

    const extraNote = p.scriptNote ? \\\`<div class="post-option-desc" style="color:var(--text3);margin-top:3px;">50–100 \${state.currency||"JOD"} \${L('حسب المشروع','depending on project')}</div>\\\` : '';

    return \\\`<div class="post-option grain-card \${sel.enabled?'sel':''}" onclick="togglePost('\${p.id}')">
      <div class="post-option-left">
        <input type="checkbox" \${sel.enabled?'checked':''} onchange="togglePost('\${p.id}', this.checked)" onclick="event.stopPropagation()">
        <div>
          <div class="post-option-name">\${L(p.ar, p.name)}</div>
          <div class="post-option-desc">\${L(p.descAr, p.desc)}</div>
          \${extraNote}
        </div>
      </div>
      <div class="post-price-wrap" style="display:flex; align-items:center;">
        
        <div class="post-qty-box" onclick="event.stopPropagation()" style="margin-right:15px; margin-left:15px;">
          <button onclick="setPostQty('\${p.id}', \${sel.qty-1})">−</button>
          <span>\${sel.qty}</span>
          <button onclick="setPostQty('\${p.id}', \${sel.qty+1})">+</button>
        </div>

        <div class="owner-only" onclick="event.stopPropagation()">
          <input type="number" class="post-rate-input" value="\${sel.rate}" onchange="setPostRate('\${p.id}', this.value)">
        </div>
        
        <div class="post-price" style="min-width: 50px; text-align: end;">
          \${sel.qty > 1 ? sel.qty + ' × ' : ''}\${sel.rate} \${state.currency||"JOD"}
        </div>
      </div>
    </div>\\\`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// STEP 6:`;

html = html.replace(renderPostOptionsRegex, newRenderPost);

// 4. Update calcQuote / updateQuote to use sel.rate and sel.qty
const oldPostQuoteRegex = /if\(!state\.post\[p\.id\]\) return;[\s\S]*?postLines\.push\(\{[\s\S]*?\}\);/g;
const newPostQuote = `
    let sel = state.post[p.id];
    if(!sel) return;
    if(typeof sel === 'boolean') {
      if(!sel) return;
      sel = { enabled: true, rate: p.basePrice, qty: 1 };
    } else {
      if(!sel.enabled) return;
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
`;
html = html.replace(oldPostQuoteRegex, newPostQuote);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Refactored Post Production');
