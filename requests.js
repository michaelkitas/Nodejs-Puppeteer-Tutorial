const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true); //Make sure you use latest version of Puppeteer

  //Mock Requests
  page.on("request", (request) => {
    if (request.resourceType() === "image") {
      request.respond({
        status: 200,
        contentType: "image/jpeg",
        body: fs.readFileSync("./image.jpg"),
      });
    } else {
      request.continue();
    }
  });

  //Block Requests
  //   page.on("request", (request) => {
  //     if (request.resourceType() === "image") {
  //       request.abort();
  //     } else {
  //       request.continue();
  //     }
  //   });

  //Capture Response
  page.on("response", async (response) => {
    const url = response.url();

    if (url.includes("https://www.google.com/log?format=json")) {
      console.log(`URL: ${url}`);
      console.log(`Headers: ${JSON.stringify(response.headers())}`);
      console.log(`Response: ${await response.json()}`);
    }
  });

  await page.goto(
    "https://www.google.com/search?q=mountain&sxsrf=APq-WBtrFU81jauMRgWmUokZKZVsk3Megg:1650263735117&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjgpt69_5z3AhUS6qQKHTq-D50Q_AUoAXoECAIQAw"
  );
})();
