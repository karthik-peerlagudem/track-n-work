ALTER TABLE "companies" ALTER COLUMN "job_role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "joining_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "wage_day_pay" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "wage_day_pay" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "wage_night_pay" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "wage_saturday_pay" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "wage_sunday_pay" SET NOT NULL;