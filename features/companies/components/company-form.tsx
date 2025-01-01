import { useState } from 'react';
import { CalendarIcon, Trash } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { insertCompanySchema } from '@/database/schema';

import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const formSchema = insertCompanySchema.pick({
    name: true,
    jobRole: true,
    joiningDate: true,
    wageDayPay: true,
    wageNightPay: true,
    wageSaturdayPay: true,
    wageSundayPay: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: number;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

export const CompanyForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;

        // Adjust for timezone offset
        const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localDate = new Date(date.getTime() - tzOffset);

        setIsPopoverOpen(false);
        form.setValue('joiningDate', localDate.toISOString().split('T')[0]);
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-4"
            >
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Company Name"
                                    disabled={disabled}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="jobRole"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Role</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Job Role"
                                    disabled={disabled}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="joiningDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Joining Date</FormLabel>
                            <Popover
                                open={isPopoverOpen}
                                onOpenChange={setIsPopoverOpen}
                            >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'w-[240px] pl-3 text-left font-normal',
                                                !field.value &&
                                                    'text-muted-foreground'
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, 'PPP')
                                            ) : (
                                                <span>Choose a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            field.value
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        defaultMonth={
                                            field.value
                                                ? new Date(field.value)
                                                : new Date()
                                        }
                                        onSelect={(date) => {
                                            field.onChange(date);
                                            handleDateSelect(date);
                                        }}
                                        disabled={(date) =>
                                            date > new Date() ||
                                            date < new Date('1900-01-01')
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                The date you joined the company.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-y-4">
                    <Label className="text-base">Wage</Label>
                    <Separator />
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm text-muted-foreground">
                                Weekday Pay
                            </Label>
                            <div className="flex flex-row gap-4 ">
                                <FormField
                                    name="wageDayPay"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Day Pay</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    disabled={disabled}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="wageNightPay"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Night Pay</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    disabled={disabled}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm text-muted-foreground">
                                Weekend Pay
                            </Label>
                            <div className="flex flex-row gap-4">
                                <FormField
                                    name="wageSaturdayPay"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Saturday Pay</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    disabled={disabled}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="wageSundayPay"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sunday Pay</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    disabled={disabled}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Button className="w-full" disabled={disabled}>
                    {id ? 'Save Changes' : 'Create Company'}
                </Button>
                {!!id && (
                    <Button
                        className="w-full"
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={disabled}
                        size="icon"
                    >
                        <Trash className="size-4 mr-2" />
                        Delete Company
                    </Button>
                )}
            </form>
        </Form>
    );
};
