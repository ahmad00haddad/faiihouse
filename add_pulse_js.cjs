const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Add activePulseId logic to interaction functions

// toggleRole(id, checked)
html = html.replace(/function toggleRole\(id, checked\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='crew-'+id; updateQuote();");
});
// setRate(id, val)
html = html.replace(/function setRate\(id, val\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='crew-'+id; updateQuote();");
});
// setQty(id, d)
html = html.replace(/function setQty\(id, d\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='crew-'+id; updateQuote();");
});
// togglePost(id)
html = html.replace(/function togglePost\(id\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='post-'+id; updateQuote();");
});
// setPostRate(id, val)
html = html.replace(/function setPostRate\(id, val\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='post-'+id; updateQuote();");
});
// setPostQty(id, d)
html = html.replace(/function setPostQty\(id, d\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='post-'+id; updateQuote();");
});
// selectTier(id)
html = html.replace(/function selectTier\(id\) \{[\s\S]*?updateQuote\(\);/, (match) => {
  return match.replace('updateQuote();', "window.activePulseId='equip'; updateQuote();");
});


// 2. Modify sb-line classes in updateQuote()
// Crew
const oldCrewFree = `html+=\`<div class="sb-line"><span class="sb-line-label">\${L(l.nameAr,l.name)}\${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val" style="color:var(--green);font-family:'Inter',sans-serif;font-size:11px;">✓ \${L('مشمول','Incl.')}</span></div>\`;`;
const newCrewFree = `html+=\`<div class="sb-line \${window.activePulseId==='crew-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">\${L(l.nameAr,l.name)}\${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val" style="color:var(--green);font-family:'Inter',sans-serif;font-size:11px;">✓ \${L('مشمول','Incl.')}</span></div>\`;`;
html = html.replace(oldCrewFree, newCrewFree);

const oldCrewPaid = `html+=\`<div class="sb-line"><span class="sb-line-label">\${L(l.nameAr,l.name)}\${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val">\${l.total} \${state.currency||"JOD"}</span></div>\`;`;
const newCrewPaid = `html+=\`<div class="sb-line \${window.activePulseId==='crew-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">\${L(l.nameAr,l.name)}\${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val">\${l.total} \${state.currency||"JOD"}</span></div>\`;`;
html = html.replace(oldCrewPaid, newCrewPaid);

// Equipment
const oldEquipPaid = `html+=\`<div class="sb-line"><span class="sb-line-label">\${L('إيجار معدات','Equipment Rental')}</span><span class="sb-line-val">\${q.equipTotal} \${state.currency||"JOD"}</span></div>\`;`;
const newEquipPaid = `html+=\`<div class="sb-line \${window.activePulseId==='equip' ? 'pulse-update' : ''}"><span class="sb-line-label">\${L('إيجار معدات','Equipment Rental')}</span><span class="sb-line-val">\${q.equipTotal} \${state.currency||"JOD"}</span></div>\`;`;
html = html.replace(oldEquipPaid, newEquipPaid);

// Post
const oldPostFree = `html+=\`<div class="sb-line"><span class="sb-line-label">\${L(l.nameAr,l.name)}</span><span class="sb-line-val" style="color:var(--green);font-family:'Inter',sans-serif;font-size:11px;">✓ \${L('مشمول','Incl.')}</span></div>\`;`;
const newPostFree = `html+=\`<div class="sb-line \${window.activePulseId==='post-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">\${L(l.nameAr,l.name)}</span><span class="sb-line-val" style="color:var(--green);font-family:'Inter',sans-serif;font-size:11px;">✓ \${L('مشمول','Incl.')}</span></div>\`;`;
html = html.replace(oldPostFree, newPostFree);

const oldPostPaid = `html+=\`<div class="sb-line"><span class="sb-line-label">\${L(l.nameAr,l.name)}\${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val">\${l.price} \${state.currency||"JOD"}</span></div>\`;`;
const newPostPaid = `html+=\`<div class="sb-line \${window.activePulseId==='post-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">\${L(l.nameAr,l.name)}\${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val">\${l.price} \${state.currency||"JOD"}</span></div>\`;`;
html = html.replace(oldPostPaid, newPostPaid);

// Clear activePulseId at the end of updateQuote()
// We can just find the end of updateQuote by locating "document.getElementById('sidebarContent').innerHTML = html;"
const oldSidebarInject = `document.getElementById('sidebarContent').innerHTML = html;`;
const newSidebarInject = `document.getElementById('sidebarContent').innerHTML = html;
  
  // Clear pulse ID so it doesn't trigger on other unrelated updates
  window.activePulseId = null;`;
html = html.replace(oldSidebarInject, newSidebarInject);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Sidebar Pulse JavaScript integration complete.');
