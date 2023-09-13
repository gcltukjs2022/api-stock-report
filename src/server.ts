import getReport from "./controller";

const serverless = require("serverless-http");

module.exports.handler = serverless(getReport);
