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
    
    template_days {
        serial id PK
        integer template_id FK
        day_label day_label
        integer order
        timestamp created_at
    }
    
    template_day_muscle_groups {
        serial id PK
        integer template_day_id FK
        muscle_group muscle_group
        exercise_type exercise_type
        integer exercise_id FK
        integer order
        text pinned_notes
        timestamp created_at
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
    templates ||--o{ template_days : "defines structure"
    template_days ||--o{ template_day_muscle_groups : "contains"
    exercises ||--o{ template_day_muscle_groups : "assigned to"
    cycles ||--o{ cycle_days : "contains"
    cycles ||--o{ weeks : "has"
    cycle_days ||--o{ cycle_day_muscle_groups : "defines"
    cycle_days ||--o{ workouts : "generates"
    exercises ||--o{ cycle_day_muscle_groups : "assigned to"
    exercises ||--o{ workout_exercises : "performed in"
    weeks ||--o{ workouts : "contains"
    workouts ||--o{ workout_exercises : "includes"
    workout_exercises ||--o{ sets : "logged as"

    %% Note: Enums are defined in the database schema
    %% muscle_group: chest, back, triceps, biceps, shoulders, quads, glutes, hamstrings, calves, traps, forearms, abs
    %% exercise_type: barbell, bodyweight_only, bodyweight_loadable, dumbbell, machine, smith_machine, cable, freemotion
    %% set_method: straight_sets, down_sets, giant_sets, supersets, myoreps, drop_sets
    %% day_label: monday, tuesday, wednesday, thursday, friday, saturday, sunday
    %% week_type: progression, deload
```

## Data Flow

1. **Template Creation Phase** (Optional):
   - User creates a `template` with name and description
   - Defines `template_days` with specific `day_label` ordering
   - Assigns `template_day_muscle_groups` with `muscle_group`, `exercise_type`, and optional `pinned_notes`
   - System assigns specific `exercises` to each muscle group

2. **Planning Phase**: 
   - User creates a `cycle` (optionally from a `template`)
   - If using template: system copies `template_days` → `cycle_days` and `template_day_muscle_groups` → `cycle_day_muscle_groups`
   - If creating from scratch: defines `cycle_days` and `cycle_day_muscle_groups` directly

3. **Generation Phase**:
   - System creates `weeks` for the cycle (7 progression + 1 deload)
   - Generates `workouts` for each day in each week
   - Creates `workout_exercises` based on cycle day muscle group assignments

4. **Tracking Phase**:
   - User performs workouts and logs `sets` with weight/reps
   - Can add notes, skip sets, or modify exercises
   - Marks workouts as completed when finished

## Key Design Decisions

- **True Template Reusability**: Templates now own their complete structural definition via `template_days` and `template_day_muscle_groups`, enabling proper reuse and sharing
- **Template-to-Cycle Copy Pattern**: When creating cycles from templates, the structure is copied (not referenced) to allow independent modification
- **Separation of Planning and Execution**: `cycle_day_muscle_groups` defines the plan, while `workout_exercises` handles the actual execution
- **Flexible Exercise Assignment**: Exercises can be assigned at template/planning time or dynamically during workouts
- **Template-Level Pinned Notes**: `template_day_muscle_groups.pinned_notes` allows templates to include persistent exercise guidance
- **Comprehensive Tracking**: Both set-level and exercise-level completion/skipping
- **Week Progression**: Clear distinction between progression and deload weeks