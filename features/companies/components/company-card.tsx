/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { selectCompanySchema } from '@/database/schema';
import { useOpenCompany } from '@/features/companies/hooks/use-open-company';
import { differenceInMonths, differenceInYears } from 'date-fns';

const companySchema = selectCompanySchema.pick({
    id: true,
    name: true,
    jobRole: true,
    joiningDate: true,
});

type companyValue = z.infer<typeof companySchema>;

type Props = {
    data: companyValue;
};

export const CompanyCard = ({ data }: Props) => {
    const { onOpen } = useOpenCompany();

    const calculateExperience = (joiningDate: string | null) => {
        if (!joiningDate) return 'N/A';

        const startDate = new Date(joiningDate);
        const currentDate = new Date();
        const years = differenceInYears(currentDate, startDate);
        const months = differenceInMonths(currentDate, startDate) % 12;

        if (years === 0) {
            if (months === 0) {
                return 'Experience: Less than a month';
            }
            return ` Experience: ${months} month${months > 1 ? 's' : ''}`;
        }
        return `${years} year${years > 1 ? 's' : ''} ${months} month${
            months > 1 ? 's' : ''
        }`;
    };

    return (
        <>
            <Card
                className="w-[350px] hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onOpen(data.id)}
            >
                <CardHeader>
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription>{data.jobRole}</CardDescription>
                </CardHeader>
                <CardFooter className="text-muted-foreground text-sm">
                    {calculateExperience(data.joiningDate)}
                </CardFooter>
            </Card>
        </>
    );
};
