import express from "express";
import cors from "cors";

import { sequelize } from "./database";

import "./models";

import productRoutes from "./routes/product/product.routes";
import rawMaterialRoutes from "./routes/rawMaterial/rawMaterial.routes";
import productionRoutes from "./routes/production/production.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/production", productionRoutes);

app.get("/health", (_req, res) => {
  return res.json({ status: "API is running" });
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

export default app;
