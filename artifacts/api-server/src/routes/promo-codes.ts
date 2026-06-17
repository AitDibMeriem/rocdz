import { Router } from "express";
import { db } from "@workspace/db";
import { promoCodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const codes = await db.select().from(promoCodesTable).orderBy(promoCodesTable.createdAt);
    res.json(codes);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, usageLimit, active } = req.body;
    const [created] = await db
      .insert(promoCodesTable)
      .values({
        code: code.toUpperCase(),
        discountType: discountType || "percent",
        discountValue: Number(discountValue),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        active: active !== false,
      })
      .returning();
    res.status(201).json(created);
  } catch (err: any) {
    req.log.error(err);
    if (err.code === "23505") {
      res.status(409).json({ error: "Code already exists" });
      return;
    }
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { active, discountValue, expiryDate, usageLimit } = req.body;
    const updates: Record<string, any> = {};
    if (active !== undefined) updates.active = active;
    if (discountValue !== undefined) updates.discountValue = Number(discountValue);
    if (expiryDate !== undefined) updates.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (usageLimit !== undefined) updates.usageLimit = usageLimit ? Number(usageLimit) : null;
    const [updated] = await db.update(promoCodesTable).set(updates).where(eq(promoCodesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(promoCodesTable).where(eq(promoCodesTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
