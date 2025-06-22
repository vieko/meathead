# Database Schema Diagram

```mermaid
erDiagram
    templates {
        uuid id PK
        text name
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    cycles {
        uuid id PK
        text name
        uuid template_id FK
        integer current_week
        integer total_weeks
        boolean is_active
        timestamp start_date
        timestamp end_date
        timestamp created_at
        timestamp updated_at
    }
    
    days {
        uuid id PK
        uuid cycle_id FK
        uuid template_id FK
        day_label label
        integer order
        timestamp created_at
    }
    
    day_muscle_groups {
        uuid id PK
        uuid day_id FK
        muscle_group muscle_group
        exercise_type exercise_type
        integer order
        timestamp created_at
    }
    
    custom_exercises {
        uuid id PK
        text name
        muscle_group muscle_group
        exercise_type exercise_type
        text description
        timestamp created_at
    }
    
    weeks {
        uuid id PK
        uuid cycle_id FK
        integer week_number
        week_type week_type
        timestamp start_date
        timestamp end_date
        timestamp created_at
    }
    
    workouts {
        uuid id PK
        uuid week_id FK
        uuid day_id FK
        boolean is_completed
        timestamp completed_at
        text notes
        timestamp created_at
    }
    
    workout_exercises {
        uuid id PK
        uuid workout_id FK
        uuid day_muscle_group_id FK
        uuid custom_exercise_id FK
        text exercise_name
        set_method set_method
        integer order
        text notes
        text pinned_notes
        boolean is_skipped
        timestamp created_at
    }
    
    sets {
        uuid id PK
        uuid workout_exercise_id FK
        integer set_number
        decimal weight
        integer reps
        boolean is_completed
        boolean is_skipped
        timestamp completed_at
        text notes
        timestamp created_at
    }

    %% Template Structure
    templates ||--o{ cycles : "can be used by"
    templates ||--o{ days : "defines structure"
    
    %% Cycle Structure
    cycles ||--o{ days : "contains"
    cycles ||--o{ weeks : "progresses through"
    
    %% Day Structure
    days ||--o{ day_muscle_groups : "contains"
    days ||--o{ workouts : "generates"
    
    %% Week to Workout
    weeks ||--o{ workouts : "contains"
    
    %% Exercise Structure
    day_muscle_groups ||--o{ workout_exercises : "becomes"
    custom_exercises ||--o{ workout_exercises : "can override"
    
    %% Workout Structure
    workouts ||--o{ workout_exercises : "contains"
    workout_exercises ||--o{ sets : "performed as"
```

## Schema Overview

### Planning Phase
1. **Templates** define reusable cycle structures
2. **Days** within templates contain **Day Muscle Groups**
3. Each muscle group specifies the target muscle and exercise type

### Cycle Creation
1. **Cycles** are created from templates or built from scratch
2. **Weeks** are generated for the cycle (7 progression + 1 deload)
3. **Workouts** are created for each day in each week

### Workout Execution
1. **Workout Exercises** are generated from day muscle groups
2. **Custom Exercises** can override default exercise selection
3. **Sets** track individual performance (weight, reps, completion)

### Key Relationships
- Templates → Cycles (reusable structures)
- Cycles → Weeks → Workouts (temporal progression)
- Days → Day Muscle Groups → Workout Exercises (structural hierarchy)
- Workout Exercises → Sets (performance tracking)

### Enums Used
- `day_label`: monday, tuesday, wednesday, thursday, friday, saturday, sunday
- `muscle_group`: chest, back, triceps, biceps, shoulders, quads, glutes, hamstrings, calves, traps, forearms, abs
- `exercise_type`: barbell, bodyweight_only, bodyweight_loadable, dumbbell, machine, smith_machine, cable, freemotion
- `set_method`: straight_sets, down_sets, giant_sets, supersets, myoreps, drop_sets
- `week_type`: progression, deload