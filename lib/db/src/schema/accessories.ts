import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const accessoriesTable = pgTable("accessories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  color: text("color"),
});

export const insertAccessorySchema = createInsertSchema(accessoriesTable).omit({ id: true });
export type InsertAccessory = z.infer<typeof insertAccessorySchema>;
export type Accessory = typeof accessoriesTable.$inferSelect;
