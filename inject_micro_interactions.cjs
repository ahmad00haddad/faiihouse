const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Inject CSS
const cssInjection = `
@keyframes gold-flash {
  0% { box-shadow: 0 0 0px var(--gold); border-color: var(--gold); }
  50% { box-shadow: 0 0 20px var(--gold); border-color: var(--gold); background: rgba(212,175,55,0.1); }
  100% { box-shadow: 0 0 0px var(--gold); border-color: var(--border); }
}
.liquid-ripple {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple-anim 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 0;
  width: 200px;
  height: 200px;
}
@keyframes ripple-anim {
  to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
}
`;
html = html.replace('</style>', cssInjection + '\n</style>');

// 2. Click Fatigue (toggleRole)
const toggleRoleRegex = /function toggleRole\(id, checked\) \{([\s\S]*?)saveState\(\);\s*\}/;
html = html.replace(toggleRoleRegex, (match, p1) => {
    return `function toggleRole(id, checked) {${p1}
  // Advanced Micro-interaction: Liquid Ripple & Scale
  if(navigator.vibrate) navigator.vibrate(checked ? [15, 30] : [10]);
  const cb = document.getElementById('cb-'+id);
  if(cb) {
    const row = cb.closest('tr');
    if(row) {
      row.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      row.style.transform = checked ? 'scale(1.02)' : 'scale(0.98)';
      setTimeout(() => row.style.transform = 'scale(1)', 200);
      
      const rect = row.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.className = 'liquid-ripple';
      ripple.style.background = checked ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      row.style.position = 'relative';
      row.style.overflow = 'hidden';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      row.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
  }
  saveState();
}`;
});

// 3. Ghost Quote (updateQuote)
const updateQuoteEnd = `  // Mobile total`;
const ghostQuoteInjection = `  // Feature: Ghost Quote Check (Mobile Bar & Send Button)
  const mobileBar = document.querySelector('.mobile-quote-bar');
  const waBtn = document.querySelector('.btn-wa');
  const totalVal = q.total;

  if (totalVal === 0 && state.projectType) {
    if(mobileBar) {
       mobileBar.style.backgroundColor = 'var(--dark4)';
       mobileBar.style.animation = 'pulse-warn 2s infinite alternate';
    }
    if(waBtn) {
      waBtn.style.display = 'none';
      let ghostHint = document.getElementById('ghost-hint');
      if(!ghostHint) {
        ghostHint = document.createElement('div');
        ghostHint.id = 'ghost-hint';
        ghostHint.style.cssText = 'color:var(--text3); font-size:12px; margin-top:8px; animation: pulse-warn 2s infinite alternate; text-align:center; padding:10px; background: rgba(0,0,0,0.1); border-radius:6px;';
        ghostHint.innerHTML = '<span class="ar-only">يبدو أن مشروعك لا يحتوي على خدمات فعلية.. هل تحتاج مساعدة في الاختيار؟</span><span class="en-only">Your project seems empty.. need help?</span>';
        waBtn.parentElement.insertBefore(ghostHint, waBtn);
      }
      ghostHint.style.display = 'block';
    }
  } else {
    if(mobileBar) {
       mobileBar.style.backgroundColor = '';
       mobileBar.style.animation = '';
    }
    if(waBtn) {
      waBtn.style.display = 'flex';
      const ghostHint = document.getElementById('ghost-hint');
      if(ghostHint) ghostHint.style.display = 'none';
    }
  }

  // Mobile total`;
html = html.replace(updateQuoteEnd, ghostQuoteInjection);

// 4. Lost in the Desert (selectRegion)
const selectRegionRegex = /function selectRegion\(id\) \{([\s\S]*?)saveState\(\);\s*\}/;
html = html.replace(selectRegionRegex, (match, p1) => {
    return `function selectRegion(id) {${p1}
  // Smart Hint: Lost in the Desert (Travel)
  const regObj = REGIONS.find(r=>r.id===id);
  if(regObj && regObj.fee > 0) {
     setTimeout(() => {
       const card = document.querySelector('.region-card.sel');
       if(card) {
          card.style.animation = 'gold-flash 1s';
          setTimeout(() => card.style.animation = '', 1000);
       }
     }, 50);
     let hint = document.getElementById('travel-hint');
     if(!hint) {
        hint = document.createElement('div');
        hint.id = 'travel-hint';
        hint.style.cssText = 'color:var(--gold); font-size:11px; margin-top:10px; font-weight:bold; animation: pulse-warn 2s infinite alternate; text-align:center;';
        document.getElementById('regionGrid').after(hint);
     }
     hint.innerHTML = '<span class="ar-only">تنويه: التصوير خارج العاصمة يتطلب ترتيبات سفر تم تضمينها تلقائياً.</span><span class="en-only">Note: Travel arrangements have been included automatically.</span>';
  } else {
     const hint = document.getElementById('travel-hint');
     if(hint) hint.remove();
  }
  saveState();
}`;
});

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Injected Smart Hints & Micro-interactions');
