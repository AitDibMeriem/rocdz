import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, laptopsTable, accessoriesTable, promoCodesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

const VALID_STATUSES = [
  "reserved", "confirmed", "advance_paid", "verse", "prepared", "shipped", "delivered", "cancelled", "returned",
] as const;

router.get("/", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders.reverse());
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/track", async (req, res) => {
  try {
    const phone = String(req.query.phone || "").trim();
    if (!phone || phone.length < 9) { res.status(400).json({ error: "Numéro de téléphone invalide" }); return; }
    const all = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    const matches = all
      .filter(o => {
        const p = (o.phone || "").replace(/\s/g, "");
        const p2 = (o.phone2 || "").replace(/\s/g, "");
        const q = phone.replace(/\s/g, "");
        return p === q || p2 === q || p.endsWith(q) || q.endsWith(p);
      })
      .reverse()
      .map(o => ({
        id: o.id,
        firstName: o.firstName,
        customerName: o.customerName,
        status: o.status,
        totalPrice: o.totalPrice,
        deliveryFee: o.deliveryFee,
        advancePaid: o.advancePaid,
        remainingAmount: o.remainingAmount,
        deliveryType: o.deliveryType,
        wilaya: o.wilaya,
        items: o.items,
        promoCode: o.promoCode,
        promoDiscount: o.promoDiscount,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      }));
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

    const [created] = await db
      .insert(ordersTable)
      .values({
        firstName: firstName || "",
        lastName: lastName || "",
        customerName,
        phone,
        phone2: phone2 || null,
        address,
        wilaya,
        items,
        totalPrice: Number(totalPrice),
        deliveryFee: Number(deliveryFee) || 0,
        advancePaid: Number(advancePaid) || 0,
        remainingAmount: Number(remainingAmount) || 0,
        deliveryType: deliveryType || "bureau",
        paymentMethod,
        notes,
        promoCode: promoCode || null,
        promoDiscount: Number(promoDiscount) || 0,
      })
      .returning();

    // Decrement stock for each item
    if (Array.isArray(items)) {
      for (const item of items) {
        const qty = Number(item.qty) || 1;
        if (item.isLaptop === false) {
          const accId = item.laptopId - 100000;
          await db
            .update(accessoriesTable)
            .set({ stock: sql`GREATEST(0, ${accessoriesTable.stock} - ${qty})` })
            .where(eq(accessoriesTable.id, accId));
        } else {
          await db
            .update(laptopsTable)
            .set({ stockQuantity: sql`GREATEST(0, ${laptopsTable.stockQuantity} - ${qty})` })
            .where(eq(laptopsTable.id, item.laptopId));
        }
      }
    }

    // Increment promo code usedCount
    if (promoCode) {
      await db
        .update(promoCodesTable)
        .set({ usedCount: sql`${promoCodesTable.usedCount} + 1` })
        .where(eq(promoCodesTable.code, String(promoCode).toUpperCase()));
    }

    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

// Record a versement (deposit) for an order
router.patch("/:id/verse", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { versedAmount } = req.body;
    const amount = Number(versedAmount) || 0;

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const newRemaining = Math.max(0, (order.totalPrice || 0) - amount);
    const [updated] = await db
      .update(ordersTable)
      .set({ advancePaid: amount, remainingAmount: newRemaining, status: "verse", updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const [updated] = await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Order not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(ordersTable).where(eq(ordersTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
