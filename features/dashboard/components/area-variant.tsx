import { format } from 'date-fns';

import {
    Tooltip,
    XAxis,
    AreaChart,
    Area,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

import { CustomTooltip } from './custom-tooltip';

type Props = {
    data: {
        date: string;
        hours: number;
        earnings: number;
    }[];
};

export const AreaVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <defs>
                    <linearGradient id="hours" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#3d82f6"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="98%"
                            stopColor="#3d82f6"
                            stopOpacity={0}
                        />
                    </linearGradient>
                    <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#f43f5e"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="98%"
                            stopColor="#f43f5e"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    style={{ fontSize: '0.75rem' }}
                    tickMargin={16}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type={'monotone'}
                    dataKey={'hours'}
                    stackId={'hours'}
                    strokeWidth={2}
                    stroke="#3d82f6"
                    fill="url(#hours)"
                    className="drop-shadow-sm"
                />
                <Area
                    type={'monotone'}
                    dataKey={'earnings'}
                    stackId={'earnings'}
                    strokeWidth={2}
                    stroke="#f43f5e"
                    fill="url(#earnings)"
                    className="drop-shadow-sm"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
