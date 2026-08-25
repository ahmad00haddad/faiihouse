const fs = require('fs');

let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const cssToInject = `
<style>
/* 1. Badges & Ticker */
.badge-popular { position:absolute; top:-10px; right:-10px; background:var(--red); color:#fff; font-size:10px; padding:4px 8px; border-radius:12px; font-weight:bold; box-shadow:0 4px 10px rgba(231,76,60,0.3); z-index:10; pointer-events:none; }
.savings-ticker { position:fixed; bottom:90px; right:20px; background:var(--green); color:#fff; font-size:13px; padding:10px 16px; border-radius:12px; box-shadow:0 10px 25px rgba(46,204,113,0.4); opacity:0; transform:translateY(20px); transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index:9999; pointer-events:none; font-weight:600; display:flex; align-items:center; gap:8px;}
.savings-ticker.show { opacity:1; transform:translateY(0); }
@media(max-width:768px) { .savings-ticker { bottom: 80px; right: 20px; left: 20px; justify-content:center; } }

/* 2. Micro-interactions */
.form-group:focus-within label { color: var(--primary); transform: translateX(4px); transition:0.3s; }
.sidebar { overscroll-behavior: contain; }
.tilt-card { transition: transform 0.1s ease-out, box-shadow 0.1s ease-out; transform-style: preserve-3d; }
.ghost-pdf { position:absolute; right:20px; top:20px; width:40px; height:50px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:4px; opacity:0.5; transition:0.3s; pointer-events:none; }
.ghost-pdf::after { content:''; position:absolute; inset:4px; background:linear-gradient(to bottom, rgba(255,255,255,0.1) 2px, transparent 2px) 0 0/100% 6px; }

/* 3. Gold Dust */
.gold-dust { position:absolute; width:4px; height:4px; background:var(--gold); border-radius:50%; pointer-events:none; animation:dustFall 1s ease-out forwards; }
@keyframes dustFall { 0% { transform:translateY(0) scale(1); opacity:1; } 100% { transform:translateY(20px) scale(0); opacity:0; } }
</style>
`;

const jsToInject = `
<script>
// 1. Audio System
let audioCtx = null;
function initAudio() { if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playTick() {
  try {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.05);
  } catch(e){}
}
function playSuccess() {
  try {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'triangle'; osc.frequency.setValueAtTime(400, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.3);
  } catch(e){}
}

// 2. Odometer
function animateValue(obj, start, end, duration) {
  if(!obj) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const val = Math.floor(progress * (end - start) + start);
    obj.innerHTML = val + ' JD';
    if (progress < 1) { window.requestAnimationFrame(step); }
    else { obj.innerHTML = end + ' JD'; }
  };
  window.requestAnimationFrame(step);
}

// Intercept existing functions
const originalGoStep = window.goStep;
window.goStep = function(n) {
  if(navigator.vibrate) navigator.vibrate(20);
  playTick();
  if(originalGoStep) originalGoStep(n);
};

const originalSetDelivery = window.setDelivery;
window.setDelivery = function(val) {
  if(navigator.vibrate) navigator.vibrate(20);
  playTick();
  if(originalSetDelivery) originalSetDelivery(val);
};

const originalUpdateQuote = window.updateQuote;
window.updateQuote = function() {
  if(originalUpdateQuote) originalUpdateQuote();
  setTimeout(() => {
    // Odometer
    const mt = document.getElementById('totalPrice');
    const mobT = document.getElementById('mobileTotal');
    const targetTotal = typeof calcQuote === 'function' ? calcQuote().total : 0;
    const discountAmt = typeof calcQuote === 'function' ? calcQuote().discountAmt : 0;
    
    if(mt && parseInt(mt.textContent) !== targetTotal) animateValue(mt, parseInt(mt.textContent)||0, targetTotal, 400);
    if(mobT && parseInt(mobT.textContent) !== targetTotal) animateValue(mobT, parseInt(mobT.textContent)||0, targetTotal, 400);

    // Savings Ticker
    const ticker = document.getElementById('savingsTicker');
    if(ticker) {
      if(discountAmt > 0) {
        document.getElementById('savingsAmt').textContent = discountAmt;
        ticker.classList.add('show');
      } else {
        ticker.classList.remove('show');
      }
    }
  }, 50);
};

// 3. DOM Ready Injections
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', initAudio, {once:true});

  // Inject Ticker
  const tickerHtml = '<div id="savingsTicker" class="savings-ticker"><span style="font-size:16px;">💰</span> <span class="ar-only">أنت توفر</span><span class="en-only">You save</span> <span id="savingsAmt">0</span> JD <span class="ar-only">الآن!</span><span class="en-only">now!</span></div>';
  document.body.insertAdjacentHTML('beforeend', tickerHtml);

  // Time hint
  const sec1 = document.getElementById('sec-1');
  if(sec1) {
    const p = sec1.querySelector('.section-head');
    if(p) p.insertAdjacentHTML('beforeend', '<p style="font-size:11px; color:var(--primary); margin-top:-4px; margin-bottom:12px;" class="ar-only">⏱ يستغرق هذا النموذج دقيقتين فقط.. نحن نحسب كل شيء عنك</p>');
  }

  // Magnetic Button
  const btn = document.getElementById('btnGenerate');
  if(btn) {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = \`translate(\${x * 0.15}px, \${y * 0.15}px)\`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  }

  // Apply Badges periodically because cards are re-rendered
  setInterval(() => {
    document.querySelectorAll('.type-name').forEach(el => {
      if(el.textContent.includes('إعلان تجاري') && !el.parentNode.querySelector('.badge-popular')) {
        el.parentNode.style.position = 'relative';
        el.parentNode.insertAdjacentHTML('beforeend', '<div class="badge-popular">🔥 الأكثر طلباً</div>');
      }
    });
    document.querySelectorAll('.equip-card').forEach(el => {
      if(el.textContent.includes('Advanced') && !el.querySelector('.badge-popular')) {
        el.style.position = 'relative';
        el.insertAdjacentHTML('beforeend', '<div class="badge-popular">🔥 الأكثر طلباً</div>');
      }
    });
    // 3D Tilt
    document.querySelectorAll('.type-card:not(.tilted), .equip-card:not(.tilted)').forEach(card => {
      card.classList.add('tilted');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        card.style.transform = \`perspective(1000px) rotateX(\${((y - centerY)/centerY)*-5}deg) rotateY(\${((x - centerX)/centerX)*5}deg) translateY(-3px)\`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }, 1000);

  // Sound on Success
  const originalShowPreview = window.showPreview;
  window.showPreview = function() {
    if(originalShowPreview) originalShowPreview();
    playSuccess();
    
    // Setup Gold Dust hover on total price in modal
    setTimeout(() => {
      const qTotal = document.querySelector('.q-sub-new');
      if(qTotal) {
        qTotal.addEventListener('mousemove', (e) => {
          if(Math.random() > 0.2) return;
          const dust = document.createElement('div');
          dust.className = 'gold-dust';
          dust.style.left = e.clientX + 'px';
          dust.style.top = e.clientY + 'px';
          document.body.appendChild(dust);
          setTimeout(() => dust.remove(), 1000);
        });
      }
    }, 1000);
  };
});
</script>
`;

html = html.replace('</body>', cssToInject + jsToInject + '</body>');
fs.writeFileSync('public/quote-builder/index.html', html);
console.log("UX modifications injected safely into DOM via script!");
