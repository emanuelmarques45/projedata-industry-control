import request from "supertest";
import express from "express";

import rawMaterialRoutes from "./rawMaterial.routes.js";
import { sequelize } from "../../database.js";
import { RawMaterial } from "../../models/RawMaterial.js";
import "../../models/index.js";

const app = express();
app.use(express.json());

app.use("/raw-materials", rawMaterialRoutes);

describe("RawMaterial routes", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("POST /raw-materials - should create a raw material", async () => {
    const response = await request(app).post("/raw-materials").send({
      code: "RM-001",
      name: "Steel",
      stock_quantity: 500,
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Steel");
  });

  it("GET /raw-materials - should list raw materials", async () => {
    const response = await request(app).get("/raw-materials");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("GET /raw-materials/:id - should get raw material by id", async () => {
    const rawMaterial = await RawMaterial.findOne();

    const response = await request(app).get(
      `/raw-materials/${rawMaterial!.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Steel");
  });

  it("PUT /raw-materials/:id - should update raw material", async () => {
    const rawMaterial = await RawMaterial.findOne();

    const response = await request(app)
      .put(`/raw-materials/${rawMaterial!.id}`)
      .send({
        stock_quantity: 300,
      });

    expect(response.status).toBe(204);

    const updated = await RawMaterial.findByPk(rawMaterial!.id);
    expect(updated!.stock_quantity).toBe(300);
  });

  it("DELETE /raw-materials/:id - should delete raw material", async () => {
    const rawMaterial = await RawMaterial.findOne();

    const response = await request(app).delete(
      `/raw-materials/${rawMaterial!.id}`,
    );

    expect(response.status).toBe(204);

    const deleted = await RawMaterial.findByPk(rawMaterial!.id);
    expect(deleted).toBeNull();
  });
});
