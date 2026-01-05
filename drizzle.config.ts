import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "127.0.0.1",
    port: 5432,
    user: "pguser",
    database: "testdb",
    password: "example",
    ssl: false,
  },
  verbose: true,
  strict: true,
});
