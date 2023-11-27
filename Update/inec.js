const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const args = [
  "--no-sandbox",
  "--disable-infobars",
  "--window-position=0,0",
  "--ignore-certifcate-errors",
  "--ignore-certifcate-errors-spki-list",
  '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
];

const options = {
  args,
  headless: true,
  defaultViewport: null,
  ignoreHTTPSErrors: true,
  // userDataDir: './tmp'
};

(async () => {
  const url = "https://cvr.inecnigeria.org/pu";
  const browser = await puppeteer.launch(options).catch((err) => {
    console.error(err.message);
    browser.close();
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 0 }).catch((err) => {
    console.error(err.stack);
  });

  const waitTime = 2000;

  const states = await page.$$("#SearchStateId > option");

  const allLGAs = [];

  for (let i = 0; i < states.length; i++) {
    // await page.click('#SearchStateId');
    const state = await states[i].evaluate((el) => el.textContent);
    const stateValue = await states[i].evaluate((el) => el.value);
    await page.select("#SearchStateId", stateValue);
    await page.waitFor(waitTime);

    const lgas = await page.$$("#SearchLocalGovernmentId > option");
    for (let j = 1; j < lgas.length; j++) {
      const lga = await lgas[j].evaluate((el) => el.textContent);
      const lgaValue = await lgas[j].evaluate((el) => el.value);
      await page.select("#SearchLocalGovernmentId", lgaValue);

      allLGAs.push({
        state: capitalizeWords(state.slice(5)),
        lga: capitalizeWords(lga.slice(5)),
      });
    }

    console.log(state);
  }

  fs.writeFileSync(`./lgas.json`, JSON.stringify(allLGAs));

  await page.close();
  process.exit();
})();

function capitalizeWords(str) {
  let words = str.toLowerCase().split(" ");
  let capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  let capitalizedString = capitalizedWords.join(" ");
  return capitalizedString;
}

const inec = () => {
  (async () => {
    const url = "https://cvr.inecnigeria.org/pu";
    const browser = await puppeteer.launch(options).catch((err) => {
      console.error(err.message);
      browser.close();
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 0 }).catch((err) => {
      console.error(err.stack);
    });

    const waitTime = 2000;

    const states = await page.$$("#SearchStateId > option");

    for (let i = 13; i < states.length; i++) {
      let result = "";
      // await page.click('#SearchStateId');
      const state = await states[i].evaluate((el) => el.textContent);
      const stateValue = await states[i].evaluate((el) => el.value);
      await page.select("#SearchStateId", stateValue);
      await page.waitFor(waitTime);

      const lgas = await page.$$("#SearchLocalGovernmentId > option");
      for (let j = 1; j < lgas.length; j++) {
        const lga = await lgas[j].evaluate((el) => el.textContent);
        const lgaValue = await lgas[j].evaluate((el) => el.value);
        await page.select("#SearchLocalGovernmentId", lgaValue);
        await page.waitFor(waitTime);

        const regAreas = await page.$$("#SearchRegistrationAreaId > option");
        for (let k = 1; k < regAreas.length; k++) {
          const regArea = await regAreas[k].evaluate((el) => el.textContent);
          const regAreaValue = await regAreas[k].evaluate((el) => el.value);
          await page.select("#SearchRegistrationAreaId", regAreaValue);
          await page.waitFor(waitTime);

          const polUnits = await page.$$("#SearchPollingUnitId > option");
          await page.waitFor(3000);
          for (let l = 1; l < polUnits.length; l++) {
            const polUnit = await polUnits[l]
              .evaluate((el) => el.textContent)
              .catch((err) => console.error(err.message));
            result += `${state}\t${lga}\t${regArea}\t${polUnit
              .replace(/\s+/g, " ")
              .trim()}\n`;
          }
          console.log(`${state}\t${lga}\t${regArea}`);
        }
      }

      fs.writeFileSync(`./${state}.txt`, result);
    }
  })();
};
