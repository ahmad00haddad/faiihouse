const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Add "None" to EQUIPMENT_TIERS
const oldTiersStr = `const EQUIPMENT_TIERS = [`;
const newTiersStr = `const EQUIPMENT_TIERS = [
  {id:'none', tier:'None', tierAr:'بدون', name:'No Equipment', nameAr:'مقدمة من العميل', items:'Client provided or not required', itemsAr:'مقدمة من طرف العميل أو غير مطلوبة', price:0},`;
if (!html.includes("id:'none'")) {
  html = html.replace(oldTiersStr, newTiersStr);
}

// 2. Fix calcQuote() to mark isZero
const calcEqOld = `equipLines.push({name:\`Equipment — \${tier.name}\`, nameAr:\`معدات — \${tier.nameAr}\`, rate:tier.price, qty:1, days:state.days, total:equipTotal});`;
const calcEqNew = `equipLines.push({name:\`Equipment — \${tier.name}\`, nameAr:\`معدات — \${tier.nameAr}\`, rate:tier.price, qty:1, days:state.days, total:equipTotal, isZero: tier.price===0});`;
html = html.replace(calcEqOld, calcEqNew);

// 3. Fix renderSidebar() to show equipment section if isZero is true
const oldSbEq = `} else if(q.equipTotal>0) {`;
const newSbEq = `} else if(q.equipTotal>0 || q.equipLines.some(l=>l.isZero)) {`;
html = html.replace(oldSbEq, newSbEq);

// 4. Update the sidebar line for equipment
const oldSbLineEq = `html+=\`<div class="sb-line \${window.activePulseId==='equip' ? 'pulse-update' : ''}"><span class="sb-line-label">\${L('تأجير معدات','Equipment Rental')}</span><span class="sb-line-val">\${q.equipTotal} \${state.currency||"JOD"}</span></div>\`;`;
const newSbLineEq = `html+=\`<div class="sb-line \${window.activePulseId==='equip' ? 'pulse-update' : ''}">
      <span class="sb-line-label">\${q.equipLines.some(l=>l.isZero) ? L('معدات — من العميل', 'Equipment — Provided') : L('تأجير معدات','Equipment Rental')}</span>
      <span class="sb-line-val" \${q.equipLines.some(l=>l.isZero) ? 'style="color:var(--green);font-size:11px;"' : ''}>\${q.equipLines.some(l=>l.isZero) ? '✓ ' + L('مجاناً','Included') : q.equipTotal + ' ' + (state.currency||"JOD")}</span>
    </div>\`;`;
html = html.replace(oldSbLineEq, newSbLineEq);

// 5. Replace q.discountPct>0 with q.discountAmt>0 globally
html = html.replace(/q\.discountPct>0/g, 'q.discountAmt>0');

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed equipment zero and discount bugs');
