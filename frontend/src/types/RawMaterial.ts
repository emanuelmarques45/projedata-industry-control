import type { ProductRawMaterialInput } from "./ProductRawMaterialInput";

export interface RawMaterial {
  id: number;
  code: string;
  name: string;
  stock_quantity: number;
  ProductRawMaterial?: ProductRawMaterialInput;
}
