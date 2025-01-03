import { formatToBRL } from '@/utils/utils';
import { Input } from './input';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number;
    onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
    return (
        <Input
            {...props}
            value={value ? formatToBRL(value / 100) : ''}
            onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                const numberValue = rawValue ? Number(rawValue) : 0;
                onChange(numberValue);
            }}
            onKeyDown={(e) => {
                if (
                    !/[\d]/.test(e.key) &&
                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey
                ) {
                    e.preventDefault();
                }
            }}
        />
    );
}
