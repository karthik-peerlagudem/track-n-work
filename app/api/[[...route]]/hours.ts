import { z } from 'zod';
import { Hono } from 'hono';
import { eq, and, gte, lt, sql } from 'drizzle-orm';

import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';

import { db } from '@/database/drizzle';

import { companies, hours, insertHoursSchema } from '@/database/schema';

const app = new Hono()
    .get(
        '/',
        zValidator(
            'query',
            z.object({
                start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
                end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            })
        ),
        clerkMiddleware(),
        async (c) => {
            const { start_date, end_date } = c.req.valid('query');
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            if (!start_date || !end_date) {
                return c.json({ message: 'Invalid date range' }, 400);
            }

            const data = await db
                .select({
                    id: hours.id,
                    companyName: companies.name,
                    wageDayPay: companies.wageDayPay,
                    wageNightPay: companies.wageNightPay,
                    wageSaturdayPay: companies.wageSaturdayPay,
                    wageSundayPay: companies.wageSundayPay,
                    workDate: hours.workDate,
                    endDate: hours.endDate,
                    isOvernightShift: hours.isOvernightShift,
                    startTime:
                        sql<string>`TO_CHAR(${hours.startTime}::time, 'HH24:MI')`.mapWith(
                            String
                        ),
                    endTime:
                        sql<string>`TO_CHAR(${hours.endTime}::time, 'HH24:MI')`.mapWith(
                            String
                        ),
                    totalHours: sql<number>`
                        CASE 
                            WHEN ${hours.isOvernightShift} = true THEN
                                ROUND(
                                    EXTRACT(EPOCH FROM (
                                        CASE
                                            WHEN ${hours.endTime}::time < ${hours.startTime}::time 
                                            THEN ((time '24:00:00' - ${hours.startTime}::time) + 
                                                 (${hours.endTime}::time - time '00:00:00'))
                                            ELSE ${hours.endTime}::time - ${hours.startTime}::time
                                        END
                                    )) / 3600.0
                                , 2)
                            ELSE
                                ROUND(
                                    EXTRACT(EPOCH FROM (${hours.endTime}::time - ${hours.startTime}::time)) / 3600.0
                                , 2)
                        END
                    `.mapWith(Number),
                })
                .from(hours)
                .innerJoin(companies, eq(hours.companyId, companies.id))
                .where(
                    and(
                        gte(hours.workDate, start_date),
                        lt(hours.workDate, end_date),
                        eq(hours.userId, auth.userId)
                    )
                )
                .orderBy(hours.workDate);
            return c.json({ data });
        }
    )
    .get(
        '/:id',
        zValidator('param', z.object({ id: z.string().optional() })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const id = parseInt(c.req.valid('param').id ?? '');

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            if (!id) {
                return c.json({ message: 'Invalid id' }, 400);
            }

            const [data] = await db
                .select({
                    id: hours.id,
                    companyId: hours.companyId,
                    workDate: hours.workDate,
                    endDate: hours.endDate,
                    isOvernightShift: hours.isOvernightShift,
                    startTime: hours.startTime,
                    endTime: hours.endTime,
                })
                .from(hours)
                .where(eq(hours.id, id));

            return c.json({ data });
        }
    )
    .post(
        '/',
        clerkMiddleware(),
        zValidator(
            'json',
            insertHoursSchema.pick({
                companyId: true,
                workDate: true,
                endDate: true,
                startTime: true,
                endTime: true,
                isOvernightShift: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid('json');

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            try {
                const data = await db
                    .insert(hours)
                    .values({
                        userId: auth.userId,
                        ...values,
                    })
                    .returning();

                return c.json({ data });
            } catch (error: unknown) {
                // Type guard to check if error is a Postgres error
                if (error && typeof error === 'object' && 'code' in error) {
                    const pgError = error as { code: string };
                    //postgreSQL unique constraint violation error code - unique key
                    if (pgError.code === '23505') {
                        return c.json(
                            {
                                message:
                                    'Hours already logged for this time period',
                            },
                            409
                        );
                    }
                }
            }
        }
    )
    .patch(
        '/:id',
        zValidator('param', z.object({ id: z.string().optional() })),
        clerkMiddleware(),
        zValidator(
            'json',
            insertHoursSchema.pick({
                companyId: true,
                workDate: true,
                endDate: true,
                startTime: true,
                endTime: true,
                isOvernightShift: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const data = c.req.valid('json');
            const id = parseInt(c.req.valid('param').id ?? '');

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            if (!id) {
                return c.json({ message: 'Invalid id' }, 400);
            }

            const [response] = await db
                .update(hours)
                .set({
                    ...data,
                    userId: auth.userId,
                })
                .where(and(eq(hours.id, id), eq(hours.userId, auth.userId)))
                .returning();

            if (!response) {
                return c.json({ message: 'Hours log not found' }, 404);
            }

            return c.json({ response });
        }
    )
    .delete(
        '/:id',
        zValidator('param', z.object({ id: z.string().optional() })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const id = parseInt(c.req.valid('param').id ?? '');

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            if (!id) {
                return c.json({ message: 'Invalid id' }, 400);
            }

            const [response] = await db
                .delete(hours)
                .where(and(eq(hours.id, id), eq(hours.userId, auth.userId)))
                .returning();

            if (!response) {
                return c.json({ message: 'Hours log not found' }, 404);
            }

            return c.json({ response });
        }
    );

export default app;
