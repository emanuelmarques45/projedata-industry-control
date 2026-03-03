import { Sequelize } from "sequelize";

export const sequelizeTest = new Sequelize("sqlite::memory:", {
  logging: false,
});
