import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as prototypeSchemas from '@/lib/schemas'
const sql = neon(process.env.DATABASE_URL!)

const schema = {
  ...prototypeSchemas,
}

const db = drizzle(sql, { schema })

export { db }
