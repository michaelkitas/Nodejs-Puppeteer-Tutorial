const puppeteer = require("puppeteer");
const fs = require("fs").promises;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  //load cookies
  const cookiesString = await fs.readFile("./cookies.json");
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  await page.goto("http://example.com");

  //await browser.close();
})();
