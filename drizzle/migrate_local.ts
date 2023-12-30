import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export default function setupDB() {
  const client = createClient({
    url: process.env.NEXT_TURSO_DB_URL as string,
  });

  const db = drizzle(client);

  async function doMigration() {
    try {
      await migrate(db, {
        migrationsFolder: "drizzle/migrations",
      });
      console.log("Tables migrated!");
    } catch (error) {
      console.error("Error performing migration: ", error);
    }
  }

  return {
    db,
    client,
    doMigration,
  };
}
