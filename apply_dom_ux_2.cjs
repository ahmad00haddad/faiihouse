const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const additionalCss = `
<style>
/* Session Toast */
.session-toast { position:fixed; top:20px; left:50%; transform:translateX(-50%) translateY(-100px); background:var(--primary); color:#000; font-size:12px; font-weight:bold; padding:10px 20px; border-radius:30px; box-shadow:0 10px 30px rgba(212,175,55,0.4); opacity:0; transition:0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index:10000; pointer-events:none; }
.session-toast.show { transform:translateX(-50%) translateY(0); opacity:1; }

/* Ghost PDF */
.ghost-pdf { position:absolute; right:20px; top:20px; width:45px; height:60px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:4px; transition:0.3s; pointer-events:none; display:none; flex-direction:column; padding:4px; gap:2px; box-shadow:0 4px 10px rgba(0,0,0,0.2); }
@media(min-width:1024px){ .ghost-pdf { display:flex; } }
.ghost-pdf .line { background:rgba(255,255,255,0.1); height:2px; border-radius:2px; width:100%; transition:0.3s; }
.ghost-pdf .line.short { width:60%; }
.ghost-pdf .line.primary { background:var(--primary); width:40%; opacity:0; }

/* SVG Checkbox replacement for Post-production */
.post-option input[type="checkbox"] { appearance:none; -webkit-appearance:none; width:20px; height:20px; border:1px solid var(--border); border-radius:4px; margin-inline-end:10px; cursor:pointer; position:relative; outline:none; transition:0.2s; flex-shrink:0; }
.post-option input[type="checkbox"]:checked { background:rgba(212,175,55,0.1); border-color:var(--primary); }
.post-option input[type="checkbox"]::after { content:''; position:absolute; left:6px; top:2px; width:6px; height:11px; border:solid var(--primary); border-width:0 2px 2px 0; transform:rotate(45deg) scale(0); transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity:0; }
.post-option input[type="checkbox"]:checked::after { transform:rotate(45deg) scale(1); opacity:1; }

/* Contextual Documentary Hint */
.doc-hint { font-size:11px; color:var(--primary); background:rgba(212,175,55,0.1); padding:8px 12px; border-radius:6px; margin-top:10px; display:none; animation:fadeIn 0.3s ease; border: 1px solid var(--gold-b); }
.doc-hint.show { display:block; }
@keyframes fadeIn { from{opacity:0;transform:translateY(-5px);} to{opacity:1;transform:translateY(0);} }
</style>
`;

const additionalJs = `
<script>
document.addEventListener('DOMContentLoaded', () => {
  // 1. Session Toast
  if(localStorage.getItem('faiihouse_quote_state')) {
    const toastHtml = '<div id="sessionToast" class="session-toast">✨ استعدنا بياناتك السابقة لتوفير وقتك</div>';
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    setTimeout(() => { document.getElementById('sessionToast')?.classList.add('show'); }, 500);
    setTimeout(() => { document.getElementById('sessionToast')?.classList.remove('show'); }, 4000);
  }

  // 2. Ghost PDF in Sidebar
  const sidebarHeader = document.querySelector('.sidebar .sb-header');
  if(sidebarHeader) {
    sidebarHeader.style.position = 'relative';
    sidebarHeader.insertAdjacentHTML('beforeend', \`
      <div id="ghostPdf" class="ghost-pdf">
        <div class="line primary" id="g-title"></div>
        <div class="line"></div>
        <div class="line short"></div>
        <div style="flex:1"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    \`);
  }

  // 3. Documentary Hint Setup
  const sec5 = document.getElementById('sec-5');
  if(sec5) {
    const p = sec5.querySelector('.section-head');
    if(p) p.insertAdjacentHTML('beforeend', '<div id="docHint" class="doc-hint">💡 <strong>نصيحة للمخرجات الوثائقية:</strong> الأفلام الوثائقية غالباً ما تحتاج لخدمة <strong>تصحيح الألوان (Color Grading)</strong> الاحترافية لإعطاء الطابع السينمائي، هل ندرجها لك؟</div>');
  }

  // 4. Hook into updateQuote for Ghost PDF and Doc Hint
  const originalUpdate2 = window.updateQuote;
  window.updateQuote = function() {
    if(originalUpdate2) originalUpdate2();
    setTimeout(() => {
      // Documentary Hint
      const docHint = document.getElementById('docHint');
      if(docHint && typeof state !== 'undefined') {
        if(state.projectType === 'documentary') docHint.classList.add('show');
        else docHint.classList.remove('show');
      }

      // Ghost PDF Fill
      const gTitle = document.getElementById('g-title');
      if(gTitle && typeof state !== 'undefined') {
        if(state.clientName || state.projectType) {
          gTitle.style.opacity = '1';
          gTitle.style.width = '80%';
        }
      }
    }, 100);
  };

  // 5. Zero-State Helper for Equipment via goStep Intercept
  const originalGoStep3 = window.goStep;
  window.goStep = function(n) {
    if (n === 5 && typeof state !== 'undefined' && state.step === 4) {
      // Trying to leave Equipment step without any equipment selected
      if(state.projectType !== 'reels' && (!state.equipment || state.equipment === 'none') && (!state.customEquip || state.customEquip == 0)) {
        const btn = document.querySelector('#sec-4 .step-nav-btns button:last-child');
        const mobBtn = document.querySelector('.mobile-quote-bar .mq-btn');
        if(btn && !btn.dataset.warned) {
          btn.dataset.warned = "true";
          const oldHtml = btn.innerHTML;
          btn.innerHTML = 'متأكد بدون معدات؟ ←';
          btn.style.background = 'var(--red)';
          if(mobBtn) { mobBtn.innerHTML = 'متأكد بدون معدات؟ ←'; mobBtn.style.background = 'var(--red)'; }
          if(navigator.vibrate) navigator.vibrate([50, 50, 50]);
          setTimeout(() => {
            btn.innerHTML = oldHtml;
            btn.style.background = '';
            btn.dataset.warned = "";
            if(mobBtn) { mobBtn.innerHTML = '<span class="ar-only">التالي ←</span><span class="en-only">Next →</span>'; mobBtn.style.background = ''; }
          }, 3000);
          return; // Block navigation the first time
        }
      }
    }
    if(originalGoStep3) originalGoStep3(n);
  };
});
</script>
`;

html = html.replace('</body>', additionalCss + additionalJs + '</body>');
fs.writeFileSync('public/quote-builder/index.html', html);
console.log("UX Part 2 injected successfully!");
