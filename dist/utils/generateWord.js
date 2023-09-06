"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWord = void 0;
var docx_1 = require("docx");
var fs = __importStar(require("fs"));
var moment_1 = __importDefault(require("moment"));
var path_1 = __importDefault(require("path"));
var convertDocToBase64_1 = require("./convertDocToBase64");
var generateWord = function (hightlightStocksArr, scrapingResult, priceResult) { return __awaiter(void 0, void 0, void 0, function () {
    var hightLightStocksParagraphs, currentDate, currentDayOfMonth, i, articlesParagraphs, i, articles, display, j, firstRow, tableArr, i, doc, filePath, base64Doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hightLightStocksParagraphs = [];
                console.log("----IN GEN WORD---");
                currentDate = new Date();
                currentDayOfMonth = currentDate.getDate();
                for (i = 0; i < hightlightStocksArr.length; i++) {
                    if (currentDayOfMonth === 1) {
                        hightLightStocksParagraphs.push(new docx_1.Paragraph({
                            children: [
                                new docx_1.TextRun({
                                    text: "".concat(hightlightStocksArr[i].display, " ").concat(hightlightStocksArr[i].currency === "USD"
                                        ? (0, moment_1.default)(new Date()).subtract(1, "month").format("M")
                                        : (0, moment_1.default)(new Date()).format("M"), " \u6708 ").concat(hightlightStocksArr[i].currency === "USD"
                                        ? (0, moment_1.default)(new Date()).subtract(1, "day").format("D")
                                        : (0, moment_1.default)(new Date()).format("D"), " \u65E5 ").concat(hightlightStocksArr[i].changePercent > 0 ? "涨幅" : "跌幅", "  ").concat(Math.abs(hightlightStocksArr[i].changePercent).toFixed(1), "%, \u6536\u76D8\u4EF7 ").concat(hightlightStocksArr[i].marketPrice, " ").concat(hightlightStocksArr[i].currency === "USD"
                                        ? "美元"
                                        : hightlightStocksArr[i].currency === "HKD"
                                            ? "港币"
                                            : hightlightStocksArr[i].currency === "SGD"
                                                ? "新加坡元"
                                                : "元"),
                                    bold: true,
                                    highlight: "yellow",
                                }),
                            ],
                        }));
                    }
                    else {
                        hightLightStocksParagraphs.push(new docx_1.Paragraph({
                            children: [
                                new docx_1.TextRun({
                                    text: "".concat(hightlightStocksArr[i].display, " ").concat((0, moment_1.default)(new Date()).format("M"), " \u6708 ").concat(hightlightStocksArr[i].currency === "USD"
                                        ? (0, moment_1.default)(new Date()).subtract(1, "day").format("D")
                                        : (0, moment_1.default)(new Date()).format("D"), " \u65E5 ").concat(hightlightStocksArr[i].changePercent > 0 ? "涨幅" : "跌幅", "  ").concat(Math.abs(hightlightStocksArr[i].changePercent).toFixed(1), "%, \u6536\u76D8\u4EF7 ").concat(hightlightStocksArr[i].marketPrice, " ").concat(hightlightStocksArr[i].currency === "USD"
                                        ? "美元"
                                        : hightlightStocksArr[i].currency === "HKD"
                                            ? "港币"
                                            : hightlightStocksArr[i].currency === "SGD"
                                                ? "新加坡元"
                                                : "元"),
                                    bold: true,
                                    highlight: "yellow",
                                }),
                            ],
                        }));
                    }
                }
                articlesParagraphs = [];
                for (i = 0; i < scrapingResult.length; i++) {
                    articles = [];
                    display = [
                        new docx_1.Paragraph({
                            children: [],
                        }),
                        new docx_1.Paragraph({
                            children: [
                                new docx_1.TextRun({
                                    text: scrapingResult[i].display,
                                    bold: true,
                                    highlight: "yellow",
                                }),
                            ],
                        }),
                    ];
                    for (j = 0; j < scrapingResult[i].news.length; j++) {
                        articles.push(new docx_1.Paragraph({
                            children: [
                                new docx_1.TextRun({ text: scrapingResult[i].news[j].title, bold: true }),
                            ],
                        }), new docx_1.Paragraph({
                            children: [new docx_1.TextRun(scrapingResult[i].news[j].article)],
                        }), new docx_1.Paragraph({
                            children: [],
                        }));
                    }
                    articlesParagraphs.push.apply(articlesParagraphs, __spreadArray(__spreadArray([], display, false), articles, false));
                }
                firstRow = new docx_1.Table({
                    columnWidths: [901, 901, 901, 901, 5406],
                    rows: [
                        new docx_1.TableRow({
                            children: [
                                new docx_1.TableCell({
                                    width: {
                                        size: 901,
                                        type: docx_1.WidthType.DXA,
                                    },
                                    children: [new docx_1.Paragraph("Project")],
                                }),
                                new docx_1.TableCell({
                                    width: {
                                        size: 901,
                                        type: docx_1.WidthType.DXA,
                                    },
                                    children: [new docx_1.Paragraph("ADR / Shares")],
                                }),
                                new docx_1.TableCell({
                                    width: {
                                        size: 901,
                                        type: docx_1.WidthType.DXA,
                                    },
                                    children: [new docx_1.Paragraph("Listing Ticker")],
                                }),
                                new docx_1.TableCell({
                                    width: {
                                        size: 901,
                                        type: docx_1.WidthType.DXA,
                                    },
                                    children: [new docx_1.Paragraph("Local CCY")],
                                }),
                                new docx_1.TableCell({
                                    width: {
                                        size: 5406,
                                        type: docx_1.WidthType.DXA,
                                    },
                                    children: [new docx_1.Paragraph("Combine")],
                                }),
                            ],
                            height: {
                                value: 700,
                                rule: docx_1.HeightRule.EXACT,
                            },
                        }),
                    ],
                });
                tableArr = [];
                for (i = 0; i < priceResult.length; i++) {
                    if (currentDayOfMonth === 1) {
                        tableArr.push(new docx_1.Table({
                            columnWidths: [901, 901, 901, 901, 5406],
                            rows: [
                                new docx_1.TableRow({
                                    children: [
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].name)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].type)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].ticker)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].currency)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 5406,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [
                                                new docx_1.Paragraph("".concat(priceResult[i].display, " ").concat(priceResult[i].currency === "USD"
                                                    ? (0, moment_1.default)(new Date()).subtract(1, "month").format("M")
                                                    : (0, moment_1.default)(new Date()).format("M"), " \u6708 ").concat(priceResult[i].currency === "USD"
                                                    ? (0, moment_1.default)(new Date()).subtract(1, "day").format("D")
                                                    : (0, moment_1.default)(new Date()).format("D"), " \u65E5 ").concat(priceResult[i].changePercent > 0 ? "涨幅" : "跌幅", " ").concat(Math.round(priceResult[i].changePercent), "%, \u6536\u76D8\u4EF7 ").concat(priceResult[i].marketPrice, " ").concat(priceResult[i].currency === "USD"
                                                    ? "美元"
                                                    : priceResult[i].currency === "HKD"
                                                        ? "港币"
                                                        : priceResult[i].currency === "SGD"
                                                            ? "新加坡元"
                                                            : "元")),
                                            ],
                                        }),
                                    ],
                                    height: {
                                        value: 800,
                                        rule: docx_1.HeightRule.EXACT,
                                    },
                                }),
                            ],
                        }));
                    }
                    else {
                        tableArr.push(new docx_1.Table({
                            columnWidths: [901, 901, 901, 901, 5406],
                            rows: [
                                new docx_1.TableRow({
                                    children: [
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].name)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].type)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].ticker)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 901,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [new docx_1.Paragraph(priceResult[i].currency)],
                                        }),
                                        new docx_1.TableCell({
                                            width: {
                                                size: 5406,
                                                type: docx_1.WidthType.DXA,
                                            },
                                            children: [
                                                new docx_1.Paragraph("".concat(priceResult[i].display, " ").concat((0, moment_1.default)(new Date()).format("M"), " \u6708 ").concat(priceResult[i].currency === "USD"
                                                    ? (0, moment_1.default)(new Date()).subtract(1, "day").format("D")
                                                    : (0, moment_1.default)(new Date()).format("D"), " \u65E5 ").concat(priceResult[i].changePercent > 0 ? "涨幅" : "跌幅", " ").concat(Math.abs(Math.round(priceResult[i].changePercent)), "%, \u6536\u76D8\u4EF7 ").concat(priceResult[i].marketPrice, " ").concat(priceResult[i].currency === "USD"
                                                    ? "美元"
                                                    : priceResult[i].currency === "HKD"
                                                        ? "港币"
                                                        : priceResult[i].currency === "SGD"
                                                            ? "新加坡元"
                                                            : "元")),
                                            ],
                                        }),
                                    ],
                                    height: {
                                        value: 800,
                                        rule: docx_1.HeightRule.EXACT,
                                    },
                                }),
                            ],
                        }));
                    }
                }
                doc = new docx_1.Document({
                    sections: [
                        {
                            children: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun("Please find attached the listed share price summary as of "),
                                        new docx_1.TextRun({
                                            text: "".concat((0, moment_1.default)(new Date()).format("YYYY.MM.DD.")),
                                            highlight: "yellow",
                                        }),
                                    ],
                                }),
                                new docx_1.Paragraph({
                                    children: [],
                                }),
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun("Below please also find public news which is relevant to the stocks or banks during the day: "),
                                    ],
                                }),
                                new docx_1.Paragraph({
                                    children: [],
                                }),
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: "项目相关",
                                            bold: true,
                                            highlight: "yellow",
                                        }),
                                    ],
                                })
                            ], hightLightStocksParagraphs, true), [
                                new docx_1.Paragraph({
                                    children: [],
                                })
                            ], false), articlesParagraphs, true), [
                                new docx_1.Paragraph({
                                    children: [],
                                }),
                                firstRow
                            ], false), tableArr, true),
                        },
                    ],
                });
                filePath = path_1.default.join("/tmp", "report.docx");
                return [4 /*yield*/, docx_1.Packer.toBuffer(doc).then(function (buffer) {
                        fs.writeFileSync(filePath, buffer, { encoding: "binary" });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, convertDocToBase64_1.convertDocToBase64)()];
            case 2:
                base64Doc = _a.sent();
                return [2 /*return*/, base64Doc];
        }
    });
}); };
exports.generateWord = generateWord;
