import { Hono } from 'hono';

import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';

import { db } from '@/database/drizzle';
import { companies, insertCompanySchema } from '@/database/schema';

import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const app = new Hono()
    .get('/', clerkMiddleware(), async (c) => {
        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({ message: 'Unauthorized' }, 401);
        }

        const data = await db
            .select({
                id: companies.id,
                name: companies.name,
                jobRole: companies.jobRole,
                joiningDate: companies.joiningDate,
                wageDayPay: companies.wageDayPay,
                wageNightPay: companies.wageNightPay,
                wageSaturdayPay: companies.wageSaturdayPay,
                wageSundayPay: companies.wageSundayPay,
            })
            .from(companies)
            .where(eq(companies.userId, auth.userId))
            .orderBy(companies.id);

        return c.json({ data });
    })
    .get(
        '/:id',
        zValidator('param', z.object({ id: z.string().optional() })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            const id = parseInt(c.req.valid('param').id ?? '');

            if (!id) {
                return c.json({ message: 'Invalid id' }, 400);
            }

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const [data] = await db
                .select({
                    id: companies.id,
                    name: companies.name,
                    jobRole: companies.jobRole,
                    joiningDate: companies.joiningDate,
                    wageDayPay: companies.wageDayPay,
                    wageNightPay: companies.wageNightPay,
                    wageSaturdayPay: companies.wageSaturdayPay,
                    wageSundayPay: companies.wageSundayPay,
                })
                .from(companies)
                .where(
                    and(eq(companies.userId, auth.userId), eq(companies.id, id))
                );
            if (!data) {
                return c.json({ message: 'Company not found' }, 404);
            }

            return c.json({ data });
        }
    )
    .post(
        '/',
        clerkMiddleware(),
        zValidator(
            'json',
            insertCompanySchema.pick({
                name: true,
                jobRole: true,
                joiningDate: true,
                wageDayPay: true,
                wageNightPay: true,
                wageSaturdayPay: true,
                wageSundayPay: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid('json');

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const data = await db
                .insert(companies)
                .values({
                    userId: auth.userId,
                    ...values,
                })
                .returning();

            return c.json({ data });
        }
    )
    .patch(
        '/:id',
        zValidator('param', z.object({ id: z.string().optional() })),
        clerkMiddleware(),
        zValidator(
            'json',
            insertCompanySchema.pick({
                name: true,
                jobRole: true,
                joiningDate: true,
                wageDayPay: true,
                wageNightPay: true,
                wageSaturdayPay: true,
                wageSundayPay: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid('json');
            const id = parseInt(c.req.valid('param').id ?? '');

            if (!id) {
                return c.json({ message: 'Invalid id' }, 400);
            }

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const [data] = await db
                .update(companies)
                .set({
                    ...values,
                })
                .where(
                    and(eq(companies.userId, auth.userId), eq(companies.id, id))
                )
                .returning();

            if (!data) {
                return c.json({ message: 'Company not found' }, 404);
            }

            return c.json({ data });
        }
    )
    .delete(
        '/:id',
        zValidator('param', z.object({ id: z.string().optional() })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const id = parseInt(c.req.valid('param').id ?? '');

            if (!id) {
                return c.json({ message: 'Invalid id' }, 400);
            }

            if (!auth?.userId) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const [data] = await db
                .delete(companies)
                .where(
                    and(eq(companies.userId, auth.userId), eq(companies.id, id))
                )
                .returning();

            if (!data) {
                return c.json({ message: 'Company not found' }, 404);
            }

            return c.json({ id: data.id });
        }
    );
export default app;
