import { date, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
    jobRole: text('job_role'),
    joiningDate: date('joining_date'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});
