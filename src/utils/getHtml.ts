const iconv = require("iconv-lite");
const https = require("https");
const cheerio = require("cheerio");

const getHtml = async (url: any) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res: any) => {
        console.log("----STATUS CODE----", res.statusCode);
        const chunks: any = [];

        res.on("data", (chunk: any) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const decodedData = iconv.decode(buffer, "gbk");
          const $ = cheerio.load(decodedData);
          const parentElement = $(".main-text");
          const pTags = parentElement.find("p");

          const elements = pTags
            .map((index: any, element: any) => {
              return $(element).text();
            })
            .get();

          resolve(elements);
        });
      })
      .on("error", (error: any) => {
        reject(error);
      });
  });
};

export default getHtml;
