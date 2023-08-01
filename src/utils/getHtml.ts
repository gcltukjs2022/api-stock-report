const iconv = require("iconv-lite");
const https = require("https");
const cheerio = require("cheerio");

const getHtml = async (url: any, retry: number = 0) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res: any) => {
        console.log("----STATUS CODE----", res.statusCode);
        const chunks: any = [];

        if (res.statusCode !== 200 && retry < 10) {
          return getHtml(url, retry++);
        }

        res.on("data", (chunk: any) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const decodedData = iconv.decode(buffer, "gbk");
          const $ = cheerio.load(decodedData);
          const title = $(".main-title").text();
          const parentElement = $(".main-text");
          const pTags = parentElement.find("p");

          const article = pTags
            .map((index: any, element: any) => {
              return $(element).text();
            })
            .get();

          resolve({ title: title, article: article });
        });
      })
      .on("error", (error: any) => {
        reject(error);
        console.log(error);
      });
  });
};

export default getHtml;

// const getHtml = async (url: any) => {
//   return new Promise((resolve, reject) => {
//     https
//       .get(url, (res: any) => {
//         console.log("----STATUS CODE----", res.statusCode);
//         const chunks: any = [];

//         res.on("data", (chunk: any) => {
//           chunks.push(chunk);
//         });

//         res.on("end", () => {
//           const buffer = Buffer.concat(chunks);
//           const decodedData = iconv.decode(buffer, "gbk");
//           const $ = cheerio.load(decodedData);
//           const title = $(".main-title").text();
//           const parentElement = $(".main-text");
//           const pTags = parentElement.find("p");

//           const article = pTags
//             .map((index: any, element: any) => {
//               return $(element).text();
//             })
//             .get();

//           resolve({ title: title, article: article });
//         });
//       })
//       .on("error", (error: any) => {
//         reject(error);
//         console.log(error);
//       });
//   });
// };
