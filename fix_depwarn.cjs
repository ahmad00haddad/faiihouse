const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// The replacement that failed previously:
const searchString = "const total = s.enabled ? (s.rate*s.qty*state.days) : 0;\n    rows += `<tr>";

const replacementString = `const total = s.enabled ? (s.rate*s.qty*state.days) : 0;
    let depWarn = '';
    if(r.id === 'cam_assistant' && (!state.crew['cinematographer'] || !state.crew['cinematographer'].enabled)) {
      depWarn = \`<span class="dep-warn" title="\${L('نوصي باختيار مصور سينمائي أولاً','DOP recommended first')}">⚠️</span>\`;
    }
    rows += \`<tr>`;

html = html.replace(searchString, replacementString);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed ReferenceError for depWarn');
