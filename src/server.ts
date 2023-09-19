const fs = require("fs");
const AWS = require("aws-sdk");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
import moment from "moment";
import { generateWord } from "./utils/generateWord";
import { getNewsLinks } from "./utils/getNewsLinks";
import { getStockPrice } from "./utils/getStockPrice";

module.exports.handler = async (event: any, context: any, callback: any) => {
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

    const today = moment();
    const formattedDate = today.format("DDMMYYYY");

    const bucketName = "stock-report-bucket";
    const key = `report${formattedDate}.docx`;
    const filePath = `/tmp/report${formattedDate}.docx`;

    // await fs.readFile(filePath, (err: any, data: any) => {
    //   if (err) {
    //     console.error("Error reading the file:", err);
    //     return;
    //   }

    //   const s3 = new AWS.S3();

    //   const params = {
    //     Bucket: bucketName,
    //     Key: key,
    //     Body: data,
    //   };

    //   s3.putObject(params)
    //     .promise()
    //     .then((res: any) =>
    //       console.log(`File ${key} uploaded to ${bucketName}`),
    //     );
    // });

    const data = await readFileAsync(filePath); // Use promisified fs.readFile

    const s3 = new AWS.S3();

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: data,
    };

    await s3.putObject(params).promise(); // Use async/await for S3 operation

    console.log(`File ${key} uploaded to ${bucketName}`);

    const responseBody = {
      message: "Hello from Lambda",
    };

    const response = {
      statusCode: 200,
      body: JSON.stringify(responseBody),
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("----FUNCTION END----");
    return response;
    // callback(null, response);
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
};
