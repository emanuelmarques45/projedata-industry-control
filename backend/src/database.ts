import { Sequelize } from "sequelize";
import pg from "pg";

// const isTest = process.env.NODE_ENV === "test";

// export const sequelize = isTest
//   ? new Sequelize("sqlite::memory:", { logging: false })
//   : new Sequelize(process.env.DB_URL!, { dialect: "postgres" });

export const sequelize = new Sequelize(process.env.DB_URL!, {
  dialect: "postgres",
  dialectModule: pg,
  pool: {
    max: 1,
    min: 0,
    idle: 10000,
  },
});
