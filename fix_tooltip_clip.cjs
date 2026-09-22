const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// The line is: .type-card{background:var(--surface-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px 16px;text-align:center;cursor:pointer;transition:var(--t);position:relative;overflow:hidden;}

html = html.replace(/overflow:hidden;/g, (match, offset, fullString) => {
    // Only replace the one in .type-card
    const surroundingContext = fullString.substring(Math.max(0, offset - 50), offset);
    if (surroundingContext.includes('.type-card') || surroundingContext.includes('position:relative')) {
        return '';
    }
    return match;
});

// A safer approach:
const cssSearch = `.type-card{background:var(--surface-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px 16px;text-align:center;cursor:pointer;transition:var(--t);position:relative;overflow:hidden;}`;
const cssReplace = `.type-card{background:var(--surface-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px 16px;text-align:center;cursor:pointer;transition:var(--t);position:relative;}`;

if (html.includes(cssSearch)) {
    html = html.replace(cssSearch, cssReplace);
}

// In case the spacing was different
html = html.replace(/\.type-card\s*\{([^}]*)overflow:\s*hidden;([^}]*)\}/g, '.type-card {$1$2}');


fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Removed overflow hidden from type card');
