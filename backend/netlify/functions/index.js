import serverless from "serverless-http";
import { app } from "../../dist/src/index.js";

export const handler = serverless(app);
