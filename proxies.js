const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch({
      headless: false,
 
    args: [ '--proxy-server=http://194.5.193.183:80' ]
  });
  const page = await browser.newPage();
  await page.goto('https://whatismyipaddress.com/');
  await browser.close();
})();