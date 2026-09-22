const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const styleTagEnd = '</style>';
const focusAndPulseCSS = `
/* 1. Sidebar Pulse Micro-interaction */
@keyframes highlightPulse {
  0% { background: rgba(212,175,55,0.3); transform: scale(1.02); color: var(--gold); }
  100% { background: transparent; transform: scale(1); }
}
.pulse-update {
  animation: highlightPulse 1.5s ease-out forwards !important;
  border-radius: 4px;
  padding: 2px 6px !important;
  margin: -2px -6px !important;
}

/* 2. Focus & Hover Dimming (Contextual Focus) */
/* Project Type Cards - Hover dimming */
.pt-grid:hover .pt-card:not(:hover) {
  opacity: 0.4;
  filter: grayscale(40%);
  transform: scale(0.98);
}
.pt-card {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Crew Table - Focus/Hover dimming */
.crew-table tbody:hover tr:not(:hover),
.crew-table tbody:focus-within tr:not(:focus-within) {
  opacity: 0.35;
}
.crew-table tbody tr {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Post Production Cards - Focus/Hover dimming */
.post-grid:hover .post-option:not(:hover),
.post-grid:focus-within .post-option:not(:focus-within) {
  opacity: 0.4;
  filter: grayscale(30%);
  transform: scale(0.98);
}
.post-option {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Equipment Tiers - Hover/Focus dimming */
#equipGrid:hover .equip-card:not(:hover) {
  opacity: 0.4;
  filter: grayscale(30%);
  transform: scale(0.98);
}
.equip-card {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
`;
html = html.replace(styleTagEnd, focusAndPulseCSS + '\n' + styleTagEnd);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Added CSS for Focus Dimming and Pulse.');
