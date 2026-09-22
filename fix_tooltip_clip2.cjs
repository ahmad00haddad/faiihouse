const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldWrapper = `<div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; margin-bottom:14px; padding-bottom:4px;">
      <table class="crew-table" id="crewTable" style="margin-bottom:0;">`;

const newWrapper = `<div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; margin-bottom:14px; padding-bottom:4px; padding-top: 150px; margin-top: -150px;">
      <table class="crew-table" id="crewTable" style="margin-bottom:0;">`;

html = html.replace(oldWrapper, newWrapper);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed tooltip clipping via CSS padding hack');
