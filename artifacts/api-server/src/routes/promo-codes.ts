import { Router } from "express";
import { PromoCode } from "../models/promo-code";

const router = Router();

router.get("/validate", async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== "string") { res.status(400).json({ error: "Code requis" }); return; }
  try {
    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo || !promo.get("active")) { res.status(404).json({ error: "Code invalide ou expiré" }); return; }
    const expiry = promo.get("expiryDate");
    if (expiry && new Date(expiry) < new Date()) { res.status(404).json({ error: "Code expiré" }); return; }
    const limit = promo.get("usageLimit");
    const used = promo.get("usedCount");
    if (limit !== null && limit !== undefined && used >= limit) { res.status(404).json({ error: "Code épuisé (limite atteinte)" }); return; }
    res.json({ code: promo.get("code"), discountType: promo.get("discountType"), discountValue: promo.get("discountValue") });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const codes = await PromoCode.find().sort({ createdAt: 1 });
    res.json(codes);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, usageLimit, active } = req.body;
    const created = await PromoCode.create({
      code: code.toUpperCase(),
      discountType: discountType || "percent",
      discountValue: Number(discountValue),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      active: active !== false,
    });
    res.status(201).json(created);
  } catch (err: unknown) {
    req.log.error(err);
    const code = (err as Record<string, unknown>)?.code;
    if (code === 11000) { res.status(409).json({ error: "Code already exists" }); return; }
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { active, discountValue, expiryDate, usageLimit } = req.body;
    const updates: Record<string, unknown> = {};
    if (active !== undefined) updates.active = active;
    if (discountValue !== undefined) updates.discountValue = Number(discountValue);
    if (expiryDate !== undefined) updates.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (usageLimit !== undefined) updates.usageLimit = usageLimit ? Number(usageLimit) : null;
    const updated = await PromoCode.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
