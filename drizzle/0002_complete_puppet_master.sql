ALTER TABLE "hours" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "hours" ADD COLUMN "is_overnight_shift" boolean DEFAULT false;