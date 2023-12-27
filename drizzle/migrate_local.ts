import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const DIR = __dirname;

export default function setupDB(name: string) {
  const client = createClient({
    url: `file://${DIR}/${name}.db`,
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
