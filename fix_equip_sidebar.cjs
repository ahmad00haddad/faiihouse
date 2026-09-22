const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const targetStr = `html+=\`<div class="sb-line \${window.activePulseId==='equip' ? 'pulse-update' : ''}"><span class="sb-line-label">\${L('إيجار معدات','Equipment Rental')}</span><span class="sb-line-val">\${q.equipTotal} \${state.currency||"JOD"}</span></div>\`;`;

const newStr = `html+=\`<div class="sb-line \${window.activePulseId==='equip' ? 'pulse-update' : ''}"><span class="sb-line-label">\${q.equipLines.some(l=>l.isZero) ? L('معدات — من العميل', 'Equipment — Provided') : L('إيجار معدات','Equipment Rental')}</span><span class="sb-line-val" \${q.equipLines.some(l=>l.isZero) ? 'style="color:var(--green);font-size:11px;"' : ''}>\${q.equipLines.some(l=>l.isZero) ? '✓ ' + L('مجاناً','Included') : q.equipTotal + ' ' + (state.currency||"JOD")}</span></div>\`;`;

html = html.replace(targetStr, newStr);
fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed equipment sidebar rendering text.');
