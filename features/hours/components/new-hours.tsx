import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

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
    // FormDescription,
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

import { useGetCompanies } from '@/features/companies/api/use-get-companies';
import { useNewHours } from '@/features/hours/hooks/use-new-hours';
import { useCreateHours } from '@/features/hours/api/use-create-hours';
// import { Switch } from '@/components/ui/switch';
import { useBrowser } from '@/hooks/use-browser';
import { TimePicker } from '@/components/time-picker';

const formSchema = z
    .object({
        startDate: z.date({
            required_error: 'Date is required',
        }),
        endDate: z
            .date({
                required_error: 'End date is required',
            })
            .optional(),
        companyId: z.string({
            required_error: 'Company is required',
        }),
        startTime: z.string({
            required_error: 'Start time is required',
        }),
        endTime: z.string({
            required_error: 'End time is required',
        }),
        isOvernightShift: z.boolean().default(false),
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

type FormValues = z.infer<typeof formSchema>;

export const NewHours = () => {
    const { isOpen, onClose } = useNewHours();
    const { data: companies } = useGetCompanies();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const mutation = useCreateHours();

    //detect device
    const { isSafari } = useBrowser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            isOvernightShift: false,
            startDate: undefined,
            endDate: undefined,
        },
    });

    const onSubmit = (values: FormValues) => {
        const modifiedValues = {
            ...values,
            companyId: Number(values.companyId),
            workDate: format(values.startDate, 'yyyy-MM-dd'),
            endDate: values.endDate
                ? format(values.endDate, 'yyyy-MM-dd')
                : undefined,
        };

        mutation.mutate(modifiedValues, {
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    // Watch for startDate changes
    // Create stable references to watched values
    // const startDate = form.watch('startDate');
    // const isOvernightShift = form.watch('isOvernightShift');

    // useEffect(() => {
    //     if (startDate || form.getValues('isOvernightShift')) {
    //         form.setValue('endDate', addDays(startDate, 1));
    //     } else {
    //         form.setValue('endDate', undefined);
    //     }
    // }, [form, startDate, isOvernightShift]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Log Hours</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Enter you time sheet
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* TODO: need to fix issue */}
                        {/* <FormField
                            control={form.control}
                            name="isOvernightShift"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Overnight Shift
                                        </FormLabel>
                                        <FormDescription>
                                            Toggle if shift continues to next
                                            day
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> */}

                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="companyId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select company" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {companies?.map((company) => (
                                                    <SelectItem
                                                        key={company.id}
                                                        value={company.id.toString()}
                                                    >
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col mt-2">
                                        <FormLabel>
                                            {form.watch('isOvernightShift')
                                                ? 'Start Date'
                                                : 'Date'}
                                        </FormLabel>
                                        {isSafari ? (
                                            <Dialog
                                                open={isPopoverOpen}
                                                onOpenChange={setIsPopoverOpen}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-[240px] pl-3 text-left font-normal"
                                                        onClick={() =>
                                                            setIsPopoverOpen(
                                                                true
                                                            )
                                                        }
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                'PPP'
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="w-auto p-4">
                                                    <DialogTitle className="hidden">
                                                        select a date
                                                    </DialogTitle>
                                                    <DialogDescription className="hidden">
                                                        the date you have worked
                                                    </DialogDescription>
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value
                                                                ? new Date(
                                                                      field.value
                                                                  )
                                                                : undefined
                                                        }
                                                        defaultMonth={
                                                            field.value
                                                                ? new Date(
                                                                      field.value
                                                                  )
                                                                : new Date()
                                                        }
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                                new Date(
                                                                    '1900-01-01'
                                                                )
                                                        }
                                                        onSelect={(date) => {
                                                            field.onChange(
                                                                date
                                                            );
                                                            setIsPopoverOpen(
                                                                false
                                                            );
                                                        }}
                                                        initialFocus
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
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
                                                            onClick={() =>
                                                                setIsPopoverOpen(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    'PPP'
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
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
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(
                                                                date
                                                            );
                                                            setIsPopoverOpen(
                                                                false
                                                            );
                                                        }}
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                                new Date(
                                                                    '1900-01-01'
                                                                )
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
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
                                            <FormLabel>End Date</FormLabel>
                                            {isSafari ? (
                                                <Dialog
                                                    open={isPopoverOpen}
                                                    onOpenChange={
                                                        setIsPopoverOpen
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-[240px] pl-3 text-left font-normal"
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    'PPP'
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-auto p-4">
                                                        <DialogTitle className="hidden">
                                                            select a date
                                                        </DialogTitle>
                                                        <DialogDescription className="hidden">
                                                            the date you have
                                                            worked
                                                        </DialogDescription>
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                field.value
                                                                    ? new Date(
                                                                          field.value
                                                                      )
                                                                    : undefined
                                                            }
                                                            defaultMonth={
                                                                field.value
                                                                    ? new Date(
                                                                          field.value
                                                                      )
                                                                    : new Date()
                                                            }
                                                            disabled={(date) =>
                                                                date >
                                                                    new Date() ||
                                                                date <
                                                                    new Date(
                                                                        '1900-01-01'
                                                                    )
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
                                                            initialFocus
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
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
                                            )}
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
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            {isSafari ? (
                                                <TimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            ) : (
                                                <Input
                                                    type="time"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            )}
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
                                            {isSafari ? (
                                                <TimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            ) : (
                                                <Input
                                                    type="time"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            )}
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
                                !form.formState.isValid || mutation.isPending
                            }
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
