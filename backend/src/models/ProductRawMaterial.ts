import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export class ProductRawMaterial extends Model {
  declare id: number;
  declare product_id: number;
  declare raw_material_id: number;
  declare required_quantity: number;
}

ProductRawMaterial.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    raw_material_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    required_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "product_raw_materials",
    timestamps: false,
  },
);
