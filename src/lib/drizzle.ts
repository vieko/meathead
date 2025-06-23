import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as prototypeAmpSchema from '@/lib/schemas-amp'
import * as prototypeOpencodeSchema from '@/lib/schemas-opencode'

const sql = neon(process.env.DATABASE_URL!)

const schema = {
  ...prototypeAmpSchema,
  ...prototypeOpencodeSchema,
}

const db = drizzle(sql, { schema })

export { db }
