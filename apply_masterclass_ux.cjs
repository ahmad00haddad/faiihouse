const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. CSS Injections
const cssChunk = `
/* Masterclass UX CSS */
.ripple {
  position: absolute; border-radius: 50%; transform: scale(0);
  animation: ripple-anim 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(212,175,55,0.4); pointer-events: none; z-index: 10;
}
@keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }

@keyframes floatGhost {
  0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -40px) scale(1.1); }
}
.cost-ghost {
  position: fixed; color: var(--green); font-weight: 700;
  pointer-events: none; z-index: 999999;
  animation: floatGhost 0.8s ease-out forwards;
  text-shadow: 0 2px 5px rgba(0,0,0,0.8); font-size: 15px;
}
.cost-ghost.negative { color: #ff4c4c; }

@media(max-width:992px) {
  .mobile-total-bar {
    bottom: 20px !important; left: 50% !important; transform: translateX(-50%) !important;
    width: 92% !important; max-width: 400px !important;
    border-radius: 50px !important; background: rgba(20, 20, 20, 0.85) !important;
    backdrop-filter: blur(16px) !important; -webkit-backdrop-filter: blur(16px) !important;
    border: 1px solid rgba(212,175,55,0.4) !important;
    box-shadow: 0 12px 32px rgba(0,0,0,0.6) !important; padding: 12px 24px !important;
    transition: all 0.3s cubic-bezier(0.2,0.8,0.2,1) !important;
  }
}

.dep-warn {
  color: #ffb84d; font-size: 12px; display: inline-flex; align-items: center; 
  margin-right: 6px; margin-left: 6px; cursor: help; animation: pulse-warn 2s infinite;
}
@keyframes pulse-warn { 0% { opacity:0.6; transform:scale(0.9); } 50% { opacity:1; transform:scale(1.1); } 100% { opacity:0.6; transform:scale(0.9); } }
`;
html = html.replace('</style>', cssChunk + '\n</style>');

// 2. Main Action Button ID
html = html.replace('<button class="btn-primary" style="width:100%;font-size:18px;padding:16px;border-radius:12px;margin-top:10px" onclick="sendWhatsApp()">', 
                    '<button id="mainActionBtn" class="btn-primary" style="width:100%;font-size:18px;padding:16px;border-radius:12px;margin-top:10px; transition: all 0.3s ease;" onclick="sendWhatsApp()">');

// 3. updateQuote() Morphing Button
const updateQuoteEnd = `  const url = \`https://wa.me/962799256345?text=\${encodeURIComponent(msg)}\`;
  window.open(url, '_blank');
}`;
const morphInject = `  const mainBtn = document.getElementById('mainActionBtn');
  if(mainBtn) {
    if(q.total > 0) {
      mainBtn.innerHTML = \`\${L('إرسال التسعيرة','Send Quote')} (\${q.total} \${state.currency||'JOD'}) ⚡\`;
    } else {
      mainBtn.innerHTML = L('ابدأ بناء مشروعك ⚡', 'Start Building ⚡');
    }
  }
  window.activePulseId = null;
}
`;
html = html.replace(/window\.activePulseId = null;\s*}/, morphInject);


// 4. HTML changes for events in crew and days
html = html.replace(/onclick="setQty\('\$\{r\.id\}', 1\)"/g, `onclick="setQty('\${r.id}', 1, event)"`);
html = html.replace(/onclick="setQty\('\$\{r\.id\}', -1\)"/g, `onclick="setQty('\${r.id}', -1, event)"`);

html = html.replace(/onclick="changeDays\(1\)"/g, `onclick="changeDays(1, event)"`);
html = html.replace(/onclick="changeDays\(-1\)"/g, `onclick="changeDays(-1, event)"`);

// 5. Change JS Functions
// changeDays
const oldChangeDays = `function changeDays(d) {
  state.days = Math.max(1, (state.days||1)+d);`;
const newChangeDays = `function changeDays(d, e) {
  if (e && d > 0) spawnCostGhost(e, "+1 " + L('يوم', 'Day'), true);
  if (e && d < 0 && state.days > 1) spawnCostGhost(e, "-1 " + L('يوم', 'Day'), true);
  state.days = Math.max(1, (state.days||1)+d);`;
html = html.replace(oldChangeDays, newChangeDays);

// setQty
const oldSetQty = `function setQty(id, d) {
  const s = state.crew[id];
  if(!s) return;
  s.qty = Math.max(1, (s.qty||1)+d);`;
const newSetQty = `function setQty(id, d, e) {
  const s = state.crew[id];
  if(!s) return;
  if(e && d > 0) spawnCostGhost(e, '+' + (s.rate * (state.days||1)) + ' ' + (state.currency||'JOD'));
  if(e && d < 0 && s.qty > 1) spawnCostGhost(e, '-' + (s.rate * (state.days||1)) + ' ' + (state.currency||'JOD'));
  s.qty = Math.max(1, (s.qty||1)+d);`;
html = html.replace(oldSetQty, newSetQty);

// Dependency Warning in renderCrewTable
const oldRowStart = `const total = s.enabled ? (s.rate*s.qty*state.days) : 0;
    rows += \`<tr>`;
const newRowStart = `const total = s.enabled ? (s.rate*s.qty*state.days) : 0;
    let depWarn = '';
    if(r.id === 'cam_assistant' && (!state.crew['cinematographer'] || !state.crew['cinematographer'].enabled)) {
      depWarn = \`<span class="dep-warn" title="\${L('نوصي باختيار مصور سينمائي أولاً','DOP recommended first')}">⚠️</span>\`;
    }
    rows += \`<tr>`;
html = html.replace(oldRowStart, newRowStart);

// Inject depWarn into the names
html = html.replace(/<div class="role-name">\$\{r\.name\}<\/div>/g, `<div class="role-name">\${depWarn}\${r.name}</div>`);
html = html.replace(/<div class="role-name-ar">\$\{r\.ar\}<\/div>/g, `<div class="role-name-ar">\${depWarn}\${r.ar}</div>`);


// 6. Global JS scripts for Ripple, Ghost, and Long-Press
const globalScripts = `
// --- Masterclass UX Scripts ---
function spawnCostGhost(e, text, isTextOnly = false) {
  if(!e) return;
  let clientX, clientY;
  if(e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX; clientY = e.clientY;
  }
  const ghost = document.createElement('div');
  ghost.className = 'cost-ghost' + (text.toString().includes('-') ? ' negative' : '');
  ghost.textContent = text;
  ghost.style.left = clientX + 'px';
  ghost.style.top = clientY + 'px';
  document.body.appendChild(ghost);
  setTimeout(() => ghost.remove(), 800);
}

document.addEventListener('click', function(e) {
  const target = e.target.closest('.pt-card, .equip-card, .post-option, .role-info-td, button.btn-primary');
  if(!target || e.target.tagName === 'INPUT') return;
  const rect = target.getBoundingClientRect();
  const circle = document.createElement('span');
  const diameter = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = diameter + 'px';
  circle.style.left = (e.clientX - rect.left - diameter/2) + 'px';
  circle.style.top = (e.clientY - rect.top - diameter/2) + 'px';
  circle.classList.add('ripple');
  
  const compStyle = window.getComputedStyle(target);
  if(compStyle.position === 'static') target.style.position = 'relative';
  if(compStyle.overflow !== 'hidden' && !target.classList.contains('role-info-td')) target.style.overflow = 'hidden';
  
  target.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
});

let longPressTimer;
function handleDown(e) {
  const btn = e.target.closest('button');
  if(!btn || btn.textContent.trim() !== '−') return;
  
  let clientX, clientY;
  if(e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX; clientY = e.clientY;
  }
  
  const onclick = btn.getAttribute('onclick') || '';
  let idMatch = onclick.match(/setQty\\('([^']+)',\\s*-1/);
  
  longPressTimer = setTimeout(() => {
    if(idMatch) {
      // Long press clears crew role!
      toggleRole(idMatch[1], false);
      
      const ghost = document.createElement('div');
      ghost.className = 'cost-ghost negative'; ghost.textContent = L('تم المسح', 'Cleared');
      ghost.style.left = clientX+'px'; ghost.style.top = clientY+'px';
      document.body.appendChild(ghost);
      setTimeout(()=>ghost.remove(), 800);
      
      if(navigator.vibrate) navigator.vibrate(50);
    }
  }, 600);
}
function handleUp() { clearTimeout(longPressTimer); }
document.addEventListener('mousedown', handleDown);
document.addEventListener('mouseup', handleUp);
document.addEventListener('touchstart', handleDown, {passive:true});
document.addEventListener('touchend', handleUp);
// ------------------------------
</script>`;
html = html.replace('</script>', globalScripts);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Applied Masterclass UX Features');
