import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

config({ path: '.env.local' })

export default {
  schema: './src/lib/schemas',
  out: './src/lib/migrations/',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
