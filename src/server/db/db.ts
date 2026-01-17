import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres("postgres://pguser:example@localhost:5432/testdb");
const db = drizzle(queryClient, { schema });

export { db };
