const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Inject HTML warning below equipGrid
const equipHtmlRegex = /<div class="equip-grid" id="equipGrid"><\/div>/;
const newEquipHtml = `<div class="equip-grid" id="equipGrid"></div>
    <div id="warn-equip-pro" style="background: rgba(231, 76, 60, 0.08); border: 1px solid rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 12px 16px; border-radius: 8px; font-size: 12px; margin-top: 16px; display: none; line-height: 1.5; font-weight: 500;">
      ⚠️ <span class="ar-only">تنبيه: باقات السينما الاحترافية تتطلب "مصور سينمائي" خبير لتشغيلها وإعدادها.</span>
      <span class="en-only">Warning: Cinema packages require an experienced Cinematographer to operate.</span>
    </div>`;

html = html.replace(equipHtmlRegex, newEquipHtml);

// 2. Inject JS logic into updateQuote()
const updateQuoteMarker = `// Update Editing Warning`;
const updateQuoteInjection = `// Update Equipment Pro Warning
  const warnEquipPro = document.getElementById('warn-equip-pro');
  if(warnEquipPro) {
    const isProEquip = state.equipment === 'pro' || state.equipment === 'red';
    const hasDOP = state.crew['cinematographer'] && state.crew['cinematographer'].enabled;
    warnEquipPro.style.display = (isProEquip && !hasDOP) ? 'block' : 'none';
  }

  // Update Editing Warning`;

html = html.replace(updateQuoteMarker, updateQuoteInjection);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Injected Pro Equipment Warning');
