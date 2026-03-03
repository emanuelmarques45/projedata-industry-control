import request from "supertest";
import express from "express";

import productRoutes from "./product.routes.js";
import { sequelize } from "../../database.js";
import { Product } from "../../models/Product.js";
import "../../models/index.js";

const app = express();
app.use(express.json());

app.use("/products", productRoutes);

describe("Product routes", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("POST /products - should create a product", async () => {
    const response = await request(app).post("/products").send({
      code: "PR-001",
      name: "Knife",
      price: 50,
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Knife");
  });

  it("GET /products - should list products", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("GET /products/:id - should get product by id", async () => {
    const product = await Product.findOne();

    const response = await request(app).get(`/products/${product!.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Knife");
  });

  it("PUT /products/:id - should update product", async () => {
    const product = await Product.findOne();

    const response = await request(app).put(`/products/${product!.id}`).send({
      name: "Updated Knife",
      price: 60,
    });

    expect(response.status).toBe(204);

    const updated = await Product.findByPk(product!.id);
    expect(updated!.name).toBe("Updated Knife");
    expect(Number(updated!.price)).toBe(60);
  });

  it("DELETE /products/:id - should delete product", async () => {
    const product = await Product.findOne();

    const response = await request(app).delete(`/products/${product!.id}`);

    expect(response.status).toBe(204);

    const deleted = await Product.findByPk(product!.id);
    expect(deleted).toBeNull();
  });
});
