const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const target1 = "let depWarn = '';";
const target2 = "rows += `<tr>";

const startIdx = html.indexOf(target1);
const endIdx = html.indexOf(target2, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newStr = `let depWarn = '';
    if(r.id === 'cam_assistant') {
      const showWarn = !state.crew['cinematographer'] || !state.crew['cinematographer'].enabled;
      depWarn = \`<span id="warn-cam_assistant" class="dep-warn" style="display:\${showWarn ? 'inline-flex' : 'none'};" title="\${L('نوصي باختيار مصور سينمائي أولاً ליقود عمل المساعد','DOP recommended first')}">⚠️</span>\`;
    }
    `;
    
  html = html.substring(0, startIdx) + newStr + html.substring(endIdx);
  fs.writeFileSync('public/quote-builder/index.html', html);
  console.log('REPLACED VIA INDEXOF');
} else {
  console.log('NOT FOUND');
}
