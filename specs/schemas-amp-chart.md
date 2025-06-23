# Database Schema Diagram

This diagram shows the relationships between all tables in the fitness tracking application.

```mermaid
erDiagram
    templates {
        uuid id PK
        text name
        timestamp created_at
        timestamp updated_at
    }
    
    cycles {
        uuid id PK
        text name
        uuid template_id FK
        integer current_week
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    cycle_days {
        uuid id PK
        uuid cycle_id FK
        day_label day_label
        integer day_order
        timestamp created_at
    }
    
    cycle_muscle_groups {
        uuid id PK
        uuid cycle_day_id FK
        muscle_group muscle_group
        exercise_type exercise_type
        uuid exercise_id FK
        integer group_order
        timestamp created_at
    }
    
    exercises {
        uuid id PK
        text name
        muscle_group muscle_group
        exercise_type exercise_type
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    weeks {
        uuid id PK
        uuid cycle_id FK
        integer week_number
        week_type week_type
        timestamp created_at
    }
    
    workouts {
        uuid id PK
        uuid week_id FK
        uuid cycle_day_id FK
        boolean is_completed
        timestamp completed_at
        timestamp created_at
    }
    
    workout_exercises {
        uuid id PK
        uuid workout_id FK
        uuid exercise_id FK
        integer exercise_order
        set_method set_method
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
        timestamp created_at
    }
    
    %% Relationships
    templates ||--o{ cycles : "has many"
    cycles ||--o{ cycle_days : "contains"
    cycles ||--o{ weeks : "spans"
    cycle_days ||--o{ cycle_muscle_groups : "includes"
    cycle_days ||--o{ workouts : "scheduled for"
    exercises ||--o{ cycle_muscle_groups : "assigned to"
    exercises ||--o{ workout_exercises : "performed as"
    weeks ||--o{ workouts : "contains"
    workouts ||--o{ workout_exercises : "includes"
    workout_exercises ||--o{ sets : "composed of"
```

## Key Relationships

- **Templates** define reusable cycle structures
- **Cycles** are instances of templates with progression tracking
- **Cycle Days** define the weekly structure (Monday-Sunday)
- **Cycle Muscle Groups** specify which muscles are worked on each day
- **Weeks** track progression and deload periods within cycles
- **Workouts** are the actual training sessions for each day/week
- **Workout Exercises** are the specific exercises performed in each workout
- **Sets** record the individual sets (weight/reps) for each exercise
