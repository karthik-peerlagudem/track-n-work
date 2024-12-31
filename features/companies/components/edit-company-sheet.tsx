import { z } from 'zod';

import { CompanyForm } from '@/features/companies/components/company-form';
import { useOpenCompany } from '@/features/companies/hooks/use-open-company';
import { useGetCompany } from '@/features/companies/api/use-get-company';
import { useEditCompany } from '@/features/companies/api/use-edit-company';
import { useDeleteCompany } from '@/features/companies/api/use-delete-company';

import { insertCompanySchema } from '@/database/schema';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCompanySchema.pick({
    name: true,
    jobRole: true,
    joiningDate: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCompanySheet = () => {
    const { isOpen, onClose, id } = useOpenCompany();

    const [ConfirmDialog, confirm] = useConfirm(
        'Delete Company',
        'Are you sure you want to delete this company?'
    );

    const companyQuery = useGetCompany(id?.toString());
    const editMutation = useEditCompany(id?.toString());
    const deleteMutation = useDeleteCompany(id?.toString());

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const defaultValues = companyQuery.data
        ? {
              name: companyQuery.data.name,
              jobRole: companyQuery.data.jobRole,
              joiningDate: companyQuery.data.joiningDate,
          }
        : {
              name: '',
              jobRole: '',
              joiningDate: '',
          };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>Edit Company</SheetTitle>
                        <SheetDescription>
                            Update company details
                        </SheetDescription>
                    </SheetHeader>
                    {companyQuery.isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : companyQuery.error ? (
                        <div className="text-red-500">
                            Error loading company data
                        </div>
                    ) : (
                        <CompanyForm
                            id={id}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            defaultValues={defaultValues}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
