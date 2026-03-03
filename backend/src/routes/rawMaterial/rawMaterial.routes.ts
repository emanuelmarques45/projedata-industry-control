import { Router } from "express";
import { RawMaterial } from "../../models/RawMaterial";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    if (!req.body.code || !req.body.name || req.body.stock_quantity == null) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    if (req.body.stock_quantity < 0) {
      return res
        .status(400)
        .json({ message: "Quantidade em estoque inválida" });
    }

    const rawMaterial = await RawMaterial.create(req.body);
    return res.status(201).json(rawMaterial);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao criar matéria-prima", error: err });
  }
});

// READ ALL
router.get("/", async (_req, res) => {
  try {
    const rawMaterials = await RawMaterial.findAll();
    return res.json(rawMaterials);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar matérias-primas", error: err });
  }
});

// READ BY ID
router.get("/:id", async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findByPk(req.params.id);
    if (!rawMaterial)
      return res.status(404).json({ message: "Matéria-prima não encontrada" });
    return res.json(rawMaterial);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar matéria-prima", error: err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await RawMaterial.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated)
      return res.status(404).json({ message: "Matéria-prima não encontrada" });
    return res.sendStatus(204);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Erro ao atualizar matéria-prima", error: err });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await RawMaterial.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ message: "Matéria-prima não encontrada" });
    return res.sendStatus(204);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao deletar matéria-prima", error: err });
  }
});

export default router;
