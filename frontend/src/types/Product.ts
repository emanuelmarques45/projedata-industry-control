import type { RawMaterial } from "./RawMaterial";

export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  RawMaterials: RawMaterial[];
}
