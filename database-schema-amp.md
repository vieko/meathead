# Database Schema - Meathead App

```mermaid
erDiagram
    cycles ||--o{ cycleDays : contains
    cycles ||--o{ weeks : "has progression"
    templates ||--o{ cycleDays : "can template"
    
    cycleDays ||--o{ muscleGroups : contains
    cycleDays ||--o{ workouts : "generates"
    
    muscleGroups ||--|| exercises : "has one"
    
    weeks ||--o{ workouts : "scheduled in"
    
    workouts ||--o{ sets : "performed as"
    workouts ||--o{ notes : "can have"
    
    exercises ||--o{ sets : "logged in"
    exercises ||--o{ notes : "can have"

    cycles {
        uuid id PK
        text name
        text description
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }
    
    templates {
        uuid id PK
        text name
        text description
        text pinnedNotes
        timestamp createdAt
        timestamp updatedAt
    }
    
    cycleDays {
        uuid id PK
        uuid cycleId FK
        uuid templateId FK
        enum dayLabel
        integer order
        timestamp createdAt
    }
    
    muscleGroups {
        uuid id PK
        uuid cycleDayId FK
        enum muscleGroupType
        integer order
        timestamp createdAt
    }
    
    exercises {
        uuid id PK
        uuid muscleGroupId FK
        text name
        enum exerciseType
        boolean isCustom
        timestamp createdAt
    }
    
    weeks {
        uuid id PK
        uuid cycleId FK
        integer weekNumber
        enum weekType
        timestamp startDate
        timestamp endDate
        timestamp createdAt
    }
    
    workouts {
        uuid id PK
        uuid weekId FK
        uuid cycleDayId FK
        boolean isCompleted
        timestamp completedAt
        timestamp createdAt
    }
    
    sets {
        uuid id PK
        uuid workoutId FK
        uuid exerciseId FK
        integer setNumber
        decimal weight
        integer reps
        enum setMethod
        boolean isCompleted
        boolean isSkipped
        timestamp completedAt
        timestamp createdAt
    }
    
    notes {
        uuid id PK
        uuid exerciseId FK
        uuid workoutId FK
        text content
        boolean isPinned
        timestamp createdAt
        timestamp updatedAt
    }
```

## Key Relationships

- **Cycles** are the main training programs that contain days and weeks
- **Templates** can be used to structure cycle days  
- **Cycle Days** define the structure (what muscle groups on which days)
- **Muscle Groups** contain one exercise each
- **Weeks** represent progression/deload periods within cycles
- **Workouts** are the actual training sessions (intersection of week + day)
- **Sets** log the actual performance data (weight/reps)
- **Notes** can be attached to exercises (pinned) or specific workouts
