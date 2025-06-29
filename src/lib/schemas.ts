import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
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
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  muscleGroup: muscleGroupEnum('muscle_group').notNull(),
  exerciseType: exerciseTypeEnum('exercise_type').notNull(),
  description: text('description'),
  userId: integer('user_id').references(() => users.id), // NULL = system exercise, non-NULL = custom exercise
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const templateDays = pgTable('template_days', {
  id: serial('id').primaryKey(),
  templateId: integer('template_id')
    .references(() => templates.id, { onDelete: 'cascade' })
    .notNull(),
  dayLabel: dayLabelEnum('day_label').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const templateDayMuscleGroups = pgTable('template_day_muscle_groups', {
  id: serial('id').primaryKey(),
  templateDayId: integer('template_day_id')
    .references(() => templateDays.id, { onDelete: 'cascade' })
    .notNull(),
  muscleGroup: muscleGroupEnum('muscle_group').notNull(),
  exerciseType: exerciseTypeEnum('exercise_type').notNull(),
  exerciseId: integer('exercise_id').references(() => exercises.id),
  order: integer('order').notNull(),
  pinnedNotes: text('pinned_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const cycles = pgTable('cycles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  templateId: integer('template_id').references(() => templates.id),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  currentWeek: integer('current_week').default(1).notNull(),
  totalWeeks: integer('total_weeks').default(8).notNull(), // 7 progression + 1 deload
  isActive: boolean('is_active').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const cycleDays = pgTable('cycle_days', {
  id: serial('id').primaryKey(),
  cycleId: integer('cycle_id')
    .references(() => cycles.id, { onDelete: 'cascade' })
    .notNull(),
  dayLabel: dayLabelEnum('day_label').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const cycleDayMuscleGroups = pgTable('cycle_day_muscle_groups', {
  id: serial('id').primaryKey(),
  cycleDayId: integer('cycle_day_id')
    .references(() => cycleDays.id, { onDelete: 'cascade' })
    .notNull(),
  muscleGroup: muscleGroupEnum('muscle_group').notNull(),
  exerciseType: exerciseTypeEnum('exercise_type').notNull(),
  exerciseId: integer('exercise_id').references(() => exercises.id),
  order: integer('order').notNull(),
  pinnedNotes: text('pinned_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const weeks = pgTable('weeks', {
  id: serial('id').primaryKey(),
  cycleId: integer('cycle_id')
    .references(() => cycles.id, { onDelete: 'cascade' })
    .notNull(),
  weekNumber: integer('week_number').notNull(),
  weekType: weekTypeEnum('week_type').notNull(),
  rirRecommendation: integer('rir_recommendation'), // RIR value for progression weeks, NULL for deload
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  weekId: integer('week_id')
    .references(() => weeks.id, { onDelete: 'cascade' })
    .notNull(),
  cycleDayId: integer('cycle_day_id')
    .references(() => cycleDays.id)
    .notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id')
    .references(() => workouts.id, { onDelete: 'cascade' })
    .notNull(),
  exerciseId: integer('exercise_id')
    .references(() => exercises.id)
    .notNull(),
  plannedExerciseId: integer('planned_exercise_id')
    .references(() => exercises.id), // Original planned exercise before replacement
  order: integer('order').notNull(),
  setMethod: setMethodEnum('set_method').default('straight_sets').notNull(),
  notes: text('notes'),
  isSkipped: boolean('is_skipped').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id')
    .references(() => workoutExercises.id, { onDelete: 'cascade' })
    .notNull(),
  setNumber: integer('set_number').notNull(),
  weight: decimal('weight', { precision: 6, scale: 2 }),
  reps: integer('reps'),
  setMethod: setMethodEnum('set_method'), // NULL = inherit from workout_exercise, value = override
  isCompleted: boolean('is_completed').default(false).notNull(),
  isSkipped: boolean('is_skipped').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  templates: many(templates),
  cycles: many(cycles),
  exercises: many(exercises),
}))

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  user: one(users, {
    fields: [exercises.userId],
    references: [users.id],
  }),
  cycleDayMuscleGroups: many(cycleDayMuscleGroups),
  templateDayMuscleGroups: many(templateDayMuscleGroups),
  workoutExercises: many(workoutExercises),
}))

export const templatesRelations = relations(templates, ({ one, many }) => ({
  user: one(users, {
    fields: [templates.userId],
    references: [users.id],
  }),
  cycles: many(cycles),
  templateDays: many(templateDays),
}))

export const templateDaysRelations = relations(templateDays, ({ one, many }) => ({
  template: one(templates, {
    fields: [templateDays.templateId],
    references: [templates.id],
  }),
  muscleGroups: many(templateDayMuscleGroups),
}))

export const templateDayMuscleGroupsRelations = relations(
  templateDayMuscleGroups,
  ({ one }) => ({
    templateDay: one(templateDays, {
      fields: [templateDayMuscleGroups.templateDayId],
      references: [templateDays.id],
    }),
    exercise: one(exercises, {
      fields: [templateDayMuscleGroups.exerciseId],
      references: [exercises.id],
    }),
  }),
)

export const cyclesRelations = relations(cycles, ({ one, many }) => ({
  user: one(users, {
    fields: [cycles.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [cycles.templateId],
    references: [templates.id],
  }),
  cycleDays: many(cycleDays),
  weeks: many(weeks),
}))

export const cycleDaysRelations = relations(cycleDays, ({ one, many }) => ({
  cycle: one(cycles, {
    fields: [cycleDays.cycleId],
    references: [cycles.id],
  }),
  muscleGroups: many(cycleDayMuscleGroups),
  workouts: many(workouts),
}))

export const cycleDayMuscleGroupsRelations = relations(
  cycleDayMuscleGroups,
  ({ one }) => ({
    cycleDay: one(cycleDays, {
      fields: [cycleDayMuscleGroups.cycleDayId],
      references: [cycleDays.id],
    }),
    exercise: one(exercises, {
      fields: [cycleDayMuscleGroups.exerciseId],
      references: [exercises.id],
    }),
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
  cycleDay: one(cycleDays, {
    fields: [workouts.cycleDayId],
    references: [cycleDays.id],
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
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    plannedExercise: one(exercises, {
      fields: [workoutExercises.plannedExerciseId],
      references: [exercises.id],
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

