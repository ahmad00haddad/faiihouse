const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

html = html.replace(/function togglePost\(id, checked\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='post-'+id; updateQuote();");
});

// Also fix post paid line which was wrong in previous script
const oldPostPaid = `html+=\`<div class="sb-line"><span class="sb-line-label">\${L(l.nameAr,l.name)}</span><span class="sb-line-val">\${l.price} \${state.currency||"JOD"}</span></div>\`;`;
const newPostPaid = `html+=\`<div class="sb-line \${window.activePulseId==='post-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">\${L(l.nameAr,l.name)}</span><span class="sb-line-val">\${l.price} \${state.currency||"JOD"}</span></div>\`;`;
html = html.replace(oldPostPaid, newPostPaid);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed togglePost');
