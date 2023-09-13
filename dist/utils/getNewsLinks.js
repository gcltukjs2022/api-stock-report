"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsLinks = void 0;
var axios_1 = __importDefault(require("axios"));
var moment_1 = __importDefault(require("moment"));
var getArticles_1 = __importDefault(require("./getArticles"));
var getNewsLinks = function (scrapingList) { return __awaiter(void 0, void 0, void 0, function () {
    var today, workDay, currentDate, saturday, sunday, makeRequest_1, newsLinksPromise, linksArr, articlesArr, processArticle, processedArticles, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("-----GET NEWS LINKS FUNCTION START-----");
                today = (0, moment_1.default)(new Date()).format("YYYYMMDD");
                workDay = (0, moment_1.default)(new Date()).format("dddd");
                currentDate = (0, moment_1.default)();
                saturday = currentDate.clone().subtract(2, "days").format("YYYYMMDD");
                sunday = currentDate.clone().subtract(1, "day").format("YYYYMMDD");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                makeRequest_1 = function (el) {
                    return axios_1.default
                        .get("https://m.0033.com/list/sm/sc/".concat(el.newsParam, ".jsonp"))
                        .then(function (response) {
                        console.log("----JSON STATUS ".concat(el.display, "----"), response.status);
                        if (response.status === 200) {
                            var resArr = JSON.stringify(response.data).split(",");
                            var stockObj = {
                                display: el.display,
                                newsLinks: [],
                            };
                            var links = void 0;
                            if (workDay === "Monday") {
                                links = resArr
                                    .map(function (el) { return el.replace(/\\/g, ""); })
                                    .filter(function (el) {
                                    return el.includes(today) ||
                                        el.includes(saturday) ||
                                        el.includes(sunday);
                                });
                            }
                            else {
                                links = resArr
                                    .map(function (el) { return el.replace(/\\/g, ""); })
                                    .filter(function (el) { return el.includes(today); });
                            }
                            // console.log(`----LINKS----`, links);
                            if (links.length > 0) {
                                var urlRegex_1 = /http[^"]*shtml/g;
                                var urls = links
                                    .map(function (el) {
                                    var match = el.match(urlRegex_1);
                                    return match ? match[0] : null;
                                })
                                    .filter(function (el) { return el !== null; });
                                stockObj.newsLinks = urls;
                            }
                            return stockObj;
                        }
                        else {
                            // Retry the request after a delay using recursion
                            console.log("Retrying request for ".concat(el.display));
                            return makeRequest_1(el);
                        }
                    })
                        .catch(function (err) {
                        // If an error occurs during the request, you can return a default value or handle it accordingly
                        console.error("----MAKE REQUEST ERROR----", err);
                        return { display: el.display, newsLinks: [] };
                    });
                };
                newsLinksPromise = Promise.all(scrapingList.map(function (el, i) {
                    return makeRequest_1(el);
                }));
                return [4 /*yield*/, newsLinksPromise];
            case 2:
                linksArr = _a.sent();
                articlesArr = linksArr.filter(function (el) { return el.newsLinks.length > 0; });
                processArticle = function (article) { return __awaiter(void 0, void 0, void 0, function () {
                    var scrapingArr, scrapingRes, arr;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Processing article: ".concat(article.display));
                                article.news = [];
                                scrapingArr = article.newsLinks.map(function (newsLink) {
                                    var httpsUrl = newsLink.replace("http", "https").replace("m", "news");
                                    return (0, getArticles_1.default)(httpsUrl, article.display);
                                });
                                return [4 /*yield*/, Promise.all(scrapingArr)];
                            case 1:
                                scrapingRes = _a.sent();
                                arr = scrapingRes.map(function (el) {
                                    return { title: el.title, article: el.article.join("").trim("") };
                                });
                                article.news = arr;
                                console.log("Finished processing article: ".concat(article.display));
                                return [2 /*return*/, article];
                        }
                    });
                }); };
                return [4 /*yield*/, Promise.all(articlesArr.map(processArticle))];
            case 3:
                processedArticles = _a.sent();
                return [2 /*return*/, processedArticles];
            case 4:
                err_1 = _a.sent();
                console.log("----IN ERR----", err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getNewsLinks = getNewsLinks;
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
