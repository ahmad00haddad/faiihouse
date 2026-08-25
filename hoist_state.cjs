const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// Find indices
const lines = html.split('\n');

const dataStartIdx = lines.findIndex(l => l.includes('// DATA'));
const stateStartIdx = lines.findIndex(l => l.includes('// STATE'));
const stateEndIdx = lines.findIndex(l => l.includes('let state = DEFAULT_STATE();')); // it's around 1067

if (dataStartIdx > -1 && stateStartIdx > -1 && stateEndIdx > -1 && stateStartIdx > dataStartIdx) {
  // Extract the state block
  // We want to grab from stateStartIdx to stateEndIdx
  const stateBlock = lines.slice(stateStartIdx, stateEndIdx + 1).join('\n') + '\nloadState();\n\n';
  
  // Remove it from the original place
  lines.splice(stateStartIdx, stateEndIdx - stateStartIdx + 1);
  
  // Insert it before DATA block
  // The line number of DATA block changed because we removed stuff below it? No, state is below data, so dataStartIdx is unaffected.
  lines.splice(dataStartIdx - 1, 0, stateBlock);
  
  fs.writeFileSync('public/quote-builder/index.html', lines.join('\n'));
  console.log('Successfully hoisted STATE block above DATA block.');
} else {
  console.log('Could not find the indices or STATE is already above DATA.');
  console.log({dataStartIdx, stateStartIdx, stateEndIdx});
}
