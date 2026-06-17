import { Router } from "express";
import { db } from "@workspace/db";
import { accessoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListAccessoriesQueryParams, CreateAccessoryBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = ListAccessoriesQueryParams.parse(req.query);
    const accessories = query.category
      ? await db.select().from(accessoriesTable).where(eq(accessoriesTable.category, query.category))
      : await db.select().from(accessoriesTable);
    res.json(accessories);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid query" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateAccessoryBody.parse(req.body);
    const [created] = await db.insert(accessoriesTable).values(body).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid accessory data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, category, description, price, stock, imageUrl, color } = req.body;
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (stock !== undefined) updates.stock = Number(stock);
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (color !== undefined) updates.color = color;
    const [updated] = await db.update(accessoriesTable).set(updates).where(eq(accessoriesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Accessory not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(accessoriesTable).where(eq(accessoriesTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
