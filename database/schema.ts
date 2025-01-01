import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
    date,
    decimal,
    integer,
    pgTable,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
    jobRole: text('job_role'),
    joiningDate: date('joining_date'),
    wageDayPay: decimal('wage_day_pay', {
        precision: 10,
        scale: 2,
    }).default('0'),
    wageNightPay: decimal('wage_night_pay', {
        precision: 10,
        scale: 2,
    }).default('0'),
    wageSaturdayPay: decimal('wage_saturday_pay', {
        precision: 10,
        scale: 2,
    }).default('0'),
    wageSundayPay: decimal('wage_sunday_pay', {
        precision: 10,
        scale: 2,
    }).default('0'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies);
export const selectCompanySchema = createSelectSchema(companies);
