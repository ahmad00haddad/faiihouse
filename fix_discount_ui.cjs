const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldDiscountUI = `<div class="form-group" style="margin-top:10px;">
      <label style="font-size:10px;">Discount Override</label>
      <div style="display:flex; gap:5px;">
        <select id="ownerDiscountMode" onchange="state.discountMode = this.value; document.getElementById('ownerDiscountVal').style.display = (this.value==='custom_pct'||this.value==='custom_amt') ? 'block' : 'none'; saveState(); updateQuote();" class="select-css" style="padding:6px; font-size:12px; height:auto; flex:1;">
          <option value="auto">Auto (Volume)</option>
          <option value="none">None (0)</option>
          <option value="custom_pct">Custom %</option>
          <option value="custom_amt">Custom Amount</option>
        </select>
        <input type="number" id="ownerDiscountVal" placeholder="Val" onchange="state.discountVal = Number(this.value); saveState(); updateQuote();" onkeyup="if(event.key==='Enter')this.blur()" style="display:none; width:60px; font-size:12px; padding:6px; background:var(--dark3); border:1px solid var(--border); color:var(--text); text-align:center;">
      </div>
    </div>`;

const newDiscountUI = `<div class="form-group" style="margin-top:14px; background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.15); padding:10px; border-radius:6px;">
      <label style="font-size:10px; color:var(--gold); display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span>DISCOUNT SYSTEM</span>
        <span style="font-size:12px;">🏷️</span>
      </label>
      
      <select id="ownerDiscountMode" onchange="state.discountMode = this.value; document.getElementById('ownerDiscountVal').style.display = (this.value==='custom_pct'||this.value==='custom_amt') ? 'block' : 'none'; document.getElementById('discountInputLabel').style.display = (this.value==='custom_pct'||this.value==='custom_amt') ? 'block' : 'none'; document.getElementById('discountInputLabel').textContent = this.value==='custom_pct' ? 'Enter Percentage (%)' : 'Enter Amount'; saveState(); updateQuote();" class="select-css" style="padding:8px 10px; font-size:12px; margin-bottom:8px;">
        <option value="auto">Auto Tiered (Volume)</option>
        <option value="none">No Discount (0)</option>
        <option value="custom_pct">Custom Percentage (%)</option>
        <option value="custom_amt">Custom Amount (Fixed)</option>
      </select>
      
      <label id="discountInputLabel" style="font-size:10px; color:var(--text3); display:none; margin-bottom:4px;"></label>
      <input type="number" id="ownerDiscountVal" placeholder="0" oninput="state.discountVal = Number(this.value); saveState(); updateQuote();" style="display:none; width:100%; font-size:14px; padding:8px 10px; background:var(--dark4); border:1px solid var(--border); color:var(--foreground); border-radius:4px; text-align:center;">
    </div>`;

html = html.replace(oldDiscountUI, newDiscountUI);
fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed discount UI');
