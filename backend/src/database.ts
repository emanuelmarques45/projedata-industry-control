import { Sequelize } from "sequelize";

const isTest = process.env.NODE_ENV === "test";

export const sequelize = isTest
  ? new Sequelize("sqlite::memory:", { logging: false })
  : new Sequelize(process.env.DB_URL!, { dialect: "postgres" });
