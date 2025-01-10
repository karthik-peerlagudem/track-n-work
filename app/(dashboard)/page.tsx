import { DataCharts } from '@/features/dashboard/components/data-charts';
import { SummaryCards } from '@/features/dashboard/components/summary-cards';

export default function Home() {
    return (
        <div className="mt-4">
            <SummaryCards />
            <DataCharts />
        </div>
    );
}
