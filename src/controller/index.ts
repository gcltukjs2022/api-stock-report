import { generateWord } from "../utils/generateWord";
import { getStockPrice } from "../utils/getStockPrice";
import { getNewsLinks } from "../utils/getNewsLinks";
import moment from "moment";
const fs = require("fs");
const AWS = require("aws-sdk");

async function getReport(event: any, context: any, callback: any) {
  try {
    const priceResult: any = await getStockPrice();

    const scrapingList = priceResult.filter(
      (el: any) => el.newsParam.length > 0,
    );

    const scrapingResult: any = await getNewsLinks(scrapingList);

    console.log("----SCRAPING COMPLETED----");

    const hightlightStocksArr = priceResult.filter(
      (el: any) => Math.abs(el.changePercent) >= 5,
    );

    await generateWord(hightlightStocksArr, scrapingResult, priceResult);

    console.log("----FUNCTION END----");

    const today = moment();
    const formattedDate = today.format("DDMMYYYY");

    const bucketName = "stock-report-bucket";
    const key = `report${formattedDate}.docx`;
    const filePath = `/tmp/report${formattedDate}.docx`;

    fs.readFile(filePath, (err: any, data: any) => {
      if (err) {
        console.error("Error reading the file:", err);
        return;
      }

      const s3 = new AWS.S3();

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: data,
      };

      s3.putObject(params)
        .promise()
        .then((res: any) =>
          console.log(`File ${key} uploaded to ${bucketName}`),
        );

      return {
        statusCode: 200,
        body: JSON.stringify("File uploaded successfully"),
      };
    });
  } catch (err: any) {
    console.log("IN ERR: ", err);

    const errorResponse = {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "An error occurred",
        error: err.message,
      }),
    };

    // Use the callback function to return the error response
    callback(null, errorResponse);
  }
}

export default getReport;
