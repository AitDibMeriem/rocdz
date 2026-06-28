import { db } from "@workspace/db";
import { laptopsTable, accessoriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
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

async function migrateTable(
  tableName: string,
  table: typeof laptopsTable | typeof accessoriesTable,
  urlMap: Record<string, string>,
) {
  let fixed = 0;
  let nulled = 0;

  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    const result = await db.execute(
      sql`UPDATE ${sql.raw(tableName)} SET image_url = ${newUrl} WHERE image_url = ${oldUrl}`,
    );
    const count = (result as unknown as { rowCount?: number }).rowCount ?? 0;
    if (count > 0) {
      logger.info({ tableName, oldUrl, newUrl, count }, "Migrated image URL");
      fixed += count;
    }
  }

  // Null out any remaining /api/uploads/ URLs that have no known mapping (files don't exist in production)
  const nullResult = await db.execute(
    sql`UPDATE ${sql.raw(tableName)} SET image_url = NULL WHERE image_url LIKE '/api/uploads/%'`,
  );
  nulled = (nullResult as unknown as { rowCount?: number }).rowCount ?? 0;
  if (nulled > 0) {
    logger.warn({ tableName, nulled }, "Cleared unmapped local upload URLs (files missing in production)");
  }

  return { fixed, nulled };
}

export async function runStartupMigration() {
  try {
    const laptops = await migrateTable("laptops", laptopsTable, LAPTOP_URL_MAP);
    const accessories = await migrateTable("accessories", accessoriesTable, ACCESSORY_URL_MAP);
    const total = laptops.fixed + accessories.fixed + laptops.nulled + accessories.nulled;
    if (total > 0) {
      logger.info({ laptops, accessories }, "Startup image migration complete");
    }
  } catch (err) {
    logger.error({ err }, "Startup migration failed — continuing server startup");
  }
}
