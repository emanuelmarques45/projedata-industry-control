import fs from "fs";
import path from "path";
import { sequelize } from "./database.js";

async function runSeed() {
  try {
    const __dirname = import.meta.dirname;
    const seedPath = path.resolve(__dirname, "./seed.sql");
    const sql = fs.readFileSync(seedPath, "utf8");

    await sequelize.authenticate();
    await sequelize.query(sql);

    console.log("✅ Database seed executed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running seed:", error);
    process.exit(1);
  }
}

runSeed();
