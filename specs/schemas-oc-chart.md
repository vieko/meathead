# Database Schema Relationships

```mermaid
erDiagram
    templates {
        serial id PK
        text name
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    exercises {
        serial id PK
        text name
        muscle_group muscle_group
        exercise_type exercise_type
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    cycles {
        serial id PK
        text name
        integer template_id FK
        integer current_week
        integer total_weeks
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    cycle_days {
        serial id PK
        integer cycle_id FK
        day_label day_label
        integer order
        timestamp created_at
    }
    
    cycle_day_muscle_groups {
        serial id PK
        integer cycle_day_id FK
        muscle_group muscle_group
        exercise_type exercise_type
        integer exercise_id FK
        integer order
        timestamp created_at
    }
    
    weeks {
        serial id PK
        integer cycle_id FK
        integer week_number
        week_type week_type
        boolean is_completed
        timestamp created_at
    }
    
    workouts {
        serial id PK
        integer week_id FK
        integer cycle_day_id FK
        boolean is_completed
        timestamp completed_at
        timestamp created_at
    }
    
    workout_exercises {
        serial id PK
        integer workout_id FK
        integer exercise_id FK
        integer order
        set_method set_method
        text notes
        text pinned_notes
        boolean is_skipped
        timestamp created_at
    }
    
    sets {
        serial id PK
        integer workout_exercise_id FK
        integer set_number
        decimal weight
        integer reps
        boolean is_completed
        boolean is_skipped
        timestamp completed_at
        timestamp created_at
    }

    %% Relationships
    templates ||--o{ cycles : "can be used by"
    cycles ||--o{ cycle_days : "contains"
    cycles ||--o{ weeks : "has"
    cycle_days ||--o{ cycle_day_muscle_groups : "defines"
    cycle_days ||--o{ workouts : "generates"
    exercises ||--o{ cycle_day_muscle_groups : "assigned to"
    exercises ||--o{ workout_exercises : "performed in"
    weeks ||--o{ workouts : "contains"
    workouts ||--o{ workout_exercises : "includes"
    workout_exercises ||--o{ sets : "logged as"

    %% Enums
    muscle_group_enum {
        chest
        back
        triceps
        biceps
        shoulders
        quads
        glutes
        hamstrings
        calves
        traps
        forearms
        abs
    }
    
    exercise_type_enum {
        barbell
        bodyweight_only
        bodyweight_loadable
        dumbbell
        machine
        smith_machine
        cable
        freemotion
    }
    
    set_method_enum {
        straight_sets
        down_sets
        giant_sets
        supersets
        myoreps
        drop_sets
    }
    
    day_label_enum {
        monday
        tuesday
        wednesday
        thursday
        friday
        saturday
        sunday
    }
    
    week_type_enum {
        progression
        deload
    }
```

## Data Flow

1. **Planning Phase**: 
   - User creates a `cycle` (optionally from a `template`)
   - Defines `cycle_days` with specific `day_label` ordering
   - Assigns `cycle_day_muscle_groups` with `muscle_group` and `exercise_type`
   - System assigns specific `exercises` to each muscle group

2. **Generation Phase**:
   - System creates `weeks` for the cycle (7 progression + 1 deload)
   - Generates `workouts` for each day in each week
   - Creates `workout_exercises` based on cycle day muscle group assignments

3. **Tracking Phase**:
   - User performs workouts and logs `sets` with weight/reps
   - Can add notes, skip sets, or modify exercises
   - Marks workouts as completed when finished

## Key Design Decisions

- **Separation of Planning and Execution**: `cycle_day_muscle_groups` defines the plan, while `workout_exercises` handles the actual execution
- **Flexible Exercise Assignment**: Exercises can be assigned at planning time or dynamically during workouts
- **Comprehensive Tracking**: Both set-level and exercise-level completion/skipping
- **Template Reusability**: Templates allow users to reuse successful cycle structures
- **Week Progression**: Clear distinction between progression and deload weeks