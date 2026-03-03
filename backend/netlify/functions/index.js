const serverless = require("serverless-http");
const { app } = require("../../dist/src/index");

module.exports.handler = serverless(app);
