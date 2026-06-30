import { Router } from "express";
import { Accessory } from "../models/accessory";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: String(category) } : {};
    const accessories = await Accessory.find(filter);
    res.json(accessories);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Accessory.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid accessory data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updates: Record<string, unknown> = {};
    const { name, category, description, price, salePrice, stock, imageUrl, color, brand, warranty, compatibility, specifications } = req.body;
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (salePrice !== undefined) updates.salePrice = salePrice === null || salePrice === "" ? null : Number(salePrice);
    if (stock !== undefined) updates.stock = Number(stock);
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (color !== undefined) updates.color = color;
    if (brand !== undefined) updates.brand = brand || null;
    if (warranty !== undefined) updates.warranty = warranty || null;
    if (compatibility !== undefined) updates.compatibility = compatibility || null;
    if (specifications !== undefined) updates.specifications = specifications || null;

    const updated = await Accessory.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) { res.status(404).json({ error: "Accessory not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Accessory.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
