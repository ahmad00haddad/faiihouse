const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Generalize reset function
const oldReset = /window\.resetTerms = function\(\) \{[\s\S]*?\}/;
const newReset = `window.resetCustom = function(key) {
  state[key] = null;
  saveState();
  showPreview();
}`;
html = html.replace(oldReset, newReset);

// 2. Fix DETAILS & TERMS reset function call
html = html.replace(/onclick="resetTerms\(\)"/g, 'onclick="resetCustom(\\\'customTerms\\\')"');

// 3. Replace q-footer
const oldFooter = /<div class="q-footer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>`;/g;

const newFooter = `<div class="q-footer" style="\${isOwnerMode ? 'align-items:flex-start;' : ''}">
      <div class="q-footer-left">
        <div class="ty" style="margin-bottom:10px;">Thank<br>You<span>.</span></div>
        \${isOwnerMode ? \`<button class="btn-sm btn-ghost" onclick="resetCustom('customContact')" style="font-size:9px; padding:2px 8px; min-height:0; display:\${state.customContact?'inline-flex':'none'}; margin-bottom:4px;">Reset Default</button>\` : ''}
        <div class="contact" 
             \${isOwnerMode ? 'contenteditable="true" spellcheck="false" onblur="state.customContact=this.innerHTML;saveState();"' : ''} 
             style="\${isOwnerMode ? 'outline:none; padding:8px; border:1px dashed var(--border); border-radius:6px; cursor:text;' : ''}">
          \${state.customContact ? state.customContact : \`Faii.House.jo@gmail.com<br>+962799256345<br>+962796016640\`}
        </div>
      </div>
      <div class="q-footer-right" style="\${isOwnerMode ? 'display:flex; flex-direction:column; align-items:flex-end;' : ''}">
        <div class="send" style="margin-bottom:10px;">SEND<br>PAYMENT</div>
        \${isOwnerMode ? \`<button class="btn-sm btn-ghost" onclick="resetCustom('customBank')" style="font-size:9px; padding:2px 8px; min-height:0; display:\${state.customBank?'inline-flex':'none'}; margin-bottom:4px;">Reset Default</button>\` : ''}
        <div class="cliq" 
             \${isOwnerMode ? 'contenteditable="true" spellcheck="false" onblur="state.customBank=this.innerHTML;saveState();"' : ''} 
             style="\${isOwnerMode ? 'outline:none; padding:8px; border:1px dashed var(--border); border-radius:6px; cursor:text; text-align:right;' : ''}">
          \${state.customBank ? state.customBank : \`CliQ: AHMAD00HAD<br>IBAN: JO47ARAB181000000018121212308500\`}
        </div>
      </div>
    </div>
  </div>\`;`;

html = html.replace(oldFooter, newFooter);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Footer editability injected');
