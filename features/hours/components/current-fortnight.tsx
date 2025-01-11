import {
    format,
    addWeeks,
    addDays,
    startOfWeek,
    endOfWeek,
    parse,
    differenceInMinutes,
} from 'date-fns';
import { BadgeDollarSign, Clock, Loader2 } from 'lucide-react';

import { WorkHoursListing } from '@/features/hours/components/work-hours-listing';
import { WorkHoursListingItem } from '@/features/hours/components/work-hours-listing-item';
import { useGetHours } from '@/features/hours/api/use-get-hours';

const getCurrentWeeks = () => {
    const today = new Date();

    // Get current week (Monday to Sunday)
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
    const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    // Get next week
    const nextWeekStart = addWeeks(currentWeekStart, 1);
    const nextWeekEnd = addWeeks(currentWeekEnd, 1);

    return {
        currentWeek: {
            start: format(currentWeekStart, 'yyyy-MM-dd'),
            end: format(currentWeekEnd, 'yyyy-MM-dd'),
        },
        nextWeek: {
            start: format(nextWeekStart, 'yyyy-MM-dd'),
            end: format(nextWeekEnd, 'yyyy-MM-dd'),
        },
    };
};

interface WorkHour {
    workDate: string;
    startTime: string;
    endTime: string;
    wageDayPay: string;
    wageNightPay: string;
    wageSaturdayPay: string;
    wageSundayPay: string;
    totalHours: number;
    isOvernightShift: boolean;
    endDate?: string | null;
}
interface WorkHourWithPay {
    id: number;
    companyName: string;
    workDate: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    estimatedPay: number;
}

interface WeekTotals {
    totalHours: number;
    totalEstimatedPay: number;
}

const getEstimatedPay = (data: WorkHour) => {
    if (!data) return 0;
    try {
        const startDateTime = parse(
            data.startTime + ':00',
            'HH:mm:ss',
            new Date(data.workDate)
        );
        let endDateTime = parse(
            data.endTime + ':00',
            'HH:mm:ss',
            new Date(data.workDate)
        );

        const workDate = new Date(data.workDate);
        const dayOfWeek = workDate.getDay();

        if (data.isOvernightShift) {
            endDateTime = parse(
                data.endTime,
                'HH:mm:ss',
                new Date(data.endDate || addDays(new Date(data.workDate), 1))
            );
        }

        // Calculate total minutes
        const minutesWorked = differenceInMinutes(endDateTime, startDateTime);
        const hoursWorked = minutesWorked / 60;

        // Determine rate based on day and time
        let rate = parseFloat(data.wageDayPay);

        // Weekend rates
        if (dayOfWeek === 6) {
            // Saturday
            rate = parseFloat(data.wageSaturdayPay);
        } else if (dayOfWeek === 0) {
            // Sunday
            rate = parseFloat(data.wageSundayPay);
        } else {
            // Weekday - check for night rate
            const startHour = startDateTime.getHours();
            if (startHour >= 18 || startHour < 6) {
                rate = parseFloat(data.wageNightPay);
            }
        }

        return rate * hoursWorked;
    } catch (error) {
        console.error('Error calculating earnings:', error);
        return 0;
    }
};

const calculateWeekTotals = (workHours: WorkHourWithPay[]): WeekTotals => {
    return workHours.reduce(
        (acc, curr) => ({
            totalHours: acc.totalHours + (curr.totalHours || 0),
            totalEstimatedPay: acc.totalEstimatedPay + (curr.estimatedPay || 0),
        }),
        { totalHours: 0, totalEstimatedPay: 0 }
    );
};

export const CurrentFortnight = () => {
    const { currentWeek, nextWeek } = getCurrentWeeks();

    const {
        data: firstWorkingHoursData,
        isLoading: firstWorkingHourDataIsLoading,
    } = useGetHours({
        start_date: format(currentWeek.start, 'yyyy-MM-dd'),
        end_date: format(addDays(currentWeek.end, 7), 'yyyy-MM-dd'),
    });

    const {
        data: secondWorkingHoursData,
        isLoading: secondWorkingHourDataIsLoading,
    } = useGetHours({
        start_date: format(nextWeek.start, 'yyyy-MM-dd'),
        end_date: format(nextWeek.end, 'yyyy-MM-dd'),
    });

    const firstWeekWithPay: WorkHourWithPay[] =
        firstWorkingHoursData?.map((workHour) => ({
            id: workHour.id,
            companyName: workHour.companyName,
            workDate: workHour.workDate,
            startTime: workHour.startTime,
            endTime: workHour.endTime,
            totalHours: workHour.totalHours,
            estimatedPay: getEstimatedPay(workHour),
        })) || [];

    const secondWeekWithPay: WorkHourWithPay[] =
        secondWorkingHoursData?.map((workHour) => ({
            id: workHour.id,
            companyName: workHour.companyName,
            workDate: workHour.workDate,
            startTime: workHour.startTime,
            endTime: workHour.endTime,
            totalHours: workHour.totalHours,
            estimatedPay: getEstimatedPay(workHour),
        })) || [];

    const firstWeekTotals = calculateWeekTotals(firstWeekWithPay);
    const secondWeekTotals = calculateWeekTotals(secondWeekWithPay);

    return (
        <>
            <h2 className="font-bold mt-4">
                CURRENT FORTNIGHT
                <span className="block text-muted-foreground text-base font-normal">
                    ({format(new Date(currentWeek.start), 'dd, MMM yyyy')} -{' '}
                    {format(new Date(nextWeek.end), 'dd, MMM yyyy')}){' '}
                </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                {firstWorkingHourDataIsLoading ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-background/80">
                        <Loader2 className="size-8 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <WorkHoursListing date={currentWeek.start}>
                        <div className=" flex justify-start gap-4 mb-6">
                            <div className="flex items-center justify-start gap-2">
                                <Clock className="size-2 text-muted-foreground" />
                                {firstWeekTotals.totalHours.toFixed(2)} hrs
                            </div>
                            <div className="flex items-center justify-start gap-2">
                                <BadgeDollarSign className="size-2 text-muted-foreground" />
                                {firstWeekTotals.totalEstimatedPay.toFixed(2)}
                            </div>
                        </div>
                        {!firstWorkingHoursData?.length ? (
                            <div className="p-4 text-center text-muted-foreground">
                                No working hours logged for this period
                            </div>
                        ) : (
                            firstWeekWithPay.map((workHour) => (
                                <WorkHoursListingItem
                                    key={workHour.id}
                                    {...workHour}
                                />
                            ))
                        )}
                    </WorkHoursListing>
                )}

                {secondWorkingHourDataIsLoading ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-background/80">
                        <Loader2 className="size-8 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <WorkHoursListing date={nextWeek.start}>
                        <div className=" flex justify-start gap-4">
                            <div className="flex items-center justify-start gap-2">
                                <Clock className="size-2 text-muted-foreground" />
                                {secondWeekTotals.totalHours.toFixed(2)} hrs
                            </div>
                            <div className="flex items-center justify-start gap-2">
                                <BadgeDollarSign className="size-2 text-muted-foreground" />
                                {secondWeekTotals.totalEstimatedPay.toFixed(2)}
                            </div>
                        </div>
                        {!secondWorkingHoursData?.length ? (
                            <div className="p-4 text-center text-muted-foreground">
                                No working hours logged for this period
                            </div>
                        ) : (
                            secondWeekWithPay.map((workHour) => (
                                <WorkHoursListingItem
                                    key={workHour.id}
                                    {...workHour}
                                />
                            ))
                        )}
                    </WorkHoursListing>
                )}
            </div>
        </>
    );
};
