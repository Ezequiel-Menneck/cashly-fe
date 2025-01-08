'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export function DatePicker({ onChange, value }: { onChange: (date: Date | undefined) => void; value: Date }) {
    const [, setDate] = React.useState<Date>();

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        onChange(selectedDate);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, 'PPP', { locale: ptBR }) : <span>Escolha a Data</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={value} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
        </Popover>
    );
}
