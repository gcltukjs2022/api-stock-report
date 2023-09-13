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
var generateWord_1 = require("../utils/generateWord");
var getStockPrice_1 = require("../utils/getStockPrice");
var getNewsLinks_1 = require("../utils/getNewsLinks");
var moment_1 = __importDefault(require("moment"));
var fs = require("fs");
var AWS = require("aws-sdk");
function getReport(event, context, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var priceResult, scrapingList, scrapingResult, hightlightStocksArr, today, formattedDate, bucketName_1, key_1, filePath, err_1, errorResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, getStockPrice_1.getStockPrice)()];
                case 1:
                    priceResult = _a.sent();
                    scrapingList = priceResult.filter(function (el) { return el.newsParam.length > 0; });
                    return [4 /*yield*/, (0, getNewsLinks_1.getNewsLinks)(scrapingList)];
                case 2:
                    scrapingResult = _a.sent();
                    console.log("----SCRAPING COMPLETED----");
                    hightlightStocksArr = priceResult.filter(function (el) { return Math.abs(el.changePercent) >= 5; });
                    return [4 /*yield*/, (0, generateWord_1.generateWord)(hightlightStocksArr, scrapingResult, priceResult)];
                case 3:
                    _a.sent();
                    console.log("----FUNCTION END----");
                    today = (0, moment_1.default)();
                    formattedDate = today.format("DDMMYYYY");
                    bucketName_1 = "stock-report-bucket";
                    key_1 = "report".concat(formattedDate, ".docx");
                    filePath = "/tmp/report".concat(formattedDate, ".docx");
                    fs.readFile(filePath, function (err, data) {
                        if (err) {
                            console.error("Error reading the file:", err);
                            return;
                        }
                        var s3 = new AWS.S3();
                        var params = {
                            Bucket: bucketName_1,
                            Key: key_1,
                            Body: data,
                        };
                        s3.putObject(params)
                            .promise()
                            .then(function (res) {
                            return console.log("File ".concat(key_1, " uploaded to ").concat(bucketName_1));
                        });
                        return {
                            statusCode: 200,
                            body: JSON.stringify("File uploaded successfully"),
                        };
                    });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log("IN ERR: ", err_1);
                    errorResponse = {
                        statusCode: 500,
                        body: JSON.stringify({
                            success: false,
                            message: "An error occurred",
                            error: err_1.message,
                        }),
                    };
                    // Use the callback function to return the error response
                    callback(null, errorResponse);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.default = getReport;
