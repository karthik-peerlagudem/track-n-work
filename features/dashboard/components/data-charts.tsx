'use client';

import { Chart } from '@/features/dashboard/components/chart';
import { useGetSummary } from '../api/use-get-summary';

export const DataCharts = () => {
    const { data: summaryData } = useGetSummary();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
            <Chart data={summaryData?.chartData} />
        </div>
    );
};
