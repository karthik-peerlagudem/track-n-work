import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkHoursListingProps {
    date: string;
    children?: React.ReactNode;
}

const getWeekRange = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    return {
        start: format(weekStart, 'd'),
        end: format(weekEnd, 'd'),
        month: format(date, 'MMMM'),
        weekNumber: Math.ceil(parseInt(format(date, 'd')) / 7),
    };
};

export const WorkHoursListing = ({ date, children }: WorkHoursListingProps) => {
    const { start, end, month, weekNumber } = getWeekRange(date);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Week {weekNumber} ({month} {start}-{end})
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
};
