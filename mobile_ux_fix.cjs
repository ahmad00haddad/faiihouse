const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Fix Focus Dimming on Mobile
const oldDimming = `/* 2. Focus & Hover Dimming (Contextual Focus) */
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
}`;

const newDimming = `/* 2. Focus & Hover Dimming (Contextual Focus) */
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

html = html.replace(oldDimming, newDimming);

// 2. Fix Mobile Tooltips (Snackbar style)
const mobileTooltipCSS = `
@media (max-width: 992px) {
  .hint-tooltip {
    position: fixed !important;
    bottom: 100px !important;
    top: auto !important;
    left: 15px !important;
    right: 15px !important;
    width: auto !important;
    max-width: none !important;
    transform: translateY(30px) !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.8) !important;
    border-radius: 12px !important;
    font-size: 13px !important;
    padding: 16px !important;
    background: rgba(25, 25, 25, 0.98) !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(212,175,55,0.4) !important;
    z-index: 9999999 !important;
    color: #fff !important;
  }
  .role-info-td:hover .hint-tooltip,
  .role-info-td:active .hint-tooltip {
    transform: translateY(0) !important;
  }
  .hint-tooltip::after {
    display: none !important;
  }
}
`;

html = html.replace('</style>', mobileTooltipCSS + '\n</style>');

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Mobile UX fixed successfully.');
