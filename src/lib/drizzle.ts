import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as protypeSchema from '@/lib/schemas'

const sql = neon(process.env.DATABASE_URL!)

const schema = {
  ...protypeSchema,
}

const db = drizzle(sql, { schema })

export { db }
