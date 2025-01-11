import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
    boolean,
    date,
    decimal,
    integer,
    pgTable,
    text,
    time,
    timestamp,
    unique,
} from 'drizzle-orm/pg-core';

export const companies = pgTable(
    'companies',
    {
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
        }).notNull(),
        wageSaturdayPay: decimal('wage_saturday_pay', {
            precision: 10,
            scale: 2,
        }).notNull(),
        wageSundayPay: decimal('wage_sunday_pay', {
            precision: 10,
            scale: 2,
        }).notNull(),
        created_at: timestamp('created_at').defaultNow(),
        updated_at: timestamp('updated_at').defaultNow(),
    },
    // unique constraint on name and userId
    (table) => ({
        nameUserIdIdx: unique('company_name_user_id_idx').on(
            table.name,
            table.userId
        ),
    })
);

export const hours = pgTable(
    'hours',
    {
        id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
        companyId: integer('company_id')
            .references(() => companies.id, {
                onDelete: 'cascade',
            })
            .notNull(),
        workDate: date('work_date').notNull(),
        endDate: date('end_date'),
        startTime: time('start_time').notNull(),
        endTime: time('end_time').notNull(),
        userId: text('user_id').notNull(),
        isOvernightShift: boolean('is_overnight_shift')
            .default(false)
            .notNull(),
        created_at: timestamp('created_at').defaultNow(),
        updated_at: timestamp('updated_at').defaultNow(),
    },
    (table) => ({
        uniq: unique('hours_company_id_work_date_idx').on(
            table.companyId,
            table.workDate
        ),
    })
);

export const insertCompanySchema = createInsertSchema(companies);
export const selectCompanySchema = createSelectSchema(companies);
export const insertHoursSchema = createInsertSchema(hours);
