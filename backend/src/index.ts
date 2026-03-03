import express from "express";
import cors from "cors";

import "./models/index.js";

import productRoutes from "./routes/product/product.routes.js";
import rawMaterialRoutes from "./routes/rawMaterial/rawMaterial.routes.js";
import productionRoutes from "./routes/production/production.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/production", productionRoutes);

app.get("/health", (_req, res) => {
  return res.json({ status: "API is running" });
});

export { app };
