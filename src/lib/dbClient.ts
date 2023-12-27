import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../../drizzle/schema";

export function buildDbClient() {
  const url = process.env.NEXT_TURSO_DB_URL;
  if (url === undefined) {
    throw new Error("NEXT_TURSO_DB_URL is not defined");
  }

  const authToken = process.env.NEXT_TURSO_DB_AUTH_TOKEN;
  if (authToken === undefined) {
    throw new Error("NEXT_TURSO_DB_AUTH_TOKEN is not defined");
  }

  return drizzle(createClient({ url, authToken }), { schema });
}
