import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TimePickerProps {
    value?: string;
    onChange: (value: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
);

const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
);

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
    const [hour, minute] = value?.split(':') || ['00', '00'];

    return (
        <div className="flex items-center gap-2">
            <Select
                value={hour}
                onValueChange={(h) => onChange(`${h}:${minute}:00`)}
            >
                <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={hour} />
                </SelectTrigger>
                <SelectContent>
                    {hours.map((h) => (
                        <SelectItem key={h} value={h}>
                            {h}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <span>:</span>

            <Select
                value={minute}
                onValueChange={(m) => onChange(`${hour}:${m}:00`)}
            >
                <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={minute} />
                </SelectTrigger>
                <SelectContent>
                    {minutes.map((m) => (
                        <SelectItem key={m} value={m}>
                            {m}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
