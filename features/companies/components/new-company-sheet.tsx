import { z } from 'zod';

import { useNewCompany } from '@/features/companies/hooks/use-new-company';
import { CompanyForm } from '@/features/companies/components/company-form';
import { useCreateCompany } from '@/features/companies/api/use-create-company';

import { insertCompanySchema } from '@/database/schema';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCompanySchema.pick({
    name: true,
    jobRole: true,
    joiningDate: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewCompanySheet = () => {
    const { isOpen, onClose } = useNewCompany();

    const mutation = useCreateCompany();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>{'Add Company'}</SheetTitle>
                    <SheetDescription>
                        {'Add a company to track your earnings.'}
                    </SheetDescription>
                </SheetHeader>
                <CompanyForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                />
            </SheetContent>
        </Sheet>
    );
};
