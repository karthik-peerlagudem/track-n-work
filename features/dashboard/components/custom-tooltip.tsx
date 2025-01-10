import { format } from 'date-fns';

import { Separator } from '@/components/ui/separator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomTooltip = ({ active, payload }: any) => {
    if (!active) return null;

    const date = payload[0].payload.date;
    const hours = payload[0].value;
    const earnings = payload[1].value;

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
                {format(date, 'MMM dd yyy')}
            </div>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1 5 bg-blue-500 rounded-full">
                            <p className="text-sm text-muted-foreground pr-2">
                                hours
                            </p>
                        </div>
                        <p className="text-sm text-right font-medium">
                            {hours}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1 5 bg-rose-500 rounded-full">
                            <p className="text-sm text-muted-foreground pr-2">
                                earnings
                            </p>
                        </div>
                        <p className="text-sm text-right font-medium ml-4">
                            {`$${earnings}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
