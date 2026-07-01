import { Router } from "express";
import { Laptop } from "../models/laptop";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { brand, condition, minPrice, maxPrice, ram, search, inStock } = req.query;
    const filter: Record<string, unknown> = {};

    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (condition) filter.condition = condition;
    if (minPrice !== undefined || maxPrice !== undefined) {
      const p: Record<string, number> = {};
      if (minPrice !== undefined) p.$gte = Number(minPrice);
      if (maxPrice !== undefined) p.$lte = Number(maxPrice);
      filter.price = p;
    }
    if (ram !== undefined) filter.ram = Number(ram);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }
    if (inStock === "true") filter.stockQuantity = { $gte: 1 };
    else if (inStock === "false") filter.stockQuantity = 0;

    const laptops = await Laptop.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json(laptops);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const featured = await Laptop.findOne({ featured: true });
    if (!featured) { res.status(404).json({ error: "No featured laptop" }); return; }
    res.json(featured);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [result] = await Laptop.aggregate([
      {
        $group: {
          _id: null,
          totalLaptops: { $sum: 1 },
          inStock: { $sum: { $cond: [{ $gt: ["$stockQuantity", 0] }, 1, 0] } },
          newCount: { $sum: { $cond: [{ $eq: ["$condition", "new"] }, 1, 0] } },
          refurbishedCount: { $sum: { $cond: [{ $eq: ["$condition", "refurbished"] }, 1, 0] } },
          brandSet: { $addToSet: "$brand" },
        },
      },
      { $project: { _id: 0, totalLaptops: 1, inStock: 1, newCount: 1, refurbishedCount: 1, brands: { $size: "$brandSet" } } },
    ]);
    res.json(result ?? { totalLaptops: 0, inStock: 0, newCount: 0, refurbishedCount: 0, brands: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) { res.status(404).json({ error: "Laptop not found" }); return; }
    res.json(laptop);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.post("/", async (req, res) => {
  try {
    const laptop = await Laptop.create(req.body);
    res.status(201).json(laptop);
  } catch (err: any) {
    req.log.error(err);
    if (err?.name === "ValidationError") {
      res.status(400).json({ error: "Invalid laptop data", details: err.message });
    } else {
      res.status(500).json({ error: "Server error", details: err?.message });
    }
  }
});

router.patch("/:id/media", async (req, res) => {
  try {
    const { urls } = req.body as { urls: string[] };
    const updated = await Laptop.findByIdAndUpdate(req.params.id, { mediaUrls: urls }, { new: true });
    if (!updated) { res.status(404).json({ error: "Laptop not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updated = await Laptop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) { res.status(404).json({ error: "Laptop not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Laptop.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
