import { z } from 'zod';

export const TransactionTypeSchema = z.enum(['CREDIT', 'DEBIT']);

export const formSchemaForTransactions = z.object({
    amount: z
        .number({
            required_error: 'O valor da transação é obrigatório',
            invalid_type_error: 'O valor da transação deve ser um número'
        })
        .positive({ message: 'O valor da transação deve ser maior que 0' }),
    transactionDate: z.date(),
    description: z
        .string()
        .min(3, { message: 'A descriçao deve ao menos conter 3 caracteres' })
        .max(150, { message: 'A descrição deve ter no máximo 100 caracteres' }),
    type: TransactionTypeSchema,
    categoryName: z.string().nullable()
});

export const formSchemaForCategories = z.object({
    name: z
        .string()
        .min(3, { message: 'O nome da categoria deve ao menos conter 3 caracteres' })
        .max(50, { message: 'O nome da categoria deve no maximo conter 50 caracteres' })
});
