import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const tests = pgTable('tests', {
  id: uuid('id').defaultRandom().primaryKey(),
  test: text('test').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})

export type Test = typeof tests.$inferSelect
export type NewTest = typeof tests.$inferInsert
