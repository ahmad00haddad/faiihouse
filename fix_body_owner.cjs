const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldFn = `function applyOwnerMode(active) {
  isOwnerMode = active;
  const crewSection = document.querySelector('#sec-3');
  if(crewSection) {
    if(active) crewSection.classList.add('owner-mode');
    else crewSection.classList.remove('owner-mode');
  }
  const badge = document.getElementById('ownerBadge');`;

const newFn = `function applyOwnerMode(active) {
  isOwnerMode = active;
  if(active) document.body.classList.add('owner-mode');
  else document.body.classList.remove('owner-mode');
  
  const crewSection = document.querySelector('#sec-3');
  if(crewSection) {
    if(active) crewSection.classList.add('owner-mode');
    else crewSection.classList.remove('owner-mode');
  }
  const badge = document.getElementById('ownerBadge');`;

html = html.replace(oldFn, newFn);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed applyOwnerMode to apply class to body');
