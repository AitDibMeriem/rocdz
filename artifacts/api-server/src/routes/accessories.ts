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

export default router;
