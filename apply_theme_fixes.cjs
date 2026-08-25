const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Fix Badge CSS (Mobile visibility + Theme)
html = html.replace(
  /\.badge-popular \{ position:absolute; top:-10px; right:-10px; background:var\(--red\); color:#fff; font-size:10px; padding:4px 8px; border-radius:12px; font-weight:bold; box-shadow:0 4px 10px rgba\(231,76,60,0\.3\); z-index:10; pointer-events:none; \}/g,
  `.badge-popular { position:absolute; top:0; right:0; background:var(--gold); color:#000; font-size:10px; padding:4px 10px; border-radius:0 10px 0 10px; font-weight:bold; box-shadow:-2px 2px 10px rgba(0,0,0,0.1); z-index:10; pointer-events:none; }`
);

// 2. Fix Ticker CSS (Theme)
html = html.replace(
  /\.savings-ticker \{ position:fixed; bottom:90px; right:20px; background:var\(--green\); color:#fff;/g,
  `.savings-ticker { position:fixed; bottom:90px; right:20px; background:var(--surface-elevated); border:1px solid var(--border); color:var(--text);`
);
html = html.replace(
  /box-shadow:0 10px 25px rgba\(46,204,113,0\.4\);/g,
  `box-shadow:0 10px 25px rgba(0,0,0,0.5);`
);

// 3. Fix Quote Preview Discount Box Theme
html = html.replace(
  /background:rgba\(46,204,113,0\.08\);border:1px solid rgba\(46,204,113,0\.2\);padding:10px 14px;font-size:12px;color:#2ecc71;/g,
  `background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);padding:10px 14px;font-size:12px;color:var(--gold);`
);

// 4. Fix HTML Ticker injected string
html = html.replace(
  /<div id="savingsTicker" class="savings-ticker"><span style="font-size:16px;">💰<\/span> <span class="ar-only">أنت توفر<\/span><span class="en-only">You save<\/span> <span id="savingsAmt">0<\/span> \${state\.currency\|\|'JOD'} <span class="ar-only">الآن!<\/span><span class="en-only">now!<\/span><\/div>/g,
  `<div id="savingsTicker" class="savings-ticker"><span style="color:var(--gold); font-size:16px;">✦</span> <span class="ar-only">أنت توفر</span><span class="en-only">You save</span> <span id="savingsAmt" style="color:var(--gold);font-weight:bold;margin:0 4px;">0</span> \${state.currency||'JOD'} <span class="ar-only">الآن!</span><span class="en-only">now!</span></div>`
);
html = html.replace(
  /<div id="savingsTicker" class="savings-ticker"><span style="font-size:16px;">💰<\/span> <span class="ar-only">أنت توفر<\/span><span class="en-only">You save<\/span> <span id="savingsAmt">0<\/span> JD <span class="ar-only">الآن!<\/span><span class="en-only">now!<\/span><\/div>/g,
  `<div id="savingsTicker" class="savings-ticker"><span style="color:var(--gold); font-size:16px;">✦</span> <span class="ar-only">أنت توفر</span><span class="en-only">You save</span> <span id="savingsAmt" style="color:var(--gold);font-weight:bold;margin:0 4px;">0</span> JD <span class="ar-only">الآن!</span><span class="en-only">now!</span></div>`
);

// 5. Fix Javascript Injection of Ticker (where JS creates it on DOMContentLoaded)
html = html.replace(
  /const tickerHtml = '<div id="savingsTicker" class="savings-ticker"><span style="font-size:16px;">💰<\/span> <span class="ar-only">أنت توفر<\/span><span class="en-only">You save<\/span> <span id="savingsAmt">0<\/span> JD <span class="ar-only">الآن!<\/span><span class="en-only">now!<\/span><\/div>';/g,
  `const tickerHtml = '<div id="savingsTicker" class="savings-ticker"><span style="color:var(--gold); font-size:16px;">✦</span> <span class="ar-only">أنت توفر</span><span class="en-only">You save</span> <span id="savingsAmt" style="color:var(--gold);font-weight:bold;margin:0 4px;">0</span> <span class="curr-lbl">JD</span> <span class="ar-only">الآن!</span><span class="en-only">now!</span></div>';`
);

// 6. Fix Sidebar Discount Badge color
// The old code had: <div class="sb-discount-badge" style="color:var(--green)"> ... wait it didn't have inline color, let's check index.html for .sb-discount-badge
html = html.replace(
  /\.sb-discount-badge\{font-size:10px;font-weight:700;color:var\(--green\);/g,
  `.sb-discount-badge{font-size:10px;font-weight:700;color:var(--gold);`
);

// 7. Fix Reels saving text color in renderTypes
html = html.replace(
  /<div class="rt-save" style="color:var\(--green\)">/g,
  `<div class="rt-save" style="color:var(--gold)">`
);

// 8. Fix mobile equipment warning button color from Red to a more subtle warning (e.g. Gold or Dark Outline)
html = html.replace(
  /btn\.style\.background = 'var\(--red\)';/g,
  `btn.style.background = 'var(--gold)'; btn.style.color = '#000';`
);
html = html.replace(
  /mobBtn\.style\.background = 'var\(--red\)';/g,
  `mobBtn.style.background = 'var(--gold)'; mobBtn.style.color = '#000';`
);
html = html.replace(
  /btn\.style\.background = '';/g,
  `btn.style.background = ''; btn.style.color = '';`
);
html = html.replace(
  /mobBtn\.style\.background = '';/g,
  `mobBtn.style.background = ''; mobBtn.style.color = '';`
);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Theme and responsiveness fixes applied!');
