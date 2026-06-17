import { pgTable, serial, text, integer, timestamp, pgEnum, json } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "reserved", "confirmed", "prepared", "shipped", "delivered", "cancelled", "returned",
]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  wilaya: text("wilaya"),
  items: json("items").$type<{ laptopId: number; title: string; price: number; qty: number }[]>().notNull(),
  totalPrice: integer("total_price").notNull(),
  paymentMethod: text("payment_method").default("cash"),
  status: orderStatusEnum("status").notNull().default("reserved"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
