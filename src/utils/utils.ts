import { QueryClient } from '@tanstack/react-query';
export const formatToBRL = (value: number): string => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const formatToBRLToShow = (value: number): string => {
    value = value / 100;
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export function formatDate(isoString: string) {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

export function resetUserQueries(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: ['getUserData'] });
    queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByDate'] });
    queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByCategory'] });
    queryClient.invalidateQueries({ queryKey: ['getUserBaseSalaryAndSumTransactionsAmount'] });
}

export function resetCategoryQueries(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: ['getAllCategories'] });
}
