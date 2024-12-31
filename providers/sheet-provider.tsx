'use client';

import { EditCompanySheet } from '@/features/companies/components/edit-company-sheet';
import { NewCompanySheet } from '@/features/companies/components/new-company-sheet';

export const SheetProvider = () => {
    return (
        <>
            <NewCompanySheet />
            <EditCompanySheet />
        </>
    );
};
