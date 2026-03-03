import {
  DataTypes,
  Model,
  type BelongsToManyAddAssociationMixin,
  type BelongsToManySetAssociationsMixin,
  type HasManyHasAssociationMixin,
} from "sequelize";
import { sequelize } from "../database.js";
import { RawMaterial } from "./RawMaterial.js";

export class Product extends Model {
  declare id: number;
  declare code: string;
  declare name: string;
  declare price: number;

  declare RawMaterials: RawMaterial[];
  declare addRawMaterial: BelongsToManyAddAssociationMixin<RawMaterial, number>;
  declare setRawMaterials: BelongsToManySetAssociationsMixin<
    RawMaterial,
    number
  >;
  declare hasRawMaterial: HasManyHasAssociationMixin<RawMaterial, number>;
}

Product.init(
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: false,
  },
);
