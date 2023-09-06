import { Request, Response, NextFunction } from "express";
import { generateWord } from "../utils/generateWord";
import { getStockPrice } from "../utils/getStockPrice";
import { getNewsLinks } from "../utils/getNewsLinks";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

// async function getReport(req: Request, res: Response, next: NextFunction) {
async function getReport(event: any, context: any, callback: any) {
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

    // res.status(200).send({
    //   success: true,
    //   message: "successful",
    //   priceResult: priceResult,
    //   file: base64Doc,
    // });

    console.log("----FUNCTION END----");

    // const response = {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     success: true,
    //     message: "successful",
    //     priceResult: priceResult,
    //     file: base64Doc,
    //   }),
    // };

    // // Use the callback function to return the response
    // callback(null, response);

    // let response = {
    //   statusCode: 200,
    //   headers: {
    //     "Content-type":
    //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //   },
    //   body: base64Doc,
    //   isBase64Encoded: true,
    // };
    // return response;
    // return {
    //   statusCode: 200,
    //   headers: {
    //     "Content-Type": "application/octet-stream", // DOCX files are binary
    //   },
    //   isBase64Encoded: true, // Indicate that the body is base64-encoded
    //   body: base64Doc,
    // };

    const bucketName = "stock-report-bucket";
    const key = "report.docx";
    const body = base64Doc;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
    };

    await s3.putObject(params).promise();
    console.log(`File ${key} uploaded to ${bucketName}`);
    return {
      statusCode: 200,
      body: JSON.stringify("File uploaded successfully"),
    };
  } catch (err: any) {
    console.log("IN ERR: ", err);

    // res.status(400).send({
    //   success: false,
    //   message: "Something went wrong",
    //   error: err,
    // });

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
