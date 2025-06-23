import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
const sql = neon(process.env.DATABASE_URL!)

const schema = {}

const db = drizzle(sql, { schema })

export { db }
