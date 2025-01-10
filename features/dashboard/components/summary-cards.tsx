'use client';
import { BadgeDollarSign, Building2, Clock, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useGetSummary } from '@/features/dashboard/api/use-get-summary';

export const SummaryCards = () => {
    const { data: summaryData, isLoading } = useGetSummary();

    return (
        <>
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="size-8 text-muted-foreground animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-3xl font-semibold">
                                {summaryData?.totalWorkingHours} hrs
                            </CardTitle>
                            <Clock className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl text-muted-foreground">
                                Total Hours
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-3xl font-semibold">
                                {`$${summaryData?.totalEarnings}`}
                            </CardTitle>
                            <BadgeDollarSign className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl text-muted-foreground">
                                Estimated Total Pay
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-3xl font-semibold">
                                {summaryData?.companiesCount}
                            </CardTitle>
                            <Building2 className="h-6  w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl text-muted-foreground">
                                Companies
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};
