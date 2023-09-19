import axios from "axios";

const iconv = require("iconv-lite");
const https = require("https");
const cheerio = require("cheerio");

const getArticles: any = async (url: any, name: any, retry = 0) => {
  const userAgentList = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
    "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363",
  ];
  const randomIndex = Math.floor(Math.random() * userAgentList.length);
  const randomUserAgent = userAgentList[randomIndex];
  const config = {
    responseType: "arraybuffer" as "arraybuffer",
    headers: {
      "User-Agent": randomUserAgent,
    },
    timeout: 5000,
  };
  // const modifiedUrl = url.replace("http", "https").replace("m", "news");

  console.log(url);

  try {
    const response = await axios.get(url, config);

    if (response.status !== 200 && retry < 10) {
      console.log(
        `----${name} GET ARTICLE ERROR ON ${retry} RETRY----`,
        response.status,
      );
      return getArticles(url, name, retry + 1);
    } else if (retry === 10) {
      console.log(`${name} REACH RETURN EMPTY 1`);
      return Promise.resolve({ title: "", article: [] });
    } else {
      const decodedData = iconv.decode(response.data, "gbk");
      const $ = cheerio.load(decodedData);

      const title = $(".main-title").text();
      const parentElement = $(".main-text");

      const pTags = parentElement.find("p");

      const article = pTags
        .map((index: any, element: any) => {
          return $(element).text();
        })
        .get();

      return Promise.resolve({ title, article });
    }
  } catch (error) {
    console.log(`----${name} GET ARTICLE ERROR RETRY: ${retry}`, error);
    if (retry < 10) {
      return getArticles(url, name, retry + 1);
    } else {
      return Promise.resolve({ title: "", article: [] });
    }
  }
};

// const getArticles = async (url: any, name: any, retry: number = 0) => {
//   return new Promise((resolve, reject) => {
//     const url = url.replace("http", "https").replace("m", "news");

//     https
//       .get(url, (res: any) => {
//         const chunks: any = [];
//         console.log("---- URL ----", url);
//         // console.log(`----${retry}, THIS IS THE RETRY NUMBER----`);
//         if (res.statusCode !== 200 && retry < 10) {
//           console.log(
//             `----${name} GET ARTICLE ERROR ON ${retry} RETRY----`,
//             res.statusCode,
//           );
//           return getArticles(url, name, ++retry);
//         } else if (retry === 10) {
//           console.log(`${name} REACH RETURN EMPTY 1`);
//           return resolve({ title: "", article: [] });
//         } else {
//           res.on("data", (chunk: any) => {
//             chunks.push(chunk);
//           });

//           res.on("end", () => {
//             const buffer = Buffer.concat(chunks);

//             const decodedData = iconv.decode(buffer, "gbk");
//             const $ = cheerio.load(decodedData);

//             const title = $(".main-title").text();
//             const parentElement = $(".main-text");

//             // const title = $(".title").text();
//             // const parentElement = $(".page_content");
//             // const title = $(".big-title").text();
//             // const parentElement = $(".result-container");

//             const pTags = parentElement.find("p");

//             const article = pTags
//               .map((index: any, element: any) => {
//                 return $(element).text();
//               })
//               .get();

//             resolve({ title: title, article: article });
//           });
//         }
//       })
//       .on("error", (error: any) => {
//         console.log(`----${name} GET ARTICLE ERROR`, error);
//         // reject(error);
//         console.log("REACH RETURN EMPTY 2");
//         if (retry < 10) {
//           return getArticles(url, name, retry + 1);
//         } else {
//           return resolve({ title: "", article: [] });
//         }
//       });
//   });
// };

export default getArticles;

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
