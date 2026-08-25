const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// The problematic syntax looks like: '... ${state.currency||'JOD'} ...'
// It breaks because of the inner single quotes.
// We can just replace `${state.currency||'JOD'}` with `${state.currency||"JOD"}` 
// and change the surrounding single quotes to backticks.
// But an easier way is to just replace all instances of `${state.currency||'JOD'}` 
// with `${state.currency||"JOD"}` globally, AND if they are inside single quotes, 
// they need to be converted to backticks, OR we just do string concatenation.

// Actually, let's just globally replace `${state.currency||'JOD'}` with `${state.currency||"JOD"}`.
html = html.replace(/\$\{state\.currency\|\|'JOD'\}/g, '${state.currency||"JOD"}');

// Then, find any line that has single quotes containing `${...}` and convert them to backticks.
// E.g. '100-250 ${state.currency||"JOD"}' -> `100-250 ${state.currency||"JOD"}`
html = html.replace(/'([^'\n]*\$\{state\.currency\|\|"JOD"\}[^'\n]*)'/g, '`$1`');

fs.writeFileSync('public/quote-builder/index.html', html);
console.log("Syntax fixed");
