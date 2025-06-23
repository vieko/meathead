CREATE TABLE "template_day_muscle_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_day_id" integer NOT NULL,
	"muscle_group" "muscle_group" NOT NULL,
	"exercise_type" "exercise_type" NOT NULL,
	"exercise_id" integer,
	"order" integer NOT NULL,
	"pinned_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"day_label" "day_label" NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "template_day_muscle_groups" ADD CONSTRAINT "template_day_muscle_groups_template_day_id_template_days_id_fk" FOREIGN KEY ("template_day_id") REFERENCES "public"."template_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_day_muscle_groups" ADD CONSTRAINT "template_day_muscle_groups_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_days" ADD CONSTRAINT "template_days_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;