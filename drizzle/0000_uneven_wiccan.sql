CREATE TABLE "companies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "companies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"job_role" text,
	"joining_date" date,
	"wage_day_pay" numeric(10, 2) DEFAULT '0',
	"wage_night_pay" numeric(10, 2) DEFAULT '0',
	"wage_saturday_pay" numeric(10, 2) DEFAULT '0',
	"wage_sunday_pay" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
