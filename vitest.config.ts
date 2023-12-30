import path from "path";
import { defineConfig } from "vitest/config";

console.log(process.env.NEXT_TURSO_DB_URL);

export default defineConfig({
  envPrefix: "NEXT_",
  test: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
