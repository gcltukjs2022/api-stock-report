import {
  Document,
  HeightRule,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import * as fs from "fs";
import moment from "moment";
import path from "path";
import { convertDocToBase64 } from "./convertDocToBase64";

export const generateWord = async (
  hightlightStocksArr: any,
  scrapingResult: any,
  priceResult: any,
) => {
  let hightLightStocksParagraphs: any = [];
  console.log("----IN GEN WORD---");
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();

  for (let i = 0; i < hightlightStocksArr.length; i++) {
    if (currentDayOfMonth === 1) {
      hightLightStocksParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${hightlightStocksArr[i].display} ${
                hightlightStocksArr[i].currency === "USD"
                  ? moment(new Date()).subtract(1, "month").format("M")
                  : moment(new Date()).format("M")
              } 月 ${
                hightlightStocksArr[i].currency === "USD"
                  ? moment(new Date()).subtract(1, "day").format("D")
                  : moment(new Date()).format("D")
              } 日 ${
                hightlightStocksArr[i].changePercent > 0 ? "涨幅" : "跌幅"
              }  ${Math.abs(
                Math.round(hightlightStocksArr[i].changePercent),
              )}%, 收盘价 ${hightlightStocksArr[i].marketPrice.toFixed(1)} ${
                hightlightStocksArr[i].currency === "USD"
                  ? "美元"
                  : hightlightStocksArr[i].currency === "HKD"
                  ? "港币"
                  : hightlightStocksArr[i].currency === "SGD"
                  ? "新加坡元"
                  : "元"
              }`,
              bold: true,
              highlight: "yellow",
            }),
          ],
        }),
      );
    } else {
      hightLightStocksParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${hightlightStocksArr[i].display} ${moment(
                new Date(),
              ).format("M")} 月 ${
                hightlightStocksArr[i].currency === "USD"
                  ? moment(new Date()).subtract(1, "day").format("D")
                  : moment(new Date()).format("D")
              } 日 ${
                hightlightStocksArr[i].changePercent > 0 ? "涨幅" : "跌幅"
              }  ${Math.abs(
                Math.round(hightlightStocksArr[i].changePercent),
              )}%, 收盘价 ${hightlightStocksArr[i].marketPrice} ${
                hightlightStocksArr[i].currency === "USD"
                  ? "美元"
                  : hightlightStocksArr[i].currency === "HKD"
                  ? "港币"
                  : hightlightStocksArr[i].currency === "SGD"
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
  }

  let articlesParagraphs: any = [];

  for (let i = 0; i < scrapingResult.length; i++) {
    let articles = [];

    const display = [
      new Paragraph({
        children: [],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: scrapingResult[i].display,
            bold: true,
            highlight: "yellow",
          }),
        ],
      }),
    ];
    for (let j = 0; j < scrapingResult[i].news.length; j++) {
      articles.push(
        new Paragraph({
          children: [
            new TextRun({ text: scrapingResult[i].news[j].title, bold: true }),
          ],
        }),
        new Paragraph({
          children: [new TextRun(scrapingResult[i].news[j].article)],
        }),
        new Paragraph({
          children: [],
        }),
      );
    }
    articlesParagraphs.push(...display, ...articles);
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
    if (currentDayOfMonth === 1) {
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
                      `${priceResult[i].display} ${
                        priceResult[i].currency === "USD"
                          ? moment(new Date()).subtract(1, "month").format("M")
                          : moment(new Date()).format("M")
                      } 月 ${
                        priceResult[i].currency === "USD"
                          ? moment(new Date()).subtract(1, "day").format("D")
                          : moment(new Date()).format("D")
                      } 日 ${
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
    } else {
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
                      )} 月 ${
                        priceResult[i].currency === "USD"
                          ? moment(new Date()).subtract(1, "day").format("D")
                          : moment(new Date()).format("D")
                      } 日 ${
                        priceResult[i].changePercent > 0 ? "涨幅" : "跌幅"
                      } ${Math.abs(
                        Math.round(priceResult[i].changePercent),
                      )}%, 收盘价 ${priceResult[i].marketPrice} ${
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
  }

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
          ...hightLightStocksParagraphs,
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
  const filePath = path.join(__dirname, "../report.docx");
  await Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(filePath, buffer, { encoding: "binary" });
  });

  const base64Doc = await convertDocToBase64();

  return base64Doc;
};
