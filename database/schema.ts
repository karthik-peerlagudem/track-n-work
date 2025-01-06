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
    jobRole: text('job_role').notNull(),
    joiningDate: date('joining_date').notNull(),
    wageDayPay: decimal('wage_day_pay', {
        precision: 10,
        scale: 2,
    }).notNull(),
    wageNightPay: decimal('wage_night_pay', {
        precision: 10,
        scale: 2,
    })
        .default('0')
        .notNull(),
    wageSaturdayPay: decimal('wage_saturday_pay', {
        precision: 10,
        scale: 2,
    })
        .default('0')
        .notNull(),
    wageSundayPay: decimal('wage_sunday_pay', {
        precision: 10,
        scale: 2,
    })
        .default('0')
        .notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies);
export const selectCompanySchema = createSelectSchema(companies);
