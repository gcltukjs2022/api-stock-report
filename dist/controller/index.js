"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var data_1 = require("./data");
function getStockPrice(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var symbols, options, response, resArr, priceResult, i, j, combinedObj, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("-----GET STOCK PRICE-----");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    symbols = data_1.data.map(function (el) { return el.yahooSymbol; }).join(",");
                    console.log("STAGE 1");
                    options = {
                        method: "GET",
                        url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
                        params: {
                            region: "US",
                            symbols: symbols,
                        },
                        headers: {
                            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                            "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                        },
                    };
                    return [4 /*yield*/, axios_1.default.request(options)];
                case 2:
                    response = _a.sent();
                    console.log("STAGE 2");
                    resArr = response.data.quoteResponse.result;
                    priceResult = [];
                    for (i = 0; i < resArr.length; i++) {
                        for (j = 0; j < resArr.length; j++) {
                            if (resArr[i].longName === data_1.data[j].yahooName) {
                                combinedObj = __assign({ marketPrice: resArr[i].regularMarketPrice, changePercent: resArr[i].regularMarketChangePercent }, data_1.data[j]);
                                priceResult.push(combinedObj);
                            }
                        }
                    }
                    // Scraping
                    // const browser = await puppeteer.launch();
                    // const page = await browser.newPage();
                    // for (let i = 0; i < stocksArr.length; i++) {
                    //   console.log(`IN ${[i]} LOOP ${stocksArr[i].yahoo}`);
                    //   if (stocksArr[i].yahoo.length > 0) {
                    //     const url = `https://hk.finance.yahoo.com/quote/${stocksArr[i].yahoo}`;
                    //     console.log("STAGE 1");
                    //     await page.goto(url, { timeout: 60000, waitUntil: "networkidle0" });
                    //     // const marketPrice = await page.evaluate(
                    //     //   () => document.querySelector("body #app")!.textContent,
                    //     // );
                    //     console.log("STAGE 2");
                    //     // const marketPrice = await page.evaluate(() => {
                    //     //   const element = document.querySelector(
                    //     //     `fin-streamer[data-symbol=${stocksArr[i].yahoo}][data-field="regularMarketPrice"]`,
                    //     //   );
                    //     //   return element!.textContent;
                    //     // });
                    //     // const marketPrice = await page.evaluate(() => {
                    //     // const element = document.querySelector(
                    //     //   "body #app >div #render-target-default >div #YDC-MainCanvas >div #YDC-Col1 #YD-Col1-Stack #YDC-Col1-Stack-Composite >div #mrt-node-Col1-3-QuoteHeader #Col1-3-QuoteHeader-Proxy #quote-header-info  >div >div >div fin-streamer",
                    //     // );
                    //     // await page.waitForXPath(
                    //     //   "//*[@id='quote-header-info']/div[3]/div/fin-streamer",
                    //     // );
                    //     // let elHandle = await page.$x(
                    //     //   "//*[@id='quote-header-info']/div[3]/div/fin-streamer",
                    //     // );
                    //     // let marketPrice = await page.evaluate(
                    //     //   (el) => el.textContent,
                    //     //   elHandle[0],
                    //     // );
                    //     const marketPrice = await page.evaluate(() => {
                    //       const element = document.querySelectorAll("fin-streamer");
                    //       return element;
                    //     });
                    //     // return element
                    //     // });
                    //     console.log("STAGE 3");
                    //     console.log(marketPrice);
                    //   } else {
                    //     const url = `https://m.10jqka.com.cn/stockpage/${stocksArr[i].param}/`;
                    //     await page.goto(url, { timeout: 60000, waitUntil: "networkidle0" });
                    //     // page.waitForSelector(
                    //     //   "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_curPrice",
                    //     // );
                    //     const marketPrice = await page.evaluate(
                    //       () =>
                    //         document.querySelector(
                    //           "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_curPrice",
                    //         )!.textContent,
                    //     );
                    //     console.log(marketPrice);
                    //     // page.waitForSelector(
                    //     //   "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_float_rate",
                    //     // );
                    //     const changePercentage = await page.evaluate(
                    //       () =>
                    //         document.querySelector(
                    //           "body .main-content .hexm-price-box #hexm_curPrice_color #hexm_float_rate",
                    //         )!.textContent,
                    //     );
                    //     console.log(changePercentage);
                    //     stocksArr[i]["curPrice"] = marketPrice;
                    //     stocksArr[i]["floatRate"] = changePercentage;
                    //   }
                    // }
                    res.status(200).send({
                        success: true,
                        data: {
                            priceResult: priceResult,
                        },
                    });
                    console.log("---END---");
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log("IN ERR: ", err_1);
                    res.status(400).send({
                        success: false,
                        message: "Something went wrong",
                        error: err_1,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = getStockPrice;
