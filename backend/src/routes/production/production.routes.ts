import { Router } from "express";
import { Product } from "../../models/Product";
import { RawMaterial } from "../../models/RawMaterial";

const router = Router();

router.get("/suggestion", async (_req, res) => {
  const products = await Product.findAll({
    include: [
      {
        model: RawMaterial,
        through: {
          attributes: ["required_quantity"],
        },
      },
    ],
    order: [["price", "DESC"]],
  });

  const rawMaterials = await RawMaterial.findAll();
  const stockMap = new Map<number, number>();

  rawMaterials.forEach((rm) => {
    stockMap.set(rm.id, rm.stock_quantity);
  });

  const result: any[] = [];
  let totalValue = 0;

  for (const product of products) {
    let maxQuantity = Infinity;

    for (const rm of product.RawMaterials) {
      const available = stockMap.get(rm.id) || 0;
      const required = rm.ProductRawMaterial.required_quantity;

      maxQuantity = Math.min(maxQuantity, Math.floor(available / required));
    }

    if (maxQuantity > 0 && maxQuantity !== Infinity) {
      result.push({
        productId: product.id,
        productName: product.name,
        quantity: maxQuantity,
        unitPrice: product.price,
        total: maxQuantity * Number(product.price),
      });

      totalValue += maxQuantity * Number(product.price);

      for (const rm of product.RawMaterials) {
        stockMap.set(
          rm.id,
          (stockMap.get(rm.id) || 0) -
            rm.ProductRawMaterial.required_quantity * maxQuantity,
        );
      }
    }
  }

  return res.json({
    products: result,
    totalValue,
  });
});

export default router;
