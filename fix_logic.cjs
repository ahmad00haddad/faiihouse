const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Add flatRate property to project-based roles
html = html.replace("{id:'voiceover_talent',name:'Voice Over Artist',      ar:'مؤدي صوتي',          rate:75,", 
                    "{id:'voiceover_talent',name:'Voice Over Artist',      ar:'مؤدي صوتي',          rate:75, flatRate:true,");

html = html.replace("{id:'preprod',        name:'Pre-Production',          ar:'ما قبل الإنتاج',      rate:100,", 
                    "{id:'preprod',        name:'Pre-Production',          ar:'ما قبل الإنتاج',      rate:100, flatRate:true,");

html = html.replace("{id:'location_scout', name:'Location Scouting',       ar:'اختيار موقع',        rate:150,", 
                    "{id:'location_scout', name:'Location Scouting',       ar:'اختيار موقع',        rate:150, flatRate:true,");

html = html.replace("{id:'casting',        name:'Casting',                 ar:'اختيار ممثلين',      rate:200,", 
                    "{id:'casting',        name:'Casting',                 ar:'اختيار ممثلين',      rate:200, flatRate:true,");

// 2. Fix renderCrewTable math
const renderOldMath = `const total = s.enabled ? (s.rate*s.qty*state.days) : 0;`;
const renderNewMath = `const daysMult = r.flatRate ? 1 : state.days;
    const total = s.enabled ? (s.rate * s.qty * daysMult) : 0;`;
html = html.replace(renderOldMath, renderNewMath);

// Also need to fix the UI total display updating real-time:
const updateRowTotalOld = `const days = state.days || 1;
  const total = s.rate * s.qty * days;`;
const updateRowTotalNew = `const r = ROLES.find(role=>role.id===id);
  const daysMult = (r && r.flatRate) ? 1 : (state.days || 1);
  const total = s.rate * s.qty * daysMult;`;
html = html.replace(updateRowTotalOld, updateRowTotalNew);

// 3. Fix calcQuote math
const calcQuoteOld = `const total = s.rate * s.qty * state.days;`;
const calcQuoteNew = `const daysMult = r.flatRate ? 1 : state.days;
    const total = s.rate * s.qty * daysMult;`;
html = html.replace(calcQuoteOld, calcQuoteNew);

// Fix the array push for PDF/Invoice to show "Project" instead of days for flat rates
const calcPushOld = `crewLines.push({name:r.name, nameAr:r.ar, rate:s.rate, qty:s.qty, days:state.days, total});`;
const calcPushNew = `crewLines.push({name:r.name, nameAr:r.ar, rate:s.rate, qty:s.qty, days: r.flatRate ? 'مقطوع' : state.days, total});`;
html = html.replace(calcPushOld, calcPushNew);

// Fix setQty ghost string
const oldSetQty = `if(e && d > 0) spawnCostGhost(e, '+' + (s.rate * (state.days||1)) + ' ' + (state.currency||'JOD'));
  if(e && d < 0 && s.qty > 1) spawnCostGhost(e, '-' + (s.rate * (state.days||1)) + ' ' + (state.currency||'JOD'));`;
const newSetQty = `const roleDef = ROLES.find(role=>role.id===id);
  const daysMult = (roleDef && roleDef.flatRate) ? 1 : (state.days||1);
  if(e && d > 0) spawnCostGhost(e, '+' + (s.rate * daysMult) + ' ' + (state.currency||'JOD'));
  if(e && d < 0 && s.qty > 1) spawnCostGhost(e, '-' + (s.rate * daysMult) + ' ' + (state.currency||'JOD'));`;
html = html.replace(oldSetQty, newSetQty);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed Days Multiplier Logic Error');
