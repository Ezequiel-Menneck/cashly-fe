import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface FilterComponentProps {
    categories: string[];
    types: string[];
    onFilterChange: (filters: FilterCriteria) => void;
}

interface FilterCriteria {
    category: string;
    date: Date | undefined;
    type: string;
}

export function FilterComponent({ categories, types, onFilterChange }: FilterComponentProps) {
    const [filters, setFilters] = useState<FilterCriteria>({
        category: '',
        date: undefined,
        type: ''
    });

    const handleFilterChange = (key: keyof FilterCriteria, value: string | Date | undefined) => {
        const newFilters = {
            ...filters,
            [key]: value === 'all' ? '' : value
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="flex flex-wrap space-x-1 w-4/5">
            <div className="flex-1">
                <Label htmlFor="category">Categoria</Label>
                <Select onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione uma categoria!" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Qualquer Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1">
                <Label htmlFor="date">Data</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={`w-full justify-start text-left font-normal ${!filters.date && 'text-muted-foreground'}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.date ? format(filters.date, 'PPP', { locale: ptBR }) : <span>Escolha a Data</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={filters.date}
                            onSelect={(date) => handleFilterChange('date', date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex-1">
                <Label htmlFor="type">Tipo da transação</Label>
                <Select onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Selecione um tipo!" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Qualquer Tipo</SelectItem>
                        {types.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type == 'CREDIT' ? 'Crédito' : 'Débito'}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
