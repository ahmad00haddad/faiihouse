const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldRowStart = `const total = s.enabled ? (s.rate*s.qty*state.days) : 0;
    let depWarn = '';
    if(r.id === 'cam_assistant' && (!state.crew['cinematographer'] || !state.crew['cinematographer'].enabled)) {
      depWarn = \`<span class="dep-warn" title="\${L('نوصي باختيار مصور سينمائي أولاً','DOP recommended first')}">⚠️</span>\`;
    }
    rows += \`<tr>\`;`;

const newRowStart = `const total = s.enabled ? (s.rate*s.qty*state.days) : 0;
    let depWarn = '';
    if(r.id === 'cam_assistant') {
      const showWarn = !state.crew['cinematographer'] || !state.crew['cinematographer'].enabled;
      depWarn = \`<span id="warn-cam_assistant" class="dep-warn" style="display:\${showWarn ? 'inline-flex' : 'none'};" title="\${L('نوصي باختيار مصور سينمائي أولاً ليقود عمل المساعد','DOP recommended first')}">⚠️</span>\`;
    }
    rows += \`<tr>\`;`;

html = html.replace(oldRowStart, newRowStart);

// Inject logic into updateQuote() to toggle the warning dynamically
const updateQuoteInject = `  const warnCamAss = document.getElementById('warn-cam_assistant');
  if(warnCamAss) {
    const dopEnabled = state.crew['cinematographer'] && state.crew['cinematographer'].enabled;
    warnCamAss.style.display = dopEnabled ? 'none' : 'inline-flex';
  }
`;

html = html.replace('function updateQuote() {', 'function updateQuote() {\n' + updateQuoteInject);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed dynamic dependency warning for cam_assistant');
