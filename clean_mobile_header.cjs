const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// Replace the old crowded header CSS with an elegant minimalist version
const oldCss = `.header{padding:12px 16px;}
  .header-right .btn-sm:not(.lang-btn):not(:last-child){display:none;}`;

const newCss = `.header { padding: 12px 16px; justify-content: space-between; }
  .header-right { gap: 6px; }
  /* Hide unnecessary buttons in the header on mobile to keep it elegant and clean */
  .header-right #btnGenerate, 
  .header-right #btnReset, 
  .header-right #btnTourHelp { display: none !important; }
  
  /* Convert Home button to an elegant icon */
  .header-right a[href="/"] .ar-only, 
  .header-right a[href="/"] .en-only { display: none !important; }
  .header-right a[href="/"]::after { content: "🏠"; font-size: 16px; }
  .header-right a[href="/"] { padding: 6px 12px; min-height: 0; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: 9999px; }
  
  /* Adjust the logo size slightly to fit perfectly */
  .logo-text .sub { font-size: 8px !important; letter-spacing: 1.5px; }
  .logo-icon img { height: 20px !important; }
`;

html = html.replace(oldCss, newCss);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Mobile header CSS replaced');
