import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { date, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
    jobRole: text('job_role'),
    joiningDate: date('joining_date'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies);
export const selectCompanySchema = createSelectSchema(companies);
