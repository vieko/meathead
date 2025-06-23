## Data Model

- Cycles contain days of the week
- Each day contains muscle groups
- Each muscle group contains one exercise of the given type

- Cycles progress through a series of weeks
- Each cycle can have up to seven progression weeks
- Each cycle requires one deload week as the last week
- Each week has a workout for every day in the cycle
- Each workout has sets for each exercise in the day
- Each set logs the number of reps at a given weight for each exercise
- Each set is performed in a given method, the default being straight sets

- A template records the structure of a cycle: days, groups, exercises, pinned
  notes

- When planning a cycle, the user outlines the structure of the cycle
- When creating a cycle, the app generates all weeks, workouts, and sets for the
  cycle

- There are two types of weeks: progression and deload

- Exercises have a name, a muscle group, an exercise type, and a description

- There are different types of muscle groups: chest, back, triceps, biceps,
  shoulders, quads, glutes, hamstrings, calves, traps, forearms, abs

- There are different types of exercises: barbell, bodyweight only, bodyweight
  loadable, dumbbell, machine, smith machine, cable, freemotion

- There are different methods (set types) of performing sets: straight sets,
  down sets, giant sets, supersets, myoreps, and drop sets

- There are seven labels for days: monday, tuesday, wednesday, thursday, friday,
  saturday, and sunday

## Cycle Planning

- Cycle starts with two empty days each with an empty muscle group
- User can add a new muscle group to the day
- User can add a new day to the cycle up to seven days
- User can select an exercise type for a muscle group
- User can update the exercise type assigned to a muscle group
- User can select a label for the day
- User can update the label for the day
- User can remove a muscle group from the day
- User can remove a day from the cycle
- User can move muscle groups between days
- User can reorder muscle groups in a day
- User can clear all exercises from the cycle
- App can choose exercises for all muscle groups in a cycle
- User can save a cycle as a template
- User can reset cycle start over

## Workout Tracking

- Workout starts with the first day of the cycle for the current week
- User can add notes to exercises
- Notes can be pinned to the exercise permanently
- Notes can be applied to the exercise for the current day only
- User can reorder exercises
- User can replace an exercise with a new one
- User can add a set to an exercise
- User can remove a set from an exercise
- User can skip a set (a single set in an exercise)
- User can skip sets (all sets in an exercise)
- User can change the set type for an exercise

- User enters weight for an exercise
- User can update the weight for an exercise
- User enters reps for an exercise
- User can update the reps for an exercise
- User logs the set at the current weight and reps

- When all sets for all exercises are completed, the user can mark the workout
  as completed

## Overall Layout

A sidebar holds options for:

- Current Workout
- Cycles
- Templates
- Custom Exercises
- New Cycle

## Planning Route

The planning route functions as a kanban board where cycles are board, days are
columns and muscle groups are cards

## Tracking Route

The tracking route functions as a collection of components used to log workouts
