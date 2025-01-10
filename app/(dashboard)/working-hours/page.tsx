'use client';

import { Loader2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { useNewHours } from '@/features/hours/hooks/use-new-hours';
import { NewHours } from '@/features/hours/components/new-hours';
import { CurrentFortnight } from '@/features/hours/components/current-fortnight';
import { EditHours } from '@/features/hours/components/edit-hours';
import { useGetCompanies } from '@/features/companies/api/use-get-companies';

export default function Hours() {
    const { onOpen } = useNewHours();

    const { data } = useGetCompanies();

    const companiesData =
        data?.map((company) => ({
            id: company.id,
            name: company.name,
        })) || [];

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <div className="mt-4 flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <Heading
                    title="Working Hours"
                    description="Manage your hours here."
                />
                <Button onClick={onOpen} size="sm" className="mt-4">
                    <Plus className="size-4 mr-2" />
                    Log Hours
                </Button>
            </div>
            <Separator className="mt-4" />
            {false ? (
                <div className="fixed inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="size-8 text-muted-foreground animate-spin" />
                </div>
            ) : (
                <div>
                    {/* working hours list*/}
                    <NewHours />
                    <CurrentFortnight />
                    <EditHours companies={companiesData} />
                </div>
            )}
        </div>
    );
}
