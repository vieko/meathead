import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as testSchema from "@/lib/schemas/test";

const sql = neon(process.env.DATABASE_URL!);

const schema = {
  ...testSchema,
};

const db = drizzle(sql, { schema });

export { db };
