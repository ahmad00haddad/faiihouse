const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const targetBlock = `/* 2. Focus & Hover Dimming (Contextual Focus) */
.pt-card, .crew-table tbody tr, .post-option, .equip-card {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
@media (hover: hover) {
  .pt-grid:hover .pt-card:not(:hover) { opacity: 0.4; filter: grayscale(40%); transform: scale(0.98); }
  .crew-table tbody:hover tr:not(:hover) { opacity: 0.35; }
  .post-grid:hover .post-option:not(:hover) { opacity: 0.4; filter: grayscale(30%); transform: scale(0.98); }
  #equipGrid:hover .equip-card:not(:hover) { opacity: 0.4; filter: grayscale(30%); transform: scale(0.98); }
}
/* Focus-within (typing in inputs) works nicely everywhere including mobile */
.crew-table tbody:focus-within tr:not(:focus-within) { opacity: 0.35; }
.post-grid:focus-within .post-option:not(:focus-within) { opacity: 0.4; filter: grayscale(30%); transform: scale(0.98); }`;

const replacement = `/* 2. Base Transitions (Focus dimming removed per user request) */
.pt-card, .crew-table tbody tr, .post-option, .equip-card {
  transition: all 0.2s ease-out;
}`;

html = html.replace(targetBlock, replacement);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Removed Focus Dimming');
