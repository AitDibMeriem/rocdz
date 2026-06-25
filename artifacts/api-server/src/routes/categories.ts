import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const cats = type
      ? await db.select().from(categoriesTable).where(eq(categoriesTable.type, String(type)))
      : await db.select().from(categoriesTable).orderBy(categoriesTable.createdAt);
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
    const [created] = await db.insert(categoriesTable).values({ name, type, imageUrl: imageUrl || null }).returning();
    res.status(201).json(created);
  } catch (err: any) {
    req.log.error(err);
    if (err.code === "23505") { res.status(409).json({ error: "Category already exists" }); return; }
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, imageUrl } = req.body;
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl || null;
    const [updated] = await db.update(categoriesTable).set(updates).where(eq(categoriesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
