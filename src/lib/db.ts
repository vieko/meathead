import { neon } from "@neondatabase/serverless";

export async function checkDbConnection() {
  if (!process.env.DATABASE_URL) {
    return "No DATABASE_URL environment variable";
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT version()`;
    console.log("Pg version:", result);
    return "DB connected";
  } catch (error) {
    console.error("==> Error connecting to DB:", error);
    return "DB not connected";
  }
}
