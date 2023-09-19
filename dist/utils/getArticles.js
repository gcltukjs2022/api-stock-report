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
var axios_1 = __importDefault(require("axios"));
var iconv = require("iconv-lite");
var https = require("https");
var cheerio = require("cheerio");
var getArticles = function (url, name, retry) {
    if (retry === void 0) { retry = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var userAgentList, randomIndex, randomUserAgent, config, response, decodedData, $_1, title, parentElement, pTags, article, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userAgentList = [
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
                        "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363",
                    ];
                    randomIndex = Math.floor(Math.random() * userAgentList.length);
                    randomUserAgent = userAgentList[randomIndex];
                    config = {
                        responseType: "arraybuffer",
                        headers: {
                            "User-Agent": randomUserAgent,
                        },
                        timeout: 5000,
                    };
                    // const modifiedUrl = url.replace("http", "https").replace("m", "news");
                    console.log(url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url, config)];
                case 2:
                    response = _a.sent();
                    if (response.status !== 200 && retry < 10) {
                        console.log("----".concat(name, " GET ARTICLE ERROR ON ").concat(retry, " RETRY----"), response.status);
                        return [2 /*return*/, getArticles(url, name, retry + 1)];
                    }
                    else if (retry === 10) {
                        console.log("".concat(name, " REACH RETURN EMPTY 1"));
                        return [2 /*return*/, Promise.resolve({ title: "", article: [] })];
                    }
                    else {
                        decodedData = iconv.decode(response.data, "gbk");
                        $_1 = cheerio.load(decodedData);
                        title = $_1(".main-title").text();
                        parentElement = $_1(".main-text");
                        pTags = parentElement.find("p");
                        article = pTags
                            .map(function (index, element) {
                            return $_1(element).text();
                        })
                            .get();
                        return [2 /*return*/, Promise.resolve({ title: title, article: article })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("----".concat(name, " GET ARTICLE ERROR RETRY: ").concat(retry), error_1);
                    if (retry < 10) {
                        return [2 /*return*/, getArticles(url, name, retry + 1)];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve({ title: "", article: [] })];
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
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
exports.default = getArticles;
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
