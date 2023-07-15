import axios from "axios";
import { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer";
import * as fs from "fs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  HeightRule,
} from "docx";
import moment from "moment";
import { data, iData } from "./data";
import { testPriceResult as priceResult } from "./testData";
const path = require("path");

async function getStockPrice(req: Request, res: Response, next: NextFunction) {
  console.log("-----FUNTION START-----");
  try {
    // YAHOO API FIRST
    // const symbols = data.map((el: iData) => el.yahooSymbol).join(",");

    // const options = {
    //   method: "GET",
    //   url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
    //   params: {
    //     region: "US",
    //     symbols: symbols,
    //   },
    //   headers: {
    //     "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    //     "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
    //   },
    // };
    // const response: any = await axios.request(options);
    // console.log("----GOT API RESPONSE----");

    // const resArr = response.data.quoteResponse.result;

    // let priceResult = [];

    // for (let i = 0; i < resArr.length; i++) {
    //   for (let j = 0; j < resArr.length; j++) {
    //     if (resArr[i].longName === data[j].yahooName) {
    //       const combinedObj = {
    //         marketPrice: resArr[i].regularMarketPrice,
    //         changePercent: resArr[i].regularMarketChangePercent,
    //         ...data[j],
    //       };
    //       priceResult.push(combinedObj);
    //     }
    //   }
    // }

    // Scraping;
    const scrapingArr = priceResult.filter(
      (el) => Math.abs(el.changePercent) >= 5,
    );

    const browser = await puppeteer.launch({ headless: "new" });
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

    for (let i = 0; i < scrapingArr.length; i++) {
      console.log(`IN ${[i]} LOOP ${scrapingArr[i].param}`);
      if (scrapingArr[i].param.length > 0) {
        const url = `https://m.10jqka.com.cn/stockpage/${scrapingArr[i].param}/`;

        await page.goto(url, { timeout: 30000, waitUntil: "networkidle0" });
        console.log("----ENTER STOCK PAGE----");

        const allLinks = await page.evaluate(() =>
          Array.from(
            document.querySelectorAll(
              "body .main-content .hexm-news-cont .geguNews-pane a",
            ),
            (el: any) => [el.textContent, el.href],
          ),
        );

        // Add stock name to each news article
        allLinks.forEach((el) => el.unshift(scrapingArr[i].display));

        // Set today date
        const today = moment(new Date()).format("YYYYMMDD");

        // Get today news Article links
        let matchLinks: any = [];
        for (let i = 0; i < allLinks.length; i++) {
          if (allLinks[i][2].includes(today)) {
            matchLinks.push(allLinks[i]);
          }
        }

        // Start loop to scrape
        for (let i = 0; i < matchLinks.length; i++) {
          const url = matchLinks[i][2];
          await page.goto(url, {
            timeout: 30000,
            waitUntil: "load",
          });
          await page.waitForSelector("body .main-content .main-fl .main-text");
          console.log(`---ENTER NEWS ARTICLE ${url}---`);

          const articles = await page.evaluate(() => {
            const paragraphs = Array.from(
              document.querySelectorAll(
                "body .main-content .main-fl .main-text p",
              ),
            );
            return paragraphs.map((p) => p.textContent);
          });

          matchLinks[i][2] = articles.join("").trim();
        }

        if (matchLinks.length > 0) {
          scrapingResult.push(matchLinks);
        }
      }
    }

    await browser.close();

    console.log("----SCRAPING COMPLETED----");

    let hightLightStocks: any = [];

    for (let i = 0; i < scrapingArr.length; i++) {
      hightLightStocks.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${scrapingArr[i].display} ${moment(new Date()).format(
                "M",
              )} 月 ${moment(new Date()).format("D")} 日 ${
                priceResult[i].changePercent > 0 ? "涨幅" : "跌幅"
              }  ${Math.round(priceResult[i].changePercent)}%, 收盘价 ${
                priceResult[i].marketPrice
              } ${
                priceResult[i].currency === "USD"
                  ? "美元"
                  : priceResult[i].currency === "HKD"
                  ? "港币"
                  : priceResult[i].currency === "SGD"
                  ? "新加坡元"
                  : "元"
              }`,
              bold: true,
              highlight: "yellow",
            }),
          ],
        }),
      );
    }

    let articlesParagraphs: any = [];

    for (let i = 0; i < scrapingResult.length; i++) {
      for (let j = 0; j < scrapingResult[i].length; j++) {
        articlesParagraphs.push(
          new Paragraph({
            children: [],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: scrapingResult[i][j][0],
                bold: true,
                highlight: "yellow",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: scrapingResult[i][j][1], bold: true }),
            ],
          }),
          new Paragraph({
            children: [new TextRun(scrapingResult[i][j][2])],
          }),
          new Paragraph({
            children: [],
          }),
        );
      }
    }

    const firstRow = new Table({
      columnWidths: [901, 901, 901, 901, 5406],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 901,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Project")],
            }),
            new TableCell({
              width: {
                size: 901,
                type: WidthType.DXA,
              },
              children: [new Paragraph("ADR / Shares")],
            }),
            new TableCell({
              width: {
                size: 901,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Listing Ticker")],
            }),
            new TableCell({
              width: {
                size: 901,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Local CCY")],
            }),
            new TableCell({
              width: {
                size: 5406,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Combine")],
            }),
          ],
          height: {
            value: 700,
            rule: HeightRule.EXACT,
          },
        }),
      ],
    });

    const tableArr = [];

    for (let i = 0; i < priceResult.length; i++) {
      tableArr.push(
        new Table({
          columnWidths: [901, 901, 901, 901, 5406],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 901,
                    type: WidthType.DXA,
                  },
                  children: [new Paragraph(priceResult[i].name)],
                }),
                new TableCell({
                  width: {
                    size: 901,
                    type: WidthType.DXA,
                  },
                  children: [new Paragraph(priceResult[i].type)],
                }),
                new TableCell({
                  width: {
                    size: 901,
                    type: WidthType.DXA,
                  },
                  children: [new Paragraph(priceResult[i].ticker)],
                }),
                new TableCell({
                  width: {
                    size: 901,
                    type: WidthType.DXA,
                  },
                  children: [new Paragraph(priceResult[i].currency)],
                }),
                new TableCell({
                  width: {
                    size: 5406,
                    type: WidthType.DXA,
                  },
                  children: [
                    new Paragraph(
                      `${priceResult[i].display} ${moment(new Date()).format(
                        "M",
                      )} 月 ${moment(new Date()).format("D")} 日 ${
                        priceResult[i].changePercent > 0 ? "涨幅" : "跌幅"
                      } ${Math.round(priceResult[i].changePercent)}%, 收盘价 ${
                        priceResult[i].marketPrice
                      } ${
                        priceResult[i].currency === "USD"
                          ? "美元"
                          : priceResult[i].currency === "HKD"
                          ? "港币"
                          : priceResult[i].currency === "SGD"
                          ? "新加坡元"
                          : "元"
                      }`,
                    ),
                  ],
                }),
              ],
              height: {
                value: 800,
                rule: HeightRule.EXACT,
              },
            }),
          ],
        }),
      );
    }

    const highlighttext = new TextRun({
      text: `${moment(new Date()).format("YYYY.MM.DD.")}`,
      highlight: "yellow",
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun(
                  `Please find attached the listed share price summary as of `,
                ),
                new TextRun({
                  text: `${moment(new Date()).format("YYYY.MM.DD.")}`,
                  highlight: "yellow",
                }),
              ],
            }),
            new Paragraph({
              children: [],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "Below please also find public news which is relevant to the stocks or banks during the day: ",
                ),
              ],
            }),
            new Paragraph({
              children: [],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "项目相关",
                  bold: true,
                  highlight: "yellow",
                }),
              ],
            }),
            ...hightLightStocks,
            new Paragraph({
              children: [],
            }),
            ...articlesParagraphs,
            new Paragraph({
              children: [],
            }),
            firstRow,
            ...tableArr,
          ],
        },
      ],
    });

    // Used to export the file into a .docx file
    const filePath = path.join(__dirname, "../generatedDocs/report.docx");
    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(filePath, buffer, { encoding: "binary" });
    });

    res.status(200).send({
      success: true,
      data: {
        priceResult,
      },
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

export default getStockPrice;
