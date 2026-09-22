const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const regex = /\.header-right #btnGenerate, \s*\.header-right #btnReset, \s*\.header-right #btnTourHelp \{ display: none !important; \}/;

const replaceWith = `.header-right #btnGenerate, 
  .header-right #btnTourHelp { display: none !important; }
  
  /* Convert Reset button to an elegant icon */
  .header-right #btnReset { font-size: 0 !important; letter-spacing: 0; }
  .header-right #btnReset::after { content: "🔄"; font-size: 16px; display:block; line-height:1; }
  .header-right #btnReset { padding: 8px 12px; min-height: 0; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: 9999px; }
`;

html = html.replace(regex, replaceWith);

// Update padding rules for consistency
const regex2 = /\.header-right a\[href="\/"] \{ padding: 8px 12px; min-height: 0; background: var\(--surface-elevated\); border: 1px solid var\(--border\); border-radius: 9999px; \}/;
const replaceWith2 = `.header-right a[href="/"] { padding: 8px 12px; min-height: 0; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: 9999px; }`;
html = html.replace(regex2, replaceWith2);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Reset button restored as icon');
