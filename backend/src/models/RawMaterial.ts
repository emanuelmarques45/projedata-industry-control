import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";
import { ProductRawMaterial } from "./ProductRawMaterial.js";

export class RawMaterial extends Model {
  declare id: number;
  declare code: string;
  declare name: string;
  declare stock_quantity: number;

  declare ProductRawMaterial: ProductRawMaterial;
}

RawMaterial.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "raw_materials",
    timestamps: false,
  },
);
