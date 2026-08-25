const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Owner Panel HTML
const ownerPanelHtml = `
  <div class="owner-settings" style="display:none; padding:15px; background:var(--surface-elevated); border-bottom:1px solid var(--border);">
    <div style="font-size:11px;font-weight:700;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">OWNER SETTINGS</div>
    <div class="form-group" style="margin-bottom:10px;">
      <label style="font-size:10px;">Currency</label>
      <select id="ownerCurrency" onchange="state.currency = this.value; saveState(); location.reload();" class="select-css" style="padding:6px; font-size:12px; height:auto;">
        <option value="JOD">JOD - Jordanian Dinar</option>
        <option value="USD">USD - US Dollar</option>
        <option value="SAR">SAR - Saudi Riyal</option>
        <option value="AED">AED - UAE Dirham</option>
      </select>
    </div>
    <div class="form-group">
      <label style="font-size:10px;">Payment Terms</label>
      <select id="ownerPayment" onchange="state.paymentTerms = this.value; saveState();" class="select-css" style="padding:6px; font-size:12px; height:auto;">
        <option value="50_50">50% on signature · 50% on delivery</option>
        <option value="30_40_30">30% sig. / 40% prod. / 30% deliv.</option>
        <option value="net_30">Net 30 on delivery</option>
      </select>
    </div>
  </div>
`;
html = html.replace('<div class="sb-header">', ownerPanelHtml + '\n  <div class="sb-header">');
html = html.replace('</style>', '.owner-mode .owner-settings { display:block !important; }\n</style>');

// 2. State defaults
html = html.replace(
  "let state = {",
  "let state = {\n  currency: 'JOD',\n  paymentTerms: '50_50',"
);

// 3. Inject load script to set selectors and handle DOM JD replacement for raw HTML
const jsToInject = `
<script>
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if(typeof state !== 'undefined') {
      if(!state.currency) state.currency = 'JOD';
      if(!state.paymentTerms) state.paymentTerms = '50_50';
      const cSel = document.getElementById('ownerCurrency');
      const pSel = document.getElementById('ownerPayment');
      if(cSel) cSel.value = state.currency;
      if(pSel) pSel.value = state.paymentTerms;
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
</script>
`;
html = html.replace('</body>', jsToInject + '</body>');

// 4. Update showPreview string generation to replace JD
html = html.replace(
  "const delivLabel = state.deliveryDays==='rush'?'3 days or less (Rush Delivery)':`${state.deliveryDays} working days after shooting`;",
  `const delivLabel = state.deliveryDays==='rush'?'3 days or less (Rush Delivery)':\\\`\${state.deliveryDays} working days after shooting\\\`;
  const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const dateStr = today.replace(/-/g, '').substring(2);
  const refNumber = \\\`FH-\${dateStr}-\${randCode}\\\`;
  
  let paymentText = '— Down payment of 50% upon signing the contract.<br>— Final payment of 50% upon delivery of the final version.<br>';
  if(state.paymentTerms === '30_40_30') {
    paymentText = '— Down payment of 30% upon signing, 40% before production, 30% upon final delivery.<br>';
  } else if(state.paymentTerms === 'net_30') {
    paymentText = '— Payment is due Net 30 days after final delivery.<br>';
  }`
);

// Replace hardcoded terms in showPreview
html = html.replace(
  "— Down payment of 50% upon signing the contract.<br>\n        — Final payment of 50% upon delivery of the final version.<br>",
  "${paymentText}"
);

// Add Ref Number
html = html.replace(
  "<p><strong>Date:</strong> ${today}</p>",
  "<p><strong>REF:</strong> ${refNumber}</p>\n          <p><strong>Date:</strong> ${today}</p>"
);

// Replace ' JD' globally with ' ' + (state.currency||'JOD') for JS strings
html = html.replace(/' JD'/g, "' ' + (state.currency||'JOD')");
html = html.replace(/' JD\\+'/g, "' ' + (state.currency||'JOD') + '+'");

// We must also fix the template strings where it's hardcoded as `JD` (like \`${q.total} JD\`)
// A safer way is to just do a regex replace on backtick literals that have JD in them!
html = html.replace(/([0-9\$\{\}\.\w]+)\sJD/g, "$1 ${state.currency||'JOD'}");
// E.g. ${q.total} JD -> ${q.total} ${state.currency||'JOD'}
// E.g. 50–100 JD -> 50–100 ${state.currency||'JOD'}

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Script applied!');
