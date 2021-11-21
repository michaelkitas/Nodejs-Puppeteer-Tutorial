const fs = require("fs");
const puppeteer = require("puppeteer");

const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  let fileName = false;
  let fileDownloaded = false;
  let updated_img = false;
  let code = false;
  let updated_code = false;
  page.on("response", async (response) => {
    const img_url = response.url();
    if (img_url.includes("99581b9d446a509a0a01954438a5e36a.jpg")) {
      response.buffer().then((file) => {
        fileName = "./captchas/" + "99581b9d446a509a0a01954438a5e36a.jpg";

        const writeStream = fs.createWriteStream(fileName);
        writeStream.write(file);
        fileDownloaded = true;
      });
    }
  });

  await page.goto("https://2captcha.com/demo/normal");

  while (!updated_img) {
    await sleep(100);
    if (fileName && fileDownloaded) {
      updated_img = true;

      const spawn = require("child_process").spawn;
      const pythonProcess = spawn("python", ["captcha.py", fileName]);

      pythonProcess.stdout.on("data", (data) => {
        try {
          const res = JSON.parse(data.toString().replace(/'/g, `"`));
          code = res.code;
        } catch (error) {}
      });
    }
  }

  while (!updated_code) {
    await sleep(100);
    if (code) {
      updated_code = true;
      console.log("The code is: " + code);
      await page.type("#simple-captcha-field", code);
      await sleep(100);
      await page.click("._2iYm2u0v9LWjjsuiyfKsv4");
    }
  }

  //await browser.close();
})();
