import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Trash } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Switch } from '@/components/ui/switch';
import { useOpenHours } from '@/features/hours/hooks/use-open-hours';
import { useGetHour } from '@/features/hours/api/use-get-hour';
import { useEditHours } from '@/features/hours/api/use-edit-hours';
import { insertHoursSchema } from '@/database/schema';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteHours } from '@/features/hours/api/use-delete-hours';

const formSchema = insertHoursSchema
    .pick({
        companyId: true,
        workDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
        isOvernightShift: true,
    })
    .extend({
        companyId: z.string({
            required_error: 'Company is required',
        }),
        workDate: z.date({
            required_error: 'Date is required',
        }),
        endDate: z
            .date({
                required_error: 'End date is required',
            })
            .optional(),
    })
    .refine(
        (data) => {
            if (data.isOvernightShift) {
                return true;
            }

            if (!data.startTime || !data.endTime) return true;

            const [startHour, startMinute] = data.startTime
                .split(':')
                .map(Number);
            const [endHour, endMinute] = data.endTime.split(':').map(Number);

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            return endMinutes > startMinutes;
        },
        {
            message: 'End time must be after start time',
            path: ['endTime'], // Show error on end time field
        }
    );

type FormValues = z.input<typeof formSchema>;

type Props = {
    companies: {
        id: number;
        name: string;
    }[];
};

export const EditHours = ({ companies }: Props) => {
    const { isOpen, onClose, id } = useOpenHours();

    const [ConfirmDialog, confirm] = useConfirm(
        'Delete Hours',
        'Are you sure you want to this working log?'
    );

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const hourQuery = useGetHour(id?.toString());
    const editMutation = useEditHours(id?.toString());
    const deleteMutation = useDeleteHours(id?.toString());

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const onSubmit = (values: FormValues) => {
        const modifiedValues = {
            ...values,
            companyId: parseInt(values.companyId),
            workDate: format(values.workDate, 'yyyy-MM-dd'),
            endDate: values.endDate
                ? format(values.endDate, 'yyyy-MM-dd')
                : undefined,
        };
        editMutation.mutate(modifiedValues, {
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

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            companyId: '',
            workDate: new Date(),
            endDate: undefined,
            startTime: '',
            endTime: '',
            isOvernightShift: false,
        },
    });

    // Reset form when data is loaded
    useEffect(() => {
        if (hourQuery.data && isOpen) {
            form.reset({
                companyId: hourQuery.data.companyId.toString(),
                workDate: new Date(hourQuery.data.workDate),
                endDate: hourQuery.data.endDate
                    ? new Date(hourQuery.data.endDate)
                    : undefined,
                startTime: hourQuery.data.startTime,
                endTime: hourQuery.data.endTime,
                isOvernightShift: hourQuery.data.isOvernightShift,
            });
        }
    }, [hourQuery.data, isOpen, form]);

    return (
        <>
            <ConfirmDialog />
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Work Hours</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            upate your time sheet
                        </DialogDescription>
                    </DialogHeader>
                    {hourQuery.isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="size-8 animate-spin" />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="isOvernightShift"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Overnight Shift
                                                </FormLabel>
                                                <FormDescription>
                                                    Toggle if shift continues to
                                                    next day
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="companyId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value || ''}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select company" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {companies.map(
                                                            (company) => (
                                                                <SelectItem
                                                                    key={
                                                                        company.id
                                                                    }
                                                                    value={company.id.toString()}
                                                                    className={
                                                                        field.value ===
                                                                        company.id.toString()
                                                                            ? 'bg-accent'
                                                                            : ''
                                                                    }
                                                                >
                                                                    {
                                                                        company.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="workDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col mt-2">
                                                <FormLabel>
                                                    {form.watch(
                                                        'isOvernightShift'
                                                    )
                                                        ? 'Start Date'
                                                        : 'Date'}
                                                </FormLabel>
                                                <Popover
                                                    open={isPopoverOpen}
                                                    onOpenChange={
                                                        setIsPopoverOpen
                                                    }
                                                >
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={
                                                                    'outline'
                                                                }
                                                                className={cn(
                                                                    'w-[240px] pl-3 text-left font-normal',
                                                                    !field.value &&
                                                                        'text-muted-foreground'
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(
                                                                        field.value,
                                                                        'PPP'
                                                                    )
                                                                ) : (
                                                                    <span>
                                                                        Pick a
                                                                        date
                                                                    </span>
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
                                                            }
                                                            onSelect={(
                                                                date
                                                            ) => {
                                                                field.onChange(
                                                                    date
                                                                );
                                                                setIsPopoverOpen(
                                                                    false
                                                                );
                                                            }}
                                                            disabled={(date) =>
                                                                date >
                                                                    new Date() ||
                                                                date <
                                                                    new Date(
                                                                        '1900-01-01'
                                                                    )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch('isOvernightShift') && (
                                        <FormField
                                            control={form.control}
                                            name="endDate"
                                            disabled={true}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col mt-2">
                                                    <FormLabel>
                                                        End Date
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    className={cn(
                                                                        'w-[240px] pl-3 text-left font-normal',
                                                                        !field.value &&
                                                                            'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(
                                                                            field.value,
                                                                            'PPP'
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
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
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                disabled={(
                                                                    date
                                                                ) => {
                                                                    const workDate =
                                                                        form.watch(
                                                                            'workDate'
                                                                        );
                                                                    const nextDay =
                                                                        new Date(
                                                                            workDate
                                                                        );
                                                                    nextDay.setDate(
                                                                        nextDay.getDate() +
                                                                            1
                                                                    );

                                                                    return (
                                                                        date.toDateString() !==
                                                                        nextDay.toDateString()
                                                                    );
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Start Time
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Time</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        !form.formState.isValid || isPending
                                    }
                                >
                                    Update
                                </Button>
                                <Button
                                    type="button"
                                    onClick={onDelete}
                                    variant={'outline'}
                                    className="w-full"
                                >
                                    <Trash className="size-4 mr-2" />
                                    Delete
                                </Button>
                            </form>
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
