import { Router } from "express";
import { Order } from "../models/order";
import { Laptop } from "../models/laptop";
import { Accessory } from "../models/accessory";
import { PromoCode } from "../models/promo-code";

const router = Router();

const VALID_STATUSES = [
  "reserved", "confirmed", "advance_paid", "verse", "prepared",
  "shipped", "delivered", "cancelled", "returned",
] as const;

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/track", async (req, res) => {
  try {
    const phone = String(req.query.phone || "").trim().replace(/\s/g, "");
    if (!phone || phone.length < 9) { res.status(400).json({ error: "Numéro de téléphone invalide" }); return; }

    const all = await Order.find().sort({ createdAt: -1 });
    const matches = all.filter((o) => {
      const p = (o.get("phone") || "").replace(/\s/g, "");
      const p2 = (o.get("phone2") || "").replace(/\s/g, "");
      return p === phone || p2 === phone || p.endsWith(phone) || phone.endsWith(p);
    });
    res.json(matches);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      firstName, lastName, phone, phone2, address, wilaya, items,
      totalPrice, paymentMethod, notes, deliveryFee, advancePaid,
      remainingAmount, deliveryType, promoCode, promoDiscount,
    } = req.body;

    const customerName = `${firstName || ""} ${lastName || ""}`.trim();

    const created = await Order.create({
      firstName: firstName || "",
      lastName: lastName || "",
      customerName,
      phone,
      phone2: phone2 || null,
      address,
      wilaya,
      items: Array.isArray(items) ? items : [],
      totalPrice: Number(totalPrice),
      deliveryFee: Number(deliveryFee) || 0,
      advancePaid: Number(advancePaid) || 0,
      remainingAmount: Number(remainingAmount) || 0,
      deliveryType: deliveryType || "bureau",
      paymentMethod,
      notes,
      promoCode: promoCode || null,
      promoDiscount: Number(promoDiscount) || 0,
    });

    if (Array.isArray(items)) {
      for (const item of items) {
        const qty = Number(item.qty) || 1;
        if (item.productType === "accessory" || item.isLaptop === false) {
          const accId = item.productId || item.accessoryId;
          if (accId) await Accessory.findByIdAndUpdate(accId, { $inc: { stock: -qty } });
        } else {
          const lapId = item.productId || item.laptopId;
          if (lapId) await Laptop.findByIdAndUpdate(lapId, { $inc: { stockQuantity: -qty } });
        }
      }
    }

    if (promoCode) {
      await PromoCode.findOneAndUpdate(
        { code: String(promoCode).toUpperCase() },
        { $inc: { usedCount: 1 } },
      );
    }

    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id/verse", async (req, res) => {
  try {
    const { versedAmount } = req.body;
    const amount = Number(versedAmount) || 0;
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    const newRemaining = Math.max(0, (order.get("totalPrice") || 0) - amount);
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { advancePaid: amount, remainingAmount: newRemaining, status: "verse" },
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) { res.status(404).json({ error: "Order not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
