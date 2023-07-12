import axios from "axios";
import { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer";
import { data, iData } from "./data";

async function getStockPrice(req: Request, res: Response, next: NextFunction) {
  console.log("-----GET STOCK PRICE-----");
  try {
    // YAHOO API FIRST
    const symbols = data.map((el: iData) => el.yahooSymbol).join(",");
    console.log("STAGE 1");

    const options = {
      method: "GET",
      url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
      params: {
        region: "US",
        symbols: symbols,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    };
    const response: any = await axios.request(options);
    console.log("STAGE 2");

    const resArr = response.data.quoteResponse.result;

    let priceResult = [];

    for (let i = 0; i < resArr.length; i++) {
      for (let j = 0; j < resArr.length; j++) {
        if (resArr[i].longName === data[j].yahooName) {
          const combinedObj = {
            marketPrice: resArr[i].regularMarketPrice,
            changePercent: resArr[i].regularMarketChangePercent,
            ...data[j],
          };
          priceResult.push(combinedObj);
        }
      }
    }

    // Scraping
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // for (let i = 0; i < stocksArr.length; i++) {
    //   console.log(`IN ${[i]} LOOP ${stocksArr[i].yahoo}`);
    //   if (stocksArr[i].yahoo.length > 0) {
    //     const url = `https://hk.finance.yahoo.com/quote/${stocksArr[i].yahoo}`;
    //     console.log("STAGE 1");
    //     await page.goto(url, { timeout: 60000, waitUntil: "networkidle0" });
    //     // const marketPrice = await page.evaluate(
    //     //   () => document.querySelector("body #app")!.textContent,
    //     // );
    //     console.log("STAGE 2");
    //     // const marketPrice = await page.evaluate(() => {
    //     //   const element = document.querySelector(
    //     //     `fin-streamer[data-symbol=${stocksArr[i].yahoo}][data-field="regularMarketPrice"]`,
    //     //   );
    //     //   return element!.textContent;
    //     // });
    //     // const marketPrice = await page.evaluate(() => {
    //     // const element = document.querySelector(
    //     //   "body #app >div #render-target-default >div #YDC-MainCanvas >div #YDC-Col1 #YD-Col1-Stack #YDC-Col1-Stack-Composite >div #mrt-node-Col1-3-QuoteHeader #Col1-3-QuoteHeader-Proxy #quote-header-info  >div >div >div fin-streamer",
    //     // );
    //     // await page.waitForXPath(
    //     //   "//*[@id='quote-header-info']/div[3]/div/fin-streamer",
    //     // );
    //     // let elHandle = await page.$x(
    //     //   "//*[@id='quote-header-info']/div[3]/div/fin-streamer",
    //     // );
    //     // let marketPrice = await page.evaluate(
    //     //   (el) => el.textContent,
    //     //   elHandle[0],
    //     // );

    //     const marketPrice = await page.evaluate(() => {
    //       const element = document.querySelectorAll("fin-streamer");
    //       return element;
    //     });

    //     // return element
    //     // });
    //     console.log("STAGE 3");
    //     console.log(marketPrice);
    //   } else {
    //     const url = `https://m.10jqka.com.cn/stockpage/${stocksArr[i].param}/`;
    //     await page.goto(url, { timeout: 60000, waitUntil: "networkidle0" });

    //     // page.waitForSelector(
    //     //   "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_curPrice",
    //     // );
    //     const marketPrice = await page.evaluate(
    //       () =>
    //         document.querySelector(
    //           "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_curPrice",
    //         )!.textContent,
    //     );
    //     console.log(marketPrice);

    //     // page.waitForSelector(
    //     //   "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_float_rate",
    //     // );
    //     const changePercentage = await page.evaluate(
    //       () =>
    //         document.querySelector(
    //           "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_float_rate",
    //         )!.textContent,
    //     );
    //     console.log(changePercentage);

    //     stocksArr[i]["curPrice"] = marketPrice;
    //     stocksArr[i]["floatRate"] = changePercentage;
    //   }
    // }
    res.status(200).send({
      success: true,
      data: {
        priceResult,
      },
    });
    console.log("---END---");
  } catch (err) {
    console.log("IN ERR: ", err);

    res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
}

export default getStockPrice;
