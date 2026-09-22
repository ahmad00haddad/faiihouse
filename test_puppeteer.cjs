const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('file://' + __dirname + '/public/quote-builder/index.html', {waitUntil: 'networkidle0'});
  
  const crewBody = await page.evaluate(() => document.getElementById('crewBody').innerHTML);
  console.log('Crew Body length:', crewBody.length);
  
  await browser.close();
})();
