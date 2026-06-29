import { db } from "@workspace/db";
import { laptopsTable, accessoriesTable } from "@workspace/db";
import { eq, like } from "drizzle-orm";
import { logger } from "./logger";

const LAPTOP_URL_MAP: Record<string, string> = {
  "/api/uploads/1781714734685-860914759.png": "/api/storage/objects/uploads/c8125b90-1698-42c1-8191-3d189f4ab4a7",
  "/api/uploads/1781714859106-952249160.png": "/api/storage/objects/uploads/853b5f0a-10d0-402f-8d62-4d6886257ddc",
  "/api/uploads/1781715191730-281928641.png": "/api/storage/objects/uploads/0bd45856-eb8b-4a95-9304-9b6b0c63c5a2",
};

const ACCESSORY_URL_MAP: Record<string, string> = {
  "/api/uploads/1781714785174-295267265.png": "/api/storage/objects/uploads/4517d5cc-d19a-4157-8fad-dcd40a114082",
  "/api/uploads/1781714951019-26220688.png":  "/api/storage/objects/uploads/fb5606f8-2745-456a-b51b-08a379809123",
  "/api/uploads/1781787405854-611754977.jpg": "/api/storage/objects/uploads/218ba505-810a-4176-a69a-a9a3b9c3dc72",
  "/api/uploads/1782393716773-255154417.png": "/api/storage/objects/uploads/d0abe59c-763c-42b8-9932-48150271aaa1",
};

export async function runStartupMigration(): Promise<void> {
  try {
    // Fix laptops
    for (const [oldUrl, newUrl] of Object.entries(LAPTOP_URL_MAP)) {
      const rows = await db
        .update(laptopsTable)
        .set({ imageUrl: newUrl })
        .where(eq(laptopsTable.imageUrl, oldUrl))
        .returning({ id: laptopsTable.id });
      if (rows.length > 0) {
        logger.info({ ids: rows.map((r) => r.id), newUrl }, "Migrated laptop image URL");
      }
    }
    // Clear any remaining unmapped /api/uploads/ URLs (files don't exist in production)
    const nulledLaptops = await db
      .update(laptopsTable)
      .set({ imageUrl: null })
      .where(like(laptopsTable.imageUrl, "/api/uploads/%"))
      .returning({ id: laptopsTable.id });
    if (nulledLaptops.length > 0) {
      logger.warn({ ids: nulledLaptops.map((r) => r.id) }, "Cleared unmapped laptop upload URLs");
    }

    // Fix accessories
    for (const [oldUrl, newUrl] of Object.entries(ACCESSORY_URL_MAP)) {
      const rows = await db
        .update(accessoriesTable)
        .set({ imageUrl: newUrl })
        .where(eq(accessoriesTable.imageUrl, oldUrl))
        .returning({ id: accessoriesTable.id });
      if (rows.length > 0) {
        logger.info({ ids: rows.map((r) => r.id), newUrl }, "Migrated accessory image URL");
      }
    }
    // Clear unmapped accessory upload URLs
    const nulledAcc = await db
      .update(accessoriesTable)
      .set({ imageUrl: null })
      .where(like(accessoriesTable.imageUrl, "/api/uploads/%"))
      .returning({ id: accessoriesTable.id });
    if (nulledAcc.length > 0) {
      logger.warn({ ids: nulledAcc.map((r) => r.id) }, "Cleared unmapped accessory upload URLs");
    }
  } catch (err) {
    logger.error({ err }, "Startup migration failed — server continues normally");
  }
}
