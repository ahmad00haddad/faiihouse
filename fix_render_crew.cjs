const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldCrewName = `<div class="role-name">\${r.name}</div>`;
const newCrewName = `<div class="role-name" style="display:flex; align-items:center;">
          \${r.name}
          \${r.hint ? \`<span class="hint-icon">?<span class="hint-tooltip">\${L(r.hintAr, r.hint)}</span></span>\` : ''}
        </div>`;
html = html.replace(oldCrewName, newCrewName);

const oldCrewNameAr = `<div class="role-name-ar">\${r.ar}</div>`;
const newCrewNameAr = `<div class="role-name-ar" style="display:flex; align-items:center;">
          \${r.ar}
          \${r.hintAr ? \`<span class="hint-icon">?<span class="hint-tooltip">\${L(r.hintAr, r.hint)}</span></span>\` : ''}
        </div>`;
html = html.replace(oldCrewNameAr, newCrewNameAr);


fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed renderCrewTable replacement.');
