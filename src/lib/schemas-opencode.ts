import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  pgEnum,
  decimal,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const dayLabelEnum = pgEnum('day_label', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export const muscleGroupEnum = pgEnum('muscle_group', [
  'chest',
  'back',
  'triceps',
  'biceps',
  'shoulders',
  'quads',
  'glutes',
  'hamstrings',
  'calves',
  'traps',
  'forearms',
  'abs',
])

export const exerciseTypeEnum = pgEnum('exercise_type', [
  'barbell',
  'bodyweight_only',
  'bodyweight_loadable',
  'dumbbell',
  'machine',
  'smith_machine',
  'cable',
  'freemotion',
])

export const setMethodEnum = pgEnum('set_method', [
  'straight_sets',
  'down_sets',
  'giant_sets',
  'supersets',
  'myoreps',
  'drop_sets',
])

export const weekTypeEnum = pgEnum('week_type', ['progression', 'deload'])

// Templates table
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Cycles table
export const cycles = pgTable('cycles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  templateId: uuid('template_id').references(() => templates.id),
  currentWeek: integer('current_week').default(1).notNull(),
  totalWeeks: integer('total_weeks').default(8).notNull(), // 7 progression + 1 deload
  isActive: boolean('is_active').default(false).notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Days table (structure for cycles/templates)
export const days = pgTable('days', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleId: uuid('cycle_id').references(() => cycles.id, {
    onDelete: 'cascade',
  }),
  templateId: uuid('template_id').references(() => templates.id, {
    onDelete: 'cascade',
  }),
  label: dayLabelEnum('label').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Muscle groups within days
export const dayMuscleGroups = pgTable('day_muscle_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  dayId: uuid('day_id')
    .references(() => days.id, { onDelete: 'cascade' })
    .notNull(),
  muscleGroup: muscleGroupEnum('muscle_group').notNull(),
  exerciseType: exerciseTypeEnum('exercise_type'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Custom exercises
export const customExercises = pgTable('custom_exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  muscleGroup: muscleGroupEnum('muscle_group').notNull(),
  exerciseType: exerciseTypeEnum('exercise_type').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Weeks within cycles
export const weeks = pgTable('weeks', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleId: uuid('cycle_id')
    .references(() => cycles.id, { onDelete: 'cascade' })
    .notNull(),
  weekNumber: integer('week_number').notNull(),
  weekType: weekTypeEnum('week_type').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Workouts (specific day within a week)
export const workouts = pgTable('workouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  weekId: uuid('week_id')
    .references(() => weeks.id, { onDelete: 'cascade' })
    .notNull(),
  dayId: uuid('day_id')
    .references(() => days.id, { onDelete: 'cascade' })
    .notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Exercises within workouts
export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  workoutId: uuid('workout_id')
    .references(() => workouts.id, { onDelete: 'cascade' })
    .notNull(),
  dayMuscleGroupId: uuid('day_muscle_group_id')
    .references(() => dayMuscleGroups.id, { onDelete: 'cascade' })
    .notNull(),
  customExerciseId: uuid('custom_exercise_id').references(
    () => customExercises.id,
  ),
  exerciseName: text('exercise_name'), // For when using custom exercise or override
  setMethod: setMethodEnum('set_method').default('straight_sets').notNull(),
  order: integer('order').notNull(),
  notes: text('notes'),
  pinnedNotes: text('pinned_notes'),
  isSkipped: boolean('is_skipped').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Sets within exercises
export const sets = pgTable('sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workoutExerciseId: uuid('workout_exercise_id')
    .references(() => workoutExercises.id, { onDelete: 'cascade' })
    .notNull(),
  setNumber: integer('set_number').notNull(),
  weight: decimal('weight', { precision: 6, scale: 2 }), // Allows for fractional weights
  reps: integer('reps'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  isSkipped: boolean('is_skipped').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const templatesRelations = relations(templates, ({ many }) => ({
  cycles: many(cycles),
  days: many(days),
}))

export const cyclesRelations = relations(cycles, ({ one, many }) => ({
  template: one(templates, {
    fields: [cycles.templateId],
    references: [templates.id],
  }),
  days: many(days),
  weeks: many(weeks),
}))

export const daysRelations = relations(days, ({ one, many }) => ({
  cycle: one(cycles, {
    fields: [days.cycleId],
    references: [cycles.id],
  }),
  template: one(templates, {
    fields: [days.templateId],
    references: [templates.id],
  }),
  muscleGroups: many(dayMuscleGroups),
  workouts: many(workouts),
}))

export const dayMuscleGroupsRelations = relations(
  dayMuscleGroups,
  ({ one, many }) => ({
    day: one(days, {
      fields: [dayMuscleGroups.dayId],
      references: [days.id],
    }),
    workoutExercises: many(workoutExercises),
  }),
)

export const customExercisesRelations = relations(
  customExercises,
  ({ many }) => ({
    workoutExercises: many(workoutExercises),
  }),
)

export const weeksRelations = relations(weeks, ({ one, many }) => ({
  cycle: one(cycles, {
    fields: [weeks.cycleId],
    references: [cycles.id],
  }),
  workouts: many(workouts),
}))

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  week: one(weeks, {
    fields: [workouts.weekId],
    references: [weeks.id],
  }),
  day: one(days, {
    fields: [workouts.dayId],
    references: [days.id],
  }),
  exercises: many(workoutExercises),
}))

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    dayMuscleGroup: one(dayMuscleGroups, {
      fields: [workoutExercises.dayMuscleGroupId],
      references: [dayMuscleGroups.id],
    }),
    customExercise: one(customExercises, {
      fields: [workoutExercises.customExerciseId],
      references: [customExercises.id],
    }),
    sets: many(sets),
  }),
)

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}))

// Type exports for use in the application
export type Template = typeof templates.$inferSelect
export type NewTemplate = typeof templates.$inferInsert
export type Cycle = typeof cycles.$inferSelect
export type NewCycle = typeof cycles.$inferInsert
export type Day = typeof days.$inferSelect
export type NewDay = typeof days.$inferInsert
export type DayMuscleGroup = typeof dayMuscleGroups.$inferSelect
export type NewDayMuscleGroup = typeof dayMuscleGroups.$inferInsert
export type CustomExercise = typeof customExercises.$inferSelect
export type NewCustomExercise = typeof customExercises.$inferInsert
export type Week = typeof weeks.$inferSelect
export type NewWeek = typeof weeks.$inferInsert
export type Workout = typeof workouts.$inferSelect
export type NewWorkout = typeof workouts.$inferInsert
export type WorkoutExercise = typeof workoutExercises.$inferSelect
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert
export type Set = typeof sets.$inferSelect
export type NewSet = typeof sets.$inferInsert

