import request from "supertest";
import express from "express";
import productionRoutes from "./production.routes";
import { sequelize } from "../../database";
import { Product } from "../../models/Product";
import { RawMaterial } from "../../models/RawMaterial";
import { ProductRawMaterial } from "../../models/ProductRawMaterial";

import "../../models";

const app = express();
app.use(express.json());
app.use("/production", productionRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Raw materials
  const steel = await RawMaterial.create({
    code: "001",
    name: "Steel",
    stock_quantity: 500,
  });

  const rubber = await RawMaterial.create({
    code: "002",
    name: "Rubber",
    stock_quantity: 100,
  });

  const plastic = await RawMaterial.create({
    code: "003",
    name: "Plastic",
    stock_quantity: 200,
  });

  // Product
  const knife = await Product.create({
    code: "001",
    name: "Knife",
    price: 50,
  });

  await ProductRawMaterial.bulkCreate([
    {
      product_id: knife.id,
      raw_material_id: steel.id,
      required_quantity: 3,
    },
    {
      product_id: knife.id,
      raw_material_id: rubber.id,
      required_quantity: 1,
    },
    {
      product_id: knife.id,
      raw_material_id: plastic.id,
      required_quantity: 1,
    },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /production/suggestion", () => {
  it("should suggest Knife with correct max quantity", async () => {
    const response = await request(app).get("/production/suggestion");

    expect(response.status).toBe(200);

    const { products, totalValue } = response.body;

    expect(products.length).toBe(1);
    expect(products[0].productName).toBe("Knife");
    expect(products[0].quantity).toBe(100);
    expect(totalValue).toBe(5000);
  });
});
