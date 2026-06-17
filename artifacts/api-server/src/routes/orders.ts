import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const VALID_STATUSES = ["reserved", "confirmed", "prepared", "shipped", "delivered", "cancelled", "returned"] as const;

router.get("/", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders.reverse());
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phone, phone2, address, wilaya, items, totalPrice, paymentMethod, notes } = req.body;
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
        paymentMethod,
        notes,
      })
      .returning();
    res.status(201).json(created);
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
