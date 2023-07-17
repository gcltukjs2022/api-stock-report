import { Request, Response, NextFunction } from "express";
import { generateWord } from "../utils/generateWord";
import { getStockPrice } from "../utils/getStockPrice";
import { getNewsLinks } from "../utils/getNewsLinks";

async function getReport(req: Request, res: Response, next: NextFunction) {
  console.log("-----FUNTION START-----");
  try {
    // YAHOO API FIRST
    const priceResult: any = await getStockPrice();

    // Send result to frontend first
    res.status(200).send({
      success: true,
      data: {
        priceResult,
      },
    });

    // Do scraping
    const scrapingResult: any = await getNewsLinks(priceResult);

    console.log("----SCRAPING COMPLETED----");

    // Find stocks that change more than 5%
    const hightlightStocksArr = priceResult.filter(
      (el: any) => Math.abs(el.changePercent) >= 5,
    );

    // Generate word doc
    await generateWord(hightlightStocksArr, scrapingResult, priceResult);

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
