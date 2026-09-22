const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const regex = /@media\(max-width:500px\)\{[\s\S]*?\.header\{padding:12px 16px;\}\s*\.header-right \.btn-sm:not\(\.lang-btn\):not\(:last-child\)\{display:none;\}/;

const newCss = `@media(max-width:500px){
  .type-grid{grid-template-columns:1fr 1fr;}
  .equip-grid{grid-template-columns:1fr;}
  .equip-items-grid{grid-template-columns:1fr;}
  .region-grid{grid-template-columns:1fr 1fr;}
  .q-meta{grid-template-columns:1fr;}
  .header { padding: 12px 16px; justify-content: space-between; }
  .header-right { gap: 6px; }
  
  /* Hide unnecessary buttons in the header on mobile to keep it elegant and clean */
  .header-right #btnGenerate, 
  .header-right #btnReset, 
  .header-right #btnTourHelp { display: none !important; }
  
  /* Convert Home button to an elegant icon */
  .header-right a[href="/"] .ar-only, 
  .header-right a[href="/"] .en-only { display: none !important; }
  .header-right a[href="/"]::after { content: "🏠"; font-size: 16px; display:block; line-height:1; }
  .header-right a[href="/"] { padding: 8px 12px; min-height: 0; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: 9999px; }
  
  /* Adjust the logo size slightly to fit perfectly */
  .logo-text .sub { font-size: 7px !important; letter-spacing: 1.5px; margin-top: 1px; }
  .logo-icon img { height: 18px !important; }`;

html = html.replace(regex, newCss);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Mobile header CSS replaced properly');
