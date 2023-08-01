import { Request, Response, NextFunction } from "express";
import { generateWord } from "../utils/generateWord";
import { getStockPrice } from "../utils/getStockPrice";
import { getNewsLinks } from "../utils/getNewsLinks";

async function getReport(req: Request, res: Response, next: NextFunction) {
  console.log("-----FUNTION START-----");
  try {
    // YAHOO API FIRST
    const priceResult: any = await getStockPrice();
    // const priceResult = testPriceResult;

    // Do scraping
    const scrapingList = priceResult.filter(
      (el: any) => el.newsParam.length > 0,
    );

    const scrapingResult: any = await getNewsLinks(scrapingList);

    console.log("----SCRAPING COMPLETED----");

    // Find stocks that change more than 5%
    const hightlightStocksArr = priceResult.filter(
      (el: any) => Math.abs(el.changePercent) >= 5,
    );

    // Generate word doc
    const base64Doc = await generateWord(
      hightlightStocksArr,
      scrapingResult,
      priceResult,
    );

    res.status(200).send({
      success: true,
      message: "successful",
      priceResult: priceResult,
      file: base64Doc,
    });

    console.log("----FUNCTION END----");
  } catch (err) {
    console.log("IN ERR: ", err);

    res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
}

export default getReport;
