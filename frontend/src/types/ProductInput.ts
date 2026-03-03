import type { RawMaterial } from "./RawMaterial";

export interface ProductInput {
  code: string;
  name: string;
  price: number;
  RawMaterials: RawMaterial[];
}
