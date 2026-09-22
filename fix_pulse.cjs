const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const ghostCss = `
@keyframes ghost-pulse {
  0% { opacity: 0.8; }
  100% { opacity: 1; }
}
`;
html = html.replace('</style>', ghostCss + '\n</style>');

html = html.replace(/pulse-warn 2s infinite alternate/g, (match, offset) => {
    // only replace the ones I injected
    if (offset > 2000) return 'ghost-pulse 2s infinite alternate';
    return match;
});

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed pulse animation');
