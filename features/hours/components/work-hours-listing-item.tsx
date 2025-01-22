import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

import { useOpenHours } from '@/features/hours/hooks/use-open-hours';

type Props = {
    id: number;
    companyName: string;
    workDate: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    estimatedPay: number;
};

export const WorkHoursListingItem = ({
    id,
    companyName,
    startTime,
    endTime,
    workDate,
    totalHours,
    estimatedPay,
}: Props) => {
    const { onOpen } = useOpenHours();

    return (
        <Card className="cursor-pointer mt-2" onClick={() => onOpen(id)}>
            <CardContent className="p-4">
                <div className="flex justify-start">
                    {/* Left: Date */}
                    <div className="flex flex-col justify-center items-center">
                        <h3 className="text-3xl">{format(workDate, 'd')}</h3>
                        <p className="text-muted-foreground">
                            {format(workDate, 'MMM')}
                        </p>
                    </div>

                    {/* Right side content */}
                    <div className="grid grid-cols-2 pl-8 pr-4 lg:flex justify-between w-full">
                        {/* Middle: Company and Day */}
                        <div className="flex flex-col justify-center">
                            <div className="font-semibold lg:font-medium">
                                {companyName}
                                <span className="block font-medium md:inline-block">
                                    ({startTime} - {endTime})
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">
                                {format(workDate, 'EEEE')}
                            </div>
                        </div>

                        {/* Right: Hours and Pay */}
                        <div className="flex flex-col items-end justify-between mt-4 lg:mt-0">
                            <div className="text-sm font-medium">
                                Total time: {totalHours} hr
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Estimated Pay: ${estimatedPay.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
