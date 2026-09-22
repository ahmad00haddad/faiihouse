const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// --- 1. Modify Post-Production HTML to match Crew exactly ---
const oldPostHtml = /<div class="owner-only" onclick="event\.stopPropagation\(\)">[\s\S]*?<div class="post-price" style="min-width: 50px; text-align: end;">[\s\S]*?<\/div>/;

const newPostHtml = `<div class="post-price" style="min-width: 50px; text-align: end;">
          <span class="rate-display">\${sel.qty > 1 ? sel.qty + ' × ' : ''}\${sel.rate} \${state.currency||"JOD"}</span>
          <div class="rate-input-wrap" onclick="event.stopPropagation()">
            <input type="number" class="post-rate-input" value="\${sel.rate}" onchange="setPostRate('\${p.id}', this.value)" style="width:60px;">
          </div>
        </div>`;

html = html.replace(oldPostHtml, newPostHtml);

// Make sure .rate-input-wrap inside .post-price gets right alignment if needed, but it's handled by flex or float.

// --- 2. Add Discount Settings to Owner Settings Panel ---
const oldOwnerSettings = /<option value="net_30">Net 30 on delivery<\/option>\s*<\/select>\s*<\/div>/;
const newOwnerSettings = `<option value="net_30">Net 30 on delivery</option>
      </select>
    </div>
    <div class="form-group" style="margin-top:10px;">
      <label style="font-size:10px;">Discount Override</label>
      <div style="display:flex; gap:5px;">
        <select id="ownerDiscountMode" onchange="state.discountMode = this.value; document.getElementById('ownerDiscountVal').style.display = (this.value==='custom_pct'||this.value==='custom_amt') ? 'block' : 'none'; saveState(); updateQuote();" class="select-css" style="padding:6px; font-size:12px; height:auto; flex:1;">
          <option value="auto">Auto (Volume)</option>
          <option value="none">None (0)</option>
          <option value="custom_pct">Custom %</option>
          <option value="custom_amt">Custom Amount</option>
        </select>
        <input type="number" id="ownerDiscountVal" placeholder="Val" onchange="state.discountVal = Number(this.value); saveState(); updateQuote();" onkeyup="if(event.key==='Enter')this.blur()" style="display:none; width:60px; font-size:12px; padding:6px; background:var(--surface-elevated); border:1px solid var(--border); color:var(--text); border-radius:4px; text-align:center;">
      </div>
    </div>`;

html = html.replace(oldOwnerSettings, newOwnerSettings);

// --- 3. Modify calcQuote to respect state.discountMode ---
const oldDiscountCalc = /  if \(subtotal >= t3\) \{[\s\S]*?discountLabelAr = 'خصم تشجيعي −5%';\n  \}/;

const newDiscountCalc = `  if (state.discountMode === 'none') {
    discountPct = 0;
  } else if (state.discountMode === 'custom_pct') {
    discountPct = state.discountVal || 0;
    discountLabel = \`Special Discount −\${discountPct}%\`;
    discountLabelAr = \`خصم خاص −\${discountPct}%\`;
  } else if (state.discountMode === 'custom_amt') {
    // Custom amount will be handled below
    discountPct = 0;
  } else {
    // Auto Volume Discount
    if (subtotal >= t3) {
      discountPct = 10; 
      discountLabel = 'Premium Volume Discount −10%'; 
      discountLabelAr = 'خصم ذهبي (حجم عمل) −10%';
    } else if (subtotal >= t2) {
      discountPct = 7; 
      discountLabel = 'Volume Discount −7%'; 
      discountLabelAr = 'خصم فضي (حجم عمل) −7%';
    } else if (subtotal >= t1) {
      discountPct = 5; 
      discountLabel = 'Project Discount −5%'; 
      discountLabelAr = 'خصم تشجيعي −5%';
    }
  }`;

html = html.replace(oldDiscountCalc, newDiscountCalc);

// --- 4. Modify discountAmt calc ---
const oldDiscountAmtCalc = /  const discountAmt = Math\.round\(subtotal \* discountPct\/100\);/;
const newDiscountAmtCalc = `  let discountAmt = Math.round(subtotal * discountPct/100);
  if (state.discountMode === 'custom_amt') {
    discountAmt = state.discountVal || 0;
    discountLabel = 'Special Discount';
    discountLabelAr = 'خصم خاص';
  }`;

html = html.replace(oldDiscountAmtCalc, newDiscountAmtCalc);

// --- 5. Init fields in DOMContentLoaded ---
const oldInit = /if\(pSel\) pSel\.value = state\.paymentTerms;/;
const newInit = `if(pSel) pSel.value = state.paymentTerms;
      const dModeSel = document.getElementById('ownerDiscountMode');
      const dValInp = document.getElementById('ownerDiscountVal');
      if(dModeSel && state.discountMode) {
        dModeSel.value = state.discountMode;
        if(state.discountMode === 'custom_pct' || state.discountMode === 'custom_amt') {
          dValInp.style.display = 'block';
          dValInp.value = state.discountVal || '';
        }
      }`;

html = html.replace(oldInit, newInit);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Post-Production and Discount overrides injected!');
