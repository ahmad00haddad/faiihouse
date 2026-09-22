const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Update the CSS for the tooltip
const oldHoverRule = `.type-card:hover .type-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}`;
const newHoverRule = `.type-wrapper:hover .type-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}
.type-wrapper {
  position: relative;
}`;
html = html.replace(oldHoverRule, newHoverRule);


// 2. Update renderTypeGrid
const oldRender = `  grid.innerHTML = PROJECT_TYPES.map(t=>\`
    <div class="type-card grain-card \${state.projectType===t.id?'sel':''}" onclick="selectType('\${t.id}')">
      <span class="type-icon">\${t.icon}</span>
      <div class="type-name">\${L(t.ar, t.name)}</div>
      <div class="type-tooltip">\${L(t.descAr, t.desc)}</div>
    </div>\`).join('');`;
    
const newRender = `  grid.innerHTML = PROJECT_TYPES.map(t=>\`
    <div class="type-wrapper">
      <div class="type-card grain-card \${state.projectType===t.id?'sel':''}" onclick="selectType('\${t.id}')">
        <span class="type-icon">\${t.icon}</span>
        <div class="type-name">\${L(t.ar, t.name)}</div>
      </div>
      <div class="type-tooltip">\${L(t.descAr, t.desc)}</div>
    </div>\`).join('');`;

// Since the array might be filtered if reels is removed, let's use Regex for the render replace
const renderRegex = /<div class="type-card grain-card \$\{state\.projectType===t\.id\?'sel':''\}" onclick="selectType\('\$\{t\.id\}'\)">[\s\S]*?<span class="type-icon">\$\{t\.icon\}<\/span>[\s\S]*?<div class="type-name">\$\{L\(t\.ar, t\.name\)\}<\/div>[\s\S]*?<div class="type-tooltip">\$\{L\(t\.descAr, t\.desc\)\}<\/div>[\s\S]*?<\/div>/;

const replacement = `<div class="type-wrapper">
      <div class="type-card grain-card \${state.projectType===t.id?'sel':''}" onclick="selectType('\${t.id}')">
        <span class="type-icon">\${t.icon}</span>
        <div class="type-name">\${L(t.ar, t.name)}</div>
      </div>
      <div class="type-tooltip">\${L(t.descAr, t.desc)}</div>
    </div>`;

html = html.replace(renderRegex, replacement);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed tooltip clipping issue');
