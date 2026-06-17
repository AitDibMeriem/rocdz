import { Router } from "express";
import { db } from "@workspace/db";
import { laptopsTable } from "@workspace/db";
import { eq, ilike, gte, lte, and, sql } from "drizzle-orm";
import {
  ListLaptopsQueryParams,
  CreateLaptopBody,
  GetLaptopParams,
  UpdateLaptopParams,
  UpdateLaptopBody,
  DeleteLaptopParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = ListLaptopsQueryParams.parse(req.query);
    const conditions = [];

    if (query.brand) {
      conditions.push(ilike(laptopsTable.brand, `%${query.brand}%`));
    }
    if (query.condition) {
      conditions.push(eq(laptopsTable.condition, query.condition as "new" | "refurbished"));
    }
    if (query.minPrice !== undefined) {
      conditions.push(gte(laptopsTable.price, query.minPrice));
    }
    if (query.maxPrice !== undefined) {
      conditions.push(lte(laptopsTable.price, query.maxPrice));
    }
    if (query.ram !== undefined) {
      conditions.push(eq(laptopsTable.ram, query.ram));
    }
    if (query.search) {
      conditions.push(
        sql`(${laptopsTable.title} ILIKE ${`%${query.search}%`} OR ${laptopsTable.brand} ILIKE ${`%${query.search}%`} OR ${laptopsTable.model} ILIKE ${`%${query.search}%`})`
      );
    }
    if (query.inStock !== undefined) {
      if (query.inStock) {
        conditions.push(gte(laptopsTable.stockQuantity, 1));
      } else {
        conditions.push(eq(laptopsTable.stockQuantity, 0));
      }
    }

    const laptops = await db
      .select()
      .from(laptopsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${laptopsTable.featured} DESC, ${laptopsTable.createdAt} DESC`);

    res.json(laptops);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid query parameters" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const [featured] = await db
      .select()
      .from(laptopsTable)
      .where(eq(laptopsTable.featured, true))
      .limit(1);

    if (!featured) {
      res.status(404).json({ error: "No featured laptop" });
      return;
    }
    res.json(featured);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [stats] = await db
      .select({
        totalLaptops: sql<number>`count(*)::int`,
        inStock: sql<number>`sum(case when ${laptopsTable.stockQuantity} > 0 then 1 else 0 end)::int`,
        newCount: sql<number>`sum(case when ${laptopsTable.condition} = 'new' then 1 else 0 end)::int`,
        refurbishedCount: sql<number>`sum(case when ${laptopsTable.condition} = 'refurbished' then 1 else 0 end)::int`,
        brands: sql<number>`count(distinct ${laptopsTable.brand})::int`,
      })
      .from(laptopsTable);

    res.json(stats ?? { totalLaptops: 0, inStock: 0, newCount: 0, refurbishedCount: 0, brands: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetLaptopParams.parse({ id: Number(req.params.id) });
    const [laptop] = await db.select().from(laptopsTable).where(eq(laptopsTable.id, id)).limit(1);
    if (!laptop) {
      res.status(404).json({ error: "Laptop not found" });
      return;
    }
    res.json(laptop);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateLaptopBody.parse(req.body);
    const [created] = await db.insert(laptopsTable).values(body as any).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid laptop data" });
  }
});

router.patch("/:id/media", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { urls } = req.body as { urls: string[] };
    const [updated] = await db
      .update(laptopsTable)
      .set({ mediaUrls: urls })
      .where(eq(laptopsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Laptop not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = UpdateLaptopParams.parse({ id: Number(req.params.id) });
    const body = UpdateLaptopBody.parse(req.body);
    const [updated] = await db
      .update(laptopsTable)
      .set(body as any)
      .where(eq(laptopsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Laptop not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = DeleteLaptopParams.parse({ id: Number(req.params.id) });
    await db.delete(laptopsTable).where(eq(laptopsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
