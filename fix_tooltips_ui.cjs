const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Revert and fix the <td> structure in renderCrewTable
const uglyDivsRegex = /<td>\s*<div class="role-name" style="display:flex; align-items:center;">[\s\S]*?<\/div>\s*<\/td>/;

// Let's just find the exact block and replace it.
const searchBlock = `      <td>
        <div class="role-name" style="display:flex; align-items:center;">
          \${r.name}
          \${r.hint ? \`<span class="hint-icon">?<span class="hint-tooltip">\${L(r.hintAr, r.hint)}</span></span>\` : ''}
        </div>
        <div class="role-name-ar" style="display:flex; align-items:center;">
          \${r.ar}
          \${r.hintAr ? \`<span class="hint-icon">?<span class="hint-tooltip">\${L(r.hintAr, r.hint)}</span></span>\` : ''}
        </div>
      </td>`;

const newBlock = `      <td class="role-info-td" style="position:relative; cursor:help;">
        <div class="role-name">\${r.name}</div>
        <div class="role-name-ar">\${r.ar}</div>
        \${r.hint ? \`<div class="hint-tooltip" style="bottom: 80%; right: 20%; transform: translateY(5px); z-index: 1000;">\${L(r.hintAr, r.hint)}</div>\` : ''}
      </td>`;

html = html.replace(searchBlock, newBlock);

// 2. Update CSS to trigger tooltip on .role-info-td hover
const oldCSS = `.hint-icon:hover .hint-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(50%) translateY(0);
}`;
const newCSS = `.role-info-td:hover .hint-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) !important;
}`;
html = html.replace(oldCSS, newCSS);

// Also remove .hint-icon css completely to clean up, or just leave it. I will leave it in case we use it elsewhere, but remove its hover trigger.
// Actually let's just make the .hint-tooltip triangle point down correctly.
const oldTriangle = `.hint-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translateX(50%);
  border-width: 5px;
  border-style: solid;
  border-color: var(--surface-elevated) transparent transparent transparent;
}`;
const newTriangle = `.hint-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 15px; /* position it near the start of the text */
  border-width: 5px;
  border-style: solid;
  border-color: var(--surface-elevated) transparent transparent transparent;
}`;
html = html.replace(oldTriangle, newTriangle);


fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed tooltips UI.');
