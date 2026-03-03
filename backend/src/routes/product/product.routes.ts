import { Router } from "express";
import { Product } from "../../models/Product.js";
import { RawMaterial } from "../../models/RawMaterial.js";
import { sequelize } from "../../database.js";
import { ProductRawMaterial } from "../../models/index.js";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { RawMaterials, code, ...productData } = req.body;

    const existingProduct = await Product.findOne({ where: { code } });
    if (existingProduct) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Product with code '${code}' already exists.`,
      });
    }

    const product = await Product.create(
      { code, ...productData },
      { transaction },
    );

    // associate raw materials if provided and non-empty
    if (RawMaterials && RawMaterials.length > 0) {
      for (const rm of RawMaterials) {
        // validation: ensure ProductRawMaterial object exists with quantity
        if (
          !rm.ProductRawMaterial ||
          typeof rm.ProductRawMaterial.required_quantity !== "number"
        ) {
          await transaction.rollback();
          return res.status(400).json({
            message:
              "Each raw material entry must include ProductRawMaterial.required_quantity",
          });
        }

        await product.addRawMaterial(rm.id, {
          through: {
            required_quantity: rm.ProductRawMaterial.required_quantity,
          },
          transaction,
        });
      }
    }

    await transaction.commit();
    return res.status(201).json(product);
  } catch (err) {
    await transaction.rollback();
    return res
      .status(400)
      .json({ message: "Erro ao criar produto", error: err });
  }
});

// READ ALL
router.get("/", async (_req, res) => {
  try {
    const products = await Product.findAll({
      include: RawMaterial,
    });
    return res.json(products);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: err });
  }
});

// READ BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: RawMaterial,
    });
    if (!product)
      return res.status(404).json({ message: "Produto não encontrado" });
    return res.json(product);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar produto", error: err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Produto não encontrado" });

    const { RawMaterials, code, ...productData } = req.body;

    if (code && code !== product.code) {
      const existing = await Product.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({
          message: `Product with code '${code}' already exists.`,
        });
      }
    }

    await product.update({ code, ...productData });

    await ProductRawMaterial.destroy({
      where: { product_id: product.id },
    });

    if (RawMaterials && RawMaterials.length > 0) {
      for (const rm of RawMaterials) {
        if (
          !rm.ProductRawMaterial ||
          typeof rm.ProductRawMaterial.required_quantity !== "number"
        ) {
          return res.status(400).json({
            message:
              "Each raw material entry must include ProductRawMaterial.required_quantity",
          });
        }

        await product.addRawMaterial(rm.id, {
          through: {
            required_quantity: rm.ProductRawMaterial.required_quantity,
          },
        });
      }
    }

    return res.sendStatus(204);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Erro ao atualizar produto", error: err });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ message: "Produto não encontrado" });
    return res.sendStatus(204);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao deletar produto", error: err });
  }
});

// ASSOCIATE RAW MATERIAL
router.post("/:productId/raw-materials/:rawMaterialId", async (req, res) => {
  const { productId, rawMaterialId } = req.params;
  const { requiredQuantity } = req.body;

  if (!requiredQuantity || requiredQuantity <= 0) {
    return res.status(400).json({ message: "Quantidade requerida inválida" });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    const rawMaterial = await RawMaterial.findByPk(rawMaterialId);
    if (!rawMaterial) {
      return res.status(404).json({ message: "Matéria-prima não encontrada" });
    }

    const existing = await product.hasRawMaterial(rawMaterial);
    if (existing) {
      return res
        .status(409)
        .json({ message: "Matéria-prima já associada a este produto" });
    }

    await product.addRawMaterial(rawMaterial, {
      through: { required_quantity: requiredQuantity },
    });

    return res.status(201).json({
      message: "Matéria-prima associada ao produto com sucesso",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao associar matéria-prima", error: err });
  }
});

export default router;
