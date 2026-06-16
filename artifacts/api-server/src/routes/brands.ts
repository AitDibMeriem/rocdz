import { Router } from "express";
import { db } from "@workspace/db";
import { laptopsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

const BRAND_META: Record<string, { imageUrl: string; tag: string }> = {
  Dell: { imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80", tag: "Fiabilité" },
  HP: { imageUrl: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&q=80", tag: "Pro" },
  Lenovo: { imageUrl: "https://images.unsplash.com/photo-1527434065213-849f5e9607ea?w=400&q=80", tag: "Performance" },
  ASUS: { imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80", tag: "Gaming" },
  Acer: { imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", tag: "Polyvalent" },
  MSI: { imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80", tag: "Gaming" },
  Apple: { imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80", tag: "Premium" },
};

router.get("/", async (req, res) => {
  try {
    const brands = await db
      .select({
        brand: laptopsTable.brand,
        count: sql<number>`count(*)::int`,
      })
      .from(laptopsTable)
      .groupBy(laptopsTable.brand)
      .orderBy(sql`count(*) DESC`);

    const result = brands.map((b) => ({
      brand: b.brand,
      count: b.count,
      imageUrl: BRAND_META[b.brand]?.imageUrl ?? "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80",
      tag: BRAND_META[b.brand]?.tag ?? "Laptop",
    }));

    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
