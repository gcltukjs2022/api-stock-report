import puppeteer from "puppeteer";
import getHtml from "./getHtml";

export const getNewsLinks = async (priceResult: any) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (req) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    let scrapingResult = [];
    const maxRetries = 3;
    const retryDelay = 2000;

    try {
      for (let i = 0; i < priceResult.length; i++) {
        console.log(`IN ${[i]} LOOP ${priceResult[i].param}`);

        if (priceResult[i].param.length > 0) {
          const url = `https://m.10jqka.com.cn/stockpage/${priceResult[i].param}/`;
          let retries = 0;

          while (retries < maxRetries) {
            try {
              await page.goto(url, { timeout: 30000, waitUntil: "load" });
              console.log("----ENTER STOCK PAGE----");

              await page.waitForSelector(
                "body .main-content .hexm-news-cont .geguNews-pane a",
              );

              const allLinks = await page.evaluate(() =>
                Array.from(
                  document.querySelectorAll(
                    "body .main-content .hexm-news-cont .geguNews-pane a",
                  ),
                  (el: any) => [el.textContent, el.href],
                ),
              );

              // Add stock name to each news article
              allLinks.forEach((el) => el.unshift(priceResult[i].display));

              // Set today date
              // const today = moment(new Date()).format("YYYYMMDD");
              const today = "20230717";

              // Get today news Article links
              let matchLinks: any = [];
              for (let i = 0; i < allLinks.length; i++) {
                if (allLinks[i][2].includes(today)) {
                  matchLinks.push(allLinks[i]);
                }
              }

              console.log("----MATCH LINKS----", matchLinks);

              // Start loop to scrape
              for (let i = 0; i < matchLinks.length; i++) {
                const url = matchLinks[i][2];
                const httpsUrl = url
                  .replace("http", "https")
                  .replace("m", "news");
                console.log(httpsUrl);

                const pElements: any = await getHtml(httpsUrl);
                console.log("----ARTICLES----", pElements);
                matchLinks[i][2] = pElements.join("").trim();
              }
              if (matchLinks.length > 0) {
                scrapingResult.push(matchLinks);
              }
              break;
            } catch (err) {
              console.log("Error occurred, retrying...");
              retries++;
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
          }
        }
      }
      return scrapingResult;
    } catch (err: any) {
      console.log(err);
    }
  } catch (err) {}
};
