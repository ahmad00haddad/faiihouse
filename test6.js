
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if(typeof state !== 'undefined') {
      if(!state.currency) state.currency = 'JOD';
      if(!state.paymentTerms) state.paymentTerms = '50_50';
      const cSel = document.getElementById('ownerCurrency');
      const pSel = document.getElementById('ownerPayment');
      if(cSel) cSel.value = state.currency;
      if(pSel) pSel.value = state.paymentTerms;
      const dModeSel = document.getElementById('ownerDiscountMode');
      const dValInp = document.getElementById('ownerDiscountVal');
      if(dModeSel && state.discountMode) {
        dModeSel.value = state.discountMode;
        if(state.discountMode === 'custom_pct' || state.discountMode === 'custom_amt') {
          dValInp.style.display = 'block';
          dValInp.value = state.discountVal || '';
        }
      }
    }
  }, 500);
});

// Intercept string renders
const originalL = window.L;
window.L = function(ar, en) {
  if(!originalL) return ar;
  let res = originalL(ar, en);
  if(typeof state !== 'undefined' && state.currency && state.currency !== 'JOD') {
     res = res.replace(/JD/g, state.currency);
  }
  return res;
};

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
  let idMatch = onclick.match(/setQty\('([^']+)',\s*-1/);
  
  longPressTimer = setTimeout(() => {
    if(idMatch) {
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
