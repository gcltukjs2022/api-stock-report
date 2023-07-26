"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var port = process.env.PORT || 3001;
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors = require("cors");
var routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
// Cors
var NODE_CORS_ALLOWED = process.env.NODE_CORS_ALLOWED;
var ARRAY_NODE_CORS_ALLOWED = NODE_CORS_ALLOWED === null || NODE_CORS_ALLOWED === void 0 ? void 0 : NODE_CORS_ALLOWED.split(",");
var corsOptions = {
    origin: ARRAY_NODE_CORS_ALLOWED,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.status(200).json({ message: "Hello World!" });
});
app.use(routes_1.default);
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(port));
});
