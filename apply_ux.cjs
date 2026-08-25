const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. CSS
const cssToAdd = `
.badge-popular { position:absolute; top:-10px; right:-10px; background:var(--red); color:#fff; font-size:10px; padding:4px 8px; border-radius:12px; font-weight:bold; box-shadow:0 4px 10px rgba(231,76,60,0.3); z-index:10; pointer-events:none; }
.form-group:focus-within label { color: var(--primary); transform: translateX(4px); transition:0.3s; }
.sidebar { overscroll-behavior: contain; }
.savings-ticker { position:fixed; bottom:90px; right:20px; background:var(--green); color:#fff; font-size:13px; padding:10px 16px; border-radius:12px; box-shadow:0 10px 25px rgba(46,204,113,0.4); opacity:0; transform:translateY(20px); transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index:9999; pointer-events:none; font-weight:600; display:flex; align-items:center; gap:8px;}
.savings-ticker.show { opacity:1; transform:translateY(0); }
@media(max-width:768px) { .savings-ticker { bottom: 80px; right: 20px; left: 20px; justify-content:center; } }
`;
html = html.replace('</style>', cssToAdd + '\n</style>');

// 2. Add badges and HTML hints
html = html.replace(
  '<div class="type-card" onclick="selectType(\'commercial\')">',
  '<div class="type-card" onclick="selectType(\'commercial\')" style="position:relative;"><div class="badge-popular">🔥 الأكثر طلباً</div>'
);
html = html.replace(
  '<div class="equip-card" onclick="selectEquip(\'advanced\')">',
  '<div class="equip-card" onclick="selectEquip(\'advanced\')" style="position:relative;"><div class="badge-popular">🔥 الأكثر طلباً</div>'
);
html = html.replace(
  '<h2 class="en-only">Project Type</h2>',
  '<h2 class="en-only">Project Type</h2>\n<p style="font-size:11px; color:var(--primary); margin-top:-4px; margin-bottom:12px;">⏱ يستغرق هذا النموذج دقيقتين فقط.. نحن نحسب كل شيء عنك</p>'
);
html = html.replace(
  '<td><span class="ar-only">مساعد تصوير</span>',
  '<td><span class="ar-only">↳ مساعد تصوير</span>'
);
html = html.replace(
  '<td><span class="en-only">Assistant Camera</span>',
  '<td><span class="en-only">↳ Assistant Camera</span>'
);
html = html.replace(
  '<div class="hint-popup">Includes standard cinema camera',
  '<div class="hint-popup">🎥 💡 🎤 Includes standard cinema camera'
);
html = html.replace(
  '<div class="hint-popup">يغطي النقل داخل عمان',
  '<div class="hint-popup">🚗 يغطي النقل داخل عمان'
);
html = html.replace(
  '<div class="hint-popup">العقبة، البتراء، وادي رم',
  '<div class="hint-popup">🏜 يبعد 4 ساعات - رسوم السفر تغطي النقل والطاقم ليوم كامل'
);

// 3. JS Additions
const jsToAdd = `
// Audio Synthesis for UX
let audioCtx = null;
function initAudio() {
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTick() {
  try {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.05);
  } catch(e){}
}
function playSuccess() {
  try {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.3);
  } catch(e){}
}

// Number Odometer function
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

// Magnetic Button Logic
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', initAudio, {once:true});
  const btn = document.querySelector('.mq-btn');
  if(btn) {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = \`translate(\${x * 0.15}px, \${y * 0.15}px)\`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  }

  // 3D Tilt on Cards
  document.querySelectorAll('.type-card, .equip-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) translateY(-3px)\`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
`;
html = html.replace('</script>\n</body>', jsToAdd + '\n</script>\n</body>');

// 4. Inject Ticker DOM
html = html.replace(
  '</body>',
  '<div id="savingsTicker" class="savings-ticker"><span style="font-size:16px;">💰</span> <span class="ar-only">أنت توفر</span><span class="en-only">You save</span> <span id="savingsAmt">0</span> JD <span class="ar-only">الآن!</span><span class="en-only">now!</span></div>\n</body>'
);

// 5. Update updateQuote to use odometer and show ticker
html = html.replace(
  "mt.textContent = q.total+' JD';",
  "animateValue(mt, parseInt(mt.textContent)||0, q.total, 400);"
);
html = html.replace(
  "mobT.textContent = q.total+' JD';",
  "animateValue(mobT, parseInt(mobT.textContent)||0, q.total, 400);"
);

const tickerLogic = `
  const ticker = document.getElementById('savingsTicker');
  if(ticker) {
    if(q.discountAmt > 0) {
      document.getElementById('savingsAmt').textContent = q.discountAmt;
      ticker.classList.add('show');
    } else {
      ticker.classList.remove('show');
    }
  }
`;
html = html.replace(
  "if(mt) {",
  tickerLogic + "\n  if(mt) {"
);

// 6. Update goStep for Haptics & Sound
html = html.replace(
  "function goStep(n) {",
  "function goStep(n) {\n  if(navigator.vibrate) navigator.vibrate(30);\n  playTick();"
);

// 7. Update setDelivery for Haptics
html = html.replace(
  "function setDelivery(val) {",
  "function setDelivery(val) {\n  if(navigator.vibrate) navigator.vibrate(30);\n  playTick();"
);

// 8. Update showPreview for success sound
html = html.replace(
  "document.getElementById('quoteModal').classList.add('show');",
  "document.getElementById('quoteModal').classList.add('show');\n  playSuccess();"
);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log("UX modifications applied successfully!");
