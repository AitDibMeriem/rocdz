import { pgTable, serial, text, integer, boolean, timestamp, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const conditionEnum = pgEnum("condition", ["new", "refurbished"]);

export const laptopsTable = pgTable("laptops", {
  id: serial("id").primaryKey(),
  sku: text("sku"),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  title: text("title").notNull(),
  processor: text("processor"),
  processorSpeedMin: text("processor_speed_min"),
  processorSpeedMax: text("processor_speed_max"),
  cores: integer("cores"),
  threads: integer("threads"),
  ram: integer("ram"),
  ramType: text("ram_type"),
  storage: integer("storage"),
  storageType: text("storage_type"),
  gpu: text("gpu"),
  operatingSystem: text("operating_system"),
  screenSize: text("screen_size"),
  screenResolution: text("screen_resolution"),
  touchscreen: boolean("touchscreen"),
  batteryEstimation: text("battery_estimation"),
  weight: text("weight"),
  conditionScore: integer("condition_score"),
  conditionDescription: text("condition_description"),
  warrantyMonths: integer("warranty_months"),
  price: integer("price").notNull(),
  advance: integer("advance").notNull().default(0),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  condition: conditionEnum("condition").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  mediaUrls: json("media_urls").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLaptopSchema = createInsertSchema(laptopsTable).omit({ id: true, createdAt: true });
export type InsertLaptop = z.infer<typeof insertLaptopSchema>;
export type Laptop = typeof laptopsTable.$inferSelect;
