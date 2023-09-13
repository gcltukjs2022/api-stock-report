import axios from "axios";
import moment from "moment";
import getArticles from "./getArticles";

export const getNewsLinks = async (scrapingList: any) => {
  console.log("-----GET NEWS LINKS FUNCTION START-----");

  const today = moment(new Date()).format("YYYYMMDD");
  const workDay = moment(new Date()).format("dddd");

  const currentDate = moment();
  const saturday = currentDate.clone().subtract(2, "days").format("YYYYMMDD");
  const sunday = currentDate.clone().subtract(1, "day").format("YYYYMMDD");

  try {
    const makeRequest: any = (el: any) => {
      return axios
        .get(`https://m.0033.com/list/sm/sc/${el.newsParam}.jsonp`)
        .then((response: any) => {
          console.log(`----JSON STATUS ${el.display}----`, response.status);

          if (response.status === 200) {
            const resArr = JSON.stringify(response.data).split(",");
            const stockObj: any = {
              display: el.display,
              newsLinks: [],
            };
            let links;
            if (workDay === "Monday") {
              links = resArr
                .map((el) => el.replace(/\\/g, ""))
                .filter(
                  (el) =>
                    el.includes(today) ||
                    el.includes(saturday) ||
                    el.includes(sunday),
                );
            } else {
              links = resArr
                .map((el) => el.replace(/\\/g, ""))
                .filter((el) => el.includes(today));
            }

            // console.log(`----LINKS----`, links);

            if (links.length > 0) {
              const urlRegex = /http[^"]*shtml/g;
              const urls = links
                .map((el) => {
                  const match = el.match(urlRegex);
                  return match ? match[0] : null;
                })
                .filter((el) => el !== null);
              stockObj.newsLinks = urls;
            }

            return stockObj;
          } else {
            // Retry the request after a delay using recursion
            console.log(`Retrying request for ${el.display}`);
            return makeRequest(el);
          }
        })
        .catch((err) => {
          // If an error occurs during the request, you can return a default value or handle it accordingly
          console.error("----MAKE REQUEST ERROR----", err);
          return { display: el.display, newsLinks: [] };
        });
    };

    const newsLinksPromise = Promise.all(
      scrapingList.map((el: any, i: number) => {
        return makeRequest(el);
      }),
    );

    const linksArr = await newsLinksPromise;

    const articlesArr = linksArr.filter((el) => el.newsLinks.length > 0);

    const processArticle = async (article: any) => {
      console.log(`Processing article: ${article.display}`);
      article.news = [];

      // Create an array to store promises for scraping
      const scrapingArr = article.newsLinks.map((newsLink: any) => {
        const httpsUrl = newsLink.replace("http", "https").replace("m", "news");
        return getArticles(httpsUrl, article.display);
      });

      // Use Promise.all to fetch all the articles concurrently
      const scrapingRes = await Promise.all(scrapingArr);
      const arr = scrapingRes.map((el) => {
        return { title: el.title, article: el.article.join("").trim("") };
      });
      article.news = arr;

      console.log(`Finished processing article: ${article.display}`);
      return article;
    };

    // Use Promise.all to execute all articles concurrently
    const processedArticles = await Promise.all(
      articlesArr.map(processArticle),
    );

    return processedArticles;
  } catch (err) {
    console.log("----IN ERR----", err);
    // throw err;
  }
};

// import axios from "axios";
// import moment from "moment";
// import getHtml from "./getHtml";

// export const getNewsLinks = async (scrapingList: any) => {
//   console.log("-----GET NEWS LINKS FUNCTION START-----");

//   const today = moment(new Date()).format("YYYYMMDD");
//   const workDay = moment(new Date()).format("dddd");
//   const currentDate = moment();
//   const saturday = currentDate.clone().subtract(2, "days").format("YYYYMMDD");
//   const sunday = currentDate.clone().subtract(1, "day").format("YYYYMMDD");

//   try {
//     const makeRequest: any = (el: any) => {
//       return axios
//         .get(`https://m.0033.com/list/sm/sc/${el.newsParam}.jsonp`)
//         .then((response: any) => {
//           console.log(`----JSON STATUS ${el.display}----`, response.status);

//           if (response.status === 200) {
//             const resArr = JSON.stringify(response.data).split(",");
//             const stockObj: any = {
//               display: el.display,
//               newsLinks: [],
//             };
//             let links;
//             if (workDay === "Monday") {
//               links = resArr
//                 .map((el) => el.replace(/\\/g, ""))
//                 .filter(
//                   (el) =>
//                     el.includes(today) ||
//                     el.includes(saturday) ||
//                     el.includes(sunday),
//                 );
//             } else {
//               links = resArr
//                 .map((el) => el.replace(/\\/g, ""))
//                 .filter((el) => el.includes(today));
//             }

//             console.log(`----LINKS----`, links);

//             if (links.length > 0) {
//               const urlRegex = /http[^"]*shtml/g;
//               const urls = links
//                 .map((el) => {
//                   const match = el.match(urlRegex);
//                   return match ? match[0] : null;
//                 })
//                 .filter((el) => el !== null);
//               stockObj.newsLinks = urls;
//             }

//             return stockObj;
//           } else {
//             // Retry the request after a delay using recursion
//             console.log(`Retrying request for ${el.display}`);
//             return makeRequest(el);
//           }
//         })
//         .catch((err) => {
//           // If an error occurs during the request, you can return a default value or handle it accordingly
//           console.error("GET NEWS LINK ERROR: ", err);
//           return { display: el.display, newsLinks: [] };
//         });
//     };

//     const newsLinksPromise = Promise.all(
//       scrapingList.map((el: any, i: number) => {
//         return makeRequest(el);
//       }),
//     );

//     const linksArr = await newsLinksPromise;

//     const articlesArr = linksArr.filter((el: any) => el.newsLinks.length > 0);

//     for (let i = 0; i < articlesArr.length; i++) {
//       console.log(`IN LOOP ${i} ${articlesArr[i].display}`);
//       articlesArr[i].news = [];
//       let scrapingArr = [];
//       for (let j = 0; j < articlesArr[i].newsLinks.length; j++) {
//         const httpsUrl = articlesArr[i].newsLinks[j]
//           .replace("http", "https")
//           .replace("m", "news");
//         scrapingArr.push(getHtml(httpsUrl));
//       }

//       const scrapingRes = await Promise.all(scrapingArr);
//       const arr = scrapingRes.map((el: any) => {
//         return { title: el.title, article: el.article.join("").trim("") };
//       });
//       articlesArr[i].news = arr;
//     }
//     return articlesArr;
//   } catch (err) {
//     console.log("IN ERR: ", err);
//     // throw err;
//   }
// };
