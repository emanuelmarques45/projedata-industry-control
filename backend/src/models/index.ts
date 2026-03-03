import { Product } from "./Product";
import { RawMaterial } from "./RawMaterial";
import { ProductRawMaterial } from "./ProductRawMaterial";

// Product <-> RawMaterial (N:N)
Product.belongsToMany(RawMaterial, {
  through: ProductRawMaterial,
  foreignKey: "product_id",
  otherKey: "raw_material_id",
});

RawMaterial.belongsToMany(Product, {
  through: ProductRawMaterial,
  foreignKey: "raw_material_id",
  otherKey: "product_id",
});

export { Product, RawMaterial, ProductRawMaterial };
