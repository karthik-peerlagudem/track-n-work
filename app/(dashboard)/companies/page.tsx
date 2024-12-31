'use client';

import { Loader2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { useNewCompany } from '@/features/companies/hooks/use-new-company';
import { CompanyCard } from '@/features/companies/components/company-card';
import { useGetCompanies } from '@/features/companies/api/use-get-companies';

export default function Companies() {
    const { onOpen } = useNewCompany();

    const { data, isLoading } = useGetCompanies();

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <div className="mt-4 flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <Heading
                    title="Companies"
                    description="Manage your companies here."
                />
                <Button onClick={onOpen} size="sm" className="mt-4">
                    <Plus className="size-4 mr-2" />
                    Add new
                </Button>
            </div>
            <Separator className="mt-4" />
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="size-8 text-muted-foreground animate-spin" />
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.map((company) => (
                        <CompanyCard data={company} key={company.id} />
                    ))}
                </div>
            )}
        </div>
    );
}
