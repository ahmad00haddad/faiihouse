const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const updateQuoteStart = `function updateQuote() {`;
const updateQuoteStartWithWarn = `function updateQuote() {
  // Update Equipment Pro Warning
  const warnEquipPro = document.getElementById('warn-equip-pro');
  if(warnEquipPro) {
    const isProEquip = state.equipment === 'pro' || state.equipment === 'red';
    const hasDOP = state.crew['cinematographer'] && state.crew['cinematographer'].enabled;
    warnEquipPro.style.display = (isProEquip && !hasDOP) ? 'block' : 'none';
  }`;

html = html.replace(updateQuoteStart, updateQuoteStartWithWarn);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Injected JS for Equip Warn');
