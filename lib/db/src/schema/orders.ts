import { pgTable, serial, text, integer, timestamp, pgEnum, json } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "reserved", "confirmed", "advance_paid", "prepared", "shipped", "delivered", "cancelled", "returned",
]);

export const deliveryTypeEnum = pgEnum("delivery_type", ["domicile", "bureau"]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  phone2: text("phone2"),
  address: text("address").notNull(),
  wilaya: text("wilaya"),
  items: json("items").$type<{ laptopId: number; title: string; price: number; advance: number; qty: number; isLaptop?: boolean }[]>().notNull(),
  totalPrice: integer("total_price").notNull(),
  deliveryFee: integer("delivery_fee").notNull().default(0),
  advancePaid: integer("advance_paid").notNull().default(0),
  remainingAmount: integer("remaining_amount").notNull().default(0),
  deliveryType: deliveryTypeEnum("delivery_type").notNull().default("bureau"),
  paymentMethod: text("payment_method").default("cash"),
  status: orderStatusEnum("status").notNull().default("reserved"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
