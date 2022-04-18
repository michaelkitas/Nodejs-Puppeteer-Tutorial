const fs = require("fs");
const puppeteer = require("puppeteer");

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();
  await page.goto(
    "https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071%2Cp_36%3A1253503011&dc&fs=true&qid=1635596580&rnid=16225007011&ref=sr_pg_1"
  );

  let isBtnDisabled = false;
  while (!isBtnDisabled) {
    await page.waitForSelector('[data-cel-widget="search_result_0"]');
    const productsHandles = await page.$$(
      "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
    );

    for (const producthandle of productsHandles) {
      let title = "Null";
      let price = "Null";
      let img = "Null";

      try {
        title = await page.evaluate(
          (el) => el.querySelector("h2 > a > span").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) => el.querySelector(".a-price > .a-offscreen").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        img = await page.evaluate(
          (el) => el.querySelector(".s-image").getAttribute("src"),
          producthandle
        );
      } catch (error) {}
      if (title !== "Null") {
        fs.appendFile(
          "results.csv",
          `${title.replace(/,/g, ".")},${price},${img}\n`,
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    await page.waitForSelector("li.a-last", { visible: true });
    const is_disabled = (await page.$("li.a-disabled.a-last")) !== null;

    isBtnDisabled = is_disabled;
    if (!is_disabled) {
      await Promise.all([
        page.click("li.a-last"),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
    }
  }

  await browser.close();
})();
