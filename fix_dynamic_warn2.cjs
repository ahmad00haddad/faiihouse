const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const regex = /let depWarn = '';\s*if\(r\.id === 'cam_assistant'[^}]+\}\s*rows \+= `<tr>`;/;

const newStr = `let depWarn = '';
    if(r.id === 'cam_assistant') {
      const showWarn = !state.crew['cinematographer'] || !state.crew['cinematographer'].enabled;
      depWarn = \`<span id="warn-cam_assistant" class="dep-warn" style="display:\${showWarn ? 'inline-flex' : 'none'};" title="\${L('نوصي باختيار مصور سينمائي أولاً ليقود عمل المساعد','DOP recommended first')}">⚠️</span>\`;
    }
    rows += \`<tr>\`;`;

html = html.replace(regex, newStr);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed dynamic warning in render');
