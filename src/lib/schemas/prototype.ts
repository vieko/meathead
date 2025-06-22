import { pgTable, text, uuid, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const muscleGroupEnum = pgEnum('muscle_group', [
  'chest', 'back', 'triceps', 'biceps', 'shoulders', 
  'quads', 'glutes', 'hamstrings', 'calves', 'traps', 'forearms', 'abs'
])

export const exerciseTypeEnum = pgEnum('exercise_type', [
  'barbell', 'bodyweight_only', 'bodyweight_loadable', 
  'dumbbell', 'machine', 'smith_machine', 'cable', 'freemotion'
])

export const setMethodEnum = pgEnum('set_method', [
  'straight_sets', 'down_sets', 'giant_sets', 
  'supersets', 'myoreps', 'drop_sets'
])

export const dayOfWeekEnum = pgEnum('day_of_week', [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
])

export const cycles = pgTable('cycles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const cycleTemplates = pgTable('cycle_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const cycleDays = pgTable('cycle_days', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleId: uuid('cycle_id').references(() => cycles.id).notNull(),
  templateId: uuid('template_id').references(() => cycleTemplates.id),
  dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),
  order: integer('order').notNull()
})

export const cycleMuscleGroups = pgTable('cycle_muscle_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleDayId: uuid('cycle_day_id').references(() => cycleDays.id).notNull(),
  muscleGroup: muscleGroupEnum('muscle_group').notNull(),
  exerciseType: exerciseTypeEnum('exercise_type').notNull(),
  order: integer('order').notNull()
})

export const weeks = pgTable('weeks', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleId: uuid('cycle_id').references(() => cycles.id).notNull(),
  weekNumber: integer('week_number').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull()
})

export const workouts = pgTable('workouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  weekId: uuid('week_id').references(() => weeks.id).notNull(),
  cycleDayId: uuid('cycle_day_id').references(() => cycleDays.id).notNull(),
  date: timestamp('date').notNull(),
  completedAt: timestamp('completed_at')
})

export const workoutSets = pgTable('workout_sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workoutId: uuid('workout_id').references(() => workouts.id).notNull(),
  cycleMuscleGroupId: uuid('cycle_muscle_group_id').references(() => cycleMuscleGroups.id).notNull(),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull(),
  weight: integer('weight').notNull(),
  setMethod: setMethodEnum('set_method').default('straight_sets').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull()
})

export const cyclesRelations = relations(cycles, ({ many }) => ({
  cycleDays: many(cycleDays),
  weeks: many(weeks)
}))

export const cycleTemplatesRelations = relations(cycleTemplates, ({ many }) => ({
  cycleDays: many(cycleDays)
}))

export const cycleDaysRelations = relations(cycleDays, ({ one, many }) => ({
  cycle: one(cycles, {
    fields: [cycleDays.cycleId],
    references: [cycles.id]
  }),
  template: one(cycleTemplates, {
    fields: [cycleDays.templateId],
    references: [cycleTemplates.id]
  }),
  muscleGroups: many(cycleMuscleGroups),
  workouts: many(workouts)
}))

export const cycleMuscleGroupsRelations = relations(cycleMuscleGroups, ({ one, many }) => ({
  cycleDay: one(cycleDays, {
    fields: [cycleMuscleGroups.cycleDayId],
    references: [cycleDays.id]
  }),
  workoutSets: many(workoutSets)
}))

export const weeksRelations = relations(weeks, ({ one, many }) => ({
  cycle: one(cycles, {
    fields: [weeks.cycleId],
    references: [cycles.id]
  }),
  workouts: many(workouts)
}))

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  week: one(weeks, {
    fields: [workouts.weekId],
    references: [weeks.id]
  }),
  cycleDay: one(cycleDays, {
    fields: [workouts.cycleDayId],
    references: [cycleDays.id]
  }),
  sets: many(workoutSets)
}))

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutSets.workoutId],
    references: [workouts.id]
  }),
  cycleMuscleGroup: one(cycleMuscleGroups, {
    fields: [workoutSets.cycleMuscleGroupId],
    references: [cycleMuscleGroups.id]
  })
}))
