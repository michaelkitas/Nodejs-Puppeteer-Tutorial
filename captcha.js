// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add recaptcha plugin and provide it your 2captcha token (= their apiKey)
// 2captcha is the builtin solution provider but others would work as well.
// Please note: You need to add funds to your 2captcha account for this to work
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "XXXXXXXXXX", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    },
    visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/recaptcha/api2/demo");

  // That's it, a single line of code to solve reCAPTCHAs 🎉
  // Loop over all potential frames on that page
  
  for (const frame of page.mainFrame().childFrames()) {
    // Attempt to solve any potential captchas in those frames
    const { captchas, filtered, solutions, solved, error } =
      await frame.solveRecaptchas();

    console.log(solved);
  }

  await Promise.all([
    page.waitForNavigation(),
    page.click(`#recaptcha-demo-submit`),
  ]);

  //await page.screenshot({ path: 'response.png', fullPage: true })

  //await browser.close()
});
