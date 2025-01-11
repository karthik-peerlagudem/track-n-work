CREATE TABLE "companies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "companies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"job_role" text NOT NULL,
	"joining_date" date NOT NULL,
	"wage_day_pay" numeric(10, 2) NOT NULL,
	"wage_night_pay" numeric(10, 2) NOT NULL,
	"wage_saturday_pay" numeric(10, 2) NOT NULL,
	"wage_sunday_pay" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "company_name_user_id_idx" UNIQUE("name","user_id")
);
--> statement-breakpoint
CREATE TABLE "hours" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hours_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"work_date" date NOT NULL,
	"end_date" date,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"user_id" text NOT NULL,
	"is_overnight_shift" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "hours_company_id_work_date_idx" UNIQUE("company_id","work_date")
);
--> statement-breakpoint
ALTER TABLE "hours" ADD CONSTRAINT "hours_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;