import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const muscleGroupTypeEnum = pgEnum('muscle_group_type', [
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

export const dayLabelEnum = pgEnum('day_label', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export const weekTypeEnum = pgEnum('week_type', ['progression', 'deload'])

// Tables

export const cycles = pgTable('cycles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  pinnedNotes: text('pinned_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const cycleDays = pgTable('cycle_days', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleId: uuid('cycle_id')
    .notNull()
    .references(() => cycles.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').references(() => templates.id, {
    onDelete: 'set null',
  }),
  dayLabel: dayLabelEnum('day_label').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const muscleGroups = pgTable('muscle_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleDayId: uuid('cycle_day_id')
    .notNull()
    .references(() => cycleDays.id, { onDelete: 'cascade' }),
  muscleGroupType: muscleGroupTypeEnum('muscle_group_type').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const exercises = pgTable('exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  muscleGroupId: uuid('muscle_group_id')
    .notNull()
    .references(() => muscleGroups.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  exerciseType: exerciseTypeEnum('exercise_type').notNull(),
  isCustom: boolean('is_custom').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const weeks = pgTable('weeks', {
  id: uuid('id').primaryKey().defaultRandom(),
  cycleId: uuid('cycle_id')
    .notNull()
    .references(() => cycles.id, { onDelete: 'cascade' }),
  weekNumber: integer('week_number').notNull(),
  weekType: weekTypeEnum('week_type').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const workouts = pgTable('workouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  weekId: uuid('week_id')
    .notNull()
    .references(() => weeks.id, { onDelete: 'cascade' }),
  cycleDayId: uuid('cycle_day_id')
    .notNull()
    .references(() => cycleDays.id, { onDelete: 'cascade' }),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const sets = pgTable('sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  weight: decimal('weight', { precision: 6, scale: 2 }),
  reps: integer('reps'),
  setMethod: setMethodEnum('set_method').default('straight_sets'),
  isCompleted: boolean('is_completed').default(false),
  isSkipped: boolean('is_skipped').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  workoutId: uuid('workout_id').references(() => workouts.id, {
    onDelete: 'cascade',
  }),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations

export const cyclesRelations = relations(cycles, ({ many }) => ({
  cycleDays: many(cycleDays),
  weeks: many(weeks),
}))

export const templatesRelations = relations(templates, ({ many }) => ({
  cycleDays: many(cycleDays),
}))

export const cycleDaysRelations = relations(cycleDays, ({ one, many }) => ({
  cycle: one(cycles, {
    fields: [cycleDays.cycleId],
    references: [cycles.id],
  }),
  template: one(templates, {
    fields: [cycleDays.templateId],
    references: [templates.id],
  }),
  muscleGroups: many(muscleGroups),
  workouts: many(workouts),
}))

export const muscleGroupsRelations = relations(
  muscleGroups,
  ({ one, many }) => ({
    cycleDay: one(cycleDays, {
      fields: [muscleGroups.cycleDayId],
      references: [cycleDays.id],
    }),
    exercises: many(exercises),
  }),
)

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  muscleGroup: one(muscleGroups, {
    fields: [exercises.muscleGroupId],
    references: [muscleGroups.id],
  }),
  sets: many(sets),
  notes: many(notes),
}))

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
  cycleDay: one(cycleDays, {
    fields: [workouts.cycleDayId],
    references: [cycleDays.id],
  }),
  sets: many(sets),
  notes: many(notes),
}))

export const setsRelations = relations(sets, ({ one }) => ({
  workout: one(workouts, {
    fields: [sets.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  exercise: one(exercises, {
    fields: [notes.exerciseId],
    references: [exercises.id],
  }),
  workout: one(workouts, {
    fields: [notes.workoutId],
    references: [workouts.id],
  }),
}))
