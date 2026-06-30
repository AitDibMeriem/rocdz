import { Router } from "express";
import { Category } from "../models/category";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type: String(type) } : {};
    const cats = await Category.find(filter).sort({ createdAt: 1 });
    res.json(cats);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, type, imageUrl } = req.body;
    if (!name || !type) { res.status(400).json({ error: "name and type required" }); return; }
    const created = await Category.create({ name, type, imageUrl: imageUrl || null });
    res.status(201).json(created);
  } catch (err: unknown) {
    req.log.error(err);
    const code = (err as Record<string, unknown>)?.code;
    if (code === 11000) { res.status(409).json({ error: "Category already exists" }); return; }
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl || null;
    const updated = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
