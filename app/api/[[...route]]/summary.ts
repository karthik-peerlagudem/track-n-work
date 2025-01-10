import { db } from '@/database/drizzle';
import { companies, hours } from '@/database/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { addDays, differenceInMinutes, parse } from 'date-fns';
import { eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono().get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
        return c.json({ message: 'Unauthorized' }, 401);
    }

    //Get all companies count
    const totalCompanies = await db
        .select({
            count: sql<number>`count(*)`, // count(*) is a SQL function
        })
        .from(companies)
        .where(eq(companies.userId, auth.userId));

    const workHours = await db
        .select({
            wageDayPay: companies.wageDayPay,
            wageNightPay: companies.wageNightPay,
            wageSaturdayPay: companies.wageSaturdayPay,
            wageSundayPay: companies.wageSundayPay,
            workDate: hours.workDate,
            endDate: hours.endDate,
            startTime: hours.startTime,
            endTime: hours.endTime,
            isOvernightShift: hours.isOvernightShift,
        })
        .from(hours)
        .innerJoin(companies, eq(hours.companyId, companies.id))
        .where(eq(hours.userId, auth.userId));

    const totalHours = workHours.reduce((total, hour) => {
        // eslint-disable-next-line prefer-const
        let startDateTime = parse(
            hour.startTime,
            'HH:mm:ss',
            new Date(hour.workDate)
        );
        let endDateTime = parse(
            hour.endTime,
            'HH:mm:ss',
            new Date(hour.workDate)
        );

        if (hour.isOvernightShift) {
            // If overnight shift, add 1 day to end time
            endDateTime = parse(
                hour.endTime,
                'HH:mm:ss',
                new Date(hour.endDate || addDays(new Date(hour.workDate), 1))
            );
        }

        const minutesWorked = differenceInMinutes(endDateTime, startDateTime);
        const hoursWorked = minutesWorked / 60;
        return total + hoursWorked;
    }, 0);

    const totalEarnings = workHours.reduce((total, hour) => {
        const startDateTime = parse(
            hour.startTime,
            'HH:mm:ss',
            new Date(hour.workDate)
        );
        let endDateTime = parse(
            hour.endTime,
            'HH:mm:ss',
            new Date(hour.workDate)
        );
        const workDate = new Date(hour.workDate);
        const dayOfWeek = workDate.getDay();

        if (hour.isOvernightShift) {
            endDateTime = parse(
                hour.endTime,
                'HH:mm:ss',
                new Date(hour.endDate || addDays(new Date(hour.workDate), 1))
            );
        }

        // Calculate total minutes
        const minutesWorked = differenceInMinutes(endDateTime, startDateTime);
        const hoursWorked = minutesWorked / 60;

        // Determine rate based on day and time
        let rate = parseFloat(hour.wageDayPay);

        // Weekend rates
        if (dayOfWeek === 6) {
            // Saturday
            rate = parseFloat(hour.wageSaturdayPay);
        } else if (dayOfWeek === 0) {
            // Sunday
            rate = parseFloat(hour.wageSundayPay);
        } else {
            // Weekday - check for night rate
            const startHour = startDateTime.getHours();
            if (startHour >= 18 || startHour < 6) {
                rate = parseFloat(hour.wageNightPay);
            }
        }

        return total + rate * hoursWorked;
    }, 0);

    return c.json({
        companiesCount: Number(totalCompanies[0].count),
        totalWorkingHours: totalHours.toFixed(2),
        totalEarnings: totalEarnings.toFixed(2),
    });
});

export default app;
