const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const resetTermsFn = `
window.resetTerms = function() {
  state.customTerms = null;
  saveState();
  showPreview();
}

function showPreview() {`;

html = html.replace(/function showPreview\(\) \{/g, resetTermsFn);

const oldDetails = /<div class="q-details">[\s\S]*?<\/div>\s*<\/div>\s*<div class="q-footer">/;

const newDetails = `
      <div class="q-details-wrap" style="position:relative; margin-bottom:20px;">
        <div style="font-size:10px;font-weight:700;color:var(--text3);letter-spacing:2px;margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
          <span>DETAILS & TERMS</span>
          \${isOwnerMode ? \`<button class="btn-sm btn-ghost" onclick="resetTerms()" style="font-size:9px; padding:2px 8px; min-height:0; display:\${state.customTerms?'inline-flex':'none'};">Reset Default</button>\` : ''}
        </div>
        <div class="q-details" 
             \${isOwnerMode ? 'contenteditable="true" spellcheck="false" onblur="state.customTerms=this.innerHTML;saveState();"' : ''} 
             style="\${isOwnerMode ? 'outline:none; padding:12px; border:1px dashed var(--border); border-radius:8px; cursor:text; margin-bottom:0;' : 'margin-bottom:0;'}">
          \${state.customTerms ? state.customTerms : \`— Video delivery: \${delivLabel}.<br>
— This offer is valid until: <strong style="color:var(--text)">\${expiryDate}</strong> (30 days from issue date).<br>
— Client has the right to request changes · \${state.deliveryDays==='rush'?'1 revision':'2 revisions'} included.<br>
— Down payment of 50% upon signing the contract.<br>
— Final payment of 50% upon delivery of the final version.<br>
— Equipment rental and transportation fees are included in the total.<br>
— The above price is final and tax-exempt.<br>
\${state.projectNotes?'— '+state.projectNotes+'<br>':''}
— Any additional taxes imposed by relevant authorities are the responsibility of the client.\`}
        </div>
        \${isOwnerMode ? '<div style="font-size:9px; color:var(--primary); margin-top:6px; text-align:right;">✦ You can click and edit the text above. It will be saved automatically.</div>' : ''}
      </div>
    </div>
    <div class="q-footer">`;

html = html.replace(oldDetails, newDetails);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Custom terms logic injected successfully');
