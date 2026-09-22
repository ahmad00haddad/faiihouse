const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Convert hover tooltip into a clean static hint
const oldRoleHover = `\${r.hint ? \`<div class="hint-tooltip" style="bottom: 80%; right: 0; transform: translateY(5px); z-index: 1000;">\${L(r.hintAr, r.hint)}</div>\` : ''}`;
const newRoleStatic = `\${r.hint ? \`<div class="role-hint" style="font-size:10px; color:var(--text3); margin-top:4px; line-height:1.4;">\${L(r.hintAr, r.hint)}</div>\` : ''}`;
html = html.replace(oldRoleHover, newRoleStatic);

// 2. Inject Equip Badges safely
const oldEquipGrid = `<div class="equip-tier">\${L(e.tierAr, e.tier)}</div>
      <div class="equip-name">\${L(e.nameAr, e.name)}</div>`;
const newEquipGrid = `<div class="equip-tier">\${L(e.tierAr, e.tier)}</div>
      \${e.badgeAr ? \`<div style="font-size:10px; color:var(--gold); font-weight:700; margin:4px 0 6px; padding:2px 8px; background:rgba(212,175,55,0.1); border-radius:4px; display:inline-block;">\${L(e.badgeAr, e.badge)}</div>\` : ''}
      <div class="equip-name">\${L(e.nameAr, e.name)}</div>`;
html = html.replace(oldEquipGrid, newEquipGrid);


fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed role hint and equip badges');
