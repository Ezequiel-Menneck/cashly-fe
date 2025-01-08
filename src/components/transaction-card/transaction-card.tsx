import { fetchDeleteUserTransaction, fetchGetAllCategories, fetchUpdateTransaction, fetchUserData } from '@/api/user';
import { GraphQLResponse } from '@/graphql/dataWrapper';
import { FindUserByIdentifierResponse, Transaction } from '@/graphql/types';
import { useUserInfo } from '@/hooks/useUserInfo';
import { formatDate, formatToBRLToShow } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2Icon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import LoadingFetchData from '../loading-fetch-data/loading-fetch-data';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CurrencyInput } from '../ui/currency-input';
import { DatePicker } from '../ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const TransactionTypeSchema = z.enum(['CREDIT', 'DEBIT']);

const formSchema = z.object({
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

export default function TransactionCard() {
    const [transactionModals, setTransactionModals] = useState<{ deleteModal: boolean; editModal: boolean }>({
        deleteModal: false,
        editModal: false
    });
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
    const queryClient = useQueryClient();
    const userInfo = useUserInfo();
    const { isPending, data } = useQuery<GraphQLResponse<FindUserByIdentifierResponse>>({
        queryKey: ['getUserData'],
        queryFn: () => fetchUserData(userInfo.uid)
    });
    const { data: categoriesData } = useQuery({
        queryKey: ['getAllCategories'],
        queryFn: fetchGetAllCategories,
        enabled: transactionModals.editModal
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            description: '',
            transactionDate: new Date(),
            type: 'CREDIT',
            categoryName: ''
        }
    });

    useEffect(() => {
        if (selectedTransaction) {
            form.reset({
                amount: selectedTransaction.amount || 0,
                description: selectedTransaction.description || '',
                transactionDate: selectedTransaction.transactionDate ? new Date(selectedTransaction.transactionDate) : new Date(),
                type:
                    selectedTransaction.type === 'CREDIT' || selectedTransaction.type === 'DEBIT'
                        ? selectedTransaction.type
                        : 'CREDIT',
                categoryName: selectedTransaction.categoryId || null
            });
        }
    }, [selectedTransaction, form]);

    function handleOpenModal(transactionId: Transaction, modalType: 'deleteModal' | 'editModal') {
        setSelectedTransaction(transactionId);
        setTransactionModals({ ...transactionModals, [modalType]: true });
    }

    async function handleExcludeTransaction() {
        if (selectedTransaction) {
            await fetchDeleteUserTransaction(userInfo.uid, selectedTransaction.id);
            setTransactionModals({ ...transactionModals, deleteModal: false });
            queryClient.invalidateQueries({ queryKey: ['getUserData'] });
            queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByDate'] });
            queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByCategory'] });
            queryClient.invalidateQueries({ queryKey: ['getUserBaseSalaryAndSumTransactionsAmount'] });
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (selectedTransaction) {
            console.log('aaaa');
            await fetchUpdateTransaction({ identifier: userInfo.uid, transactionId: selectedTransaction.id, ...values });
            setTransactionModals({ ...transactionModals, editModal: false });
            queryClient.invalidateQueries({ queryKey: ['getUserData'] });
            queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByDate'] });
            queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByCategory'] });
            queryClient.invalidateQueries({ queryKey: ['getUserBaseSalaryAndSumTransactionsAmount'] });
        }
    }

    if (isPending) {
        return <LoadingFetchData />;
    }

    return (
        <>
            <div>Filtros</div>
            {data?.data?.findUserByIdentifier &&
                data.data.findUserByIdentifier.transactions.length > 0 &&
                data.data.findUserByIdentifier.transactions.map((t) => (
                    <Card className="mb-4" key={t.id}>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="mb-2">{t.description}</CardTitle>
                                <CardDescription>{formatDate(t.transactionDate)}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button className="bg-primary" onClick={() => handleOpenModal(t, 'deleteModal')}>
                                    <Trash2 />
                                </Button>
                                <Button className="bg-edit hover:bg-edit-hover" onClick={() => handleOpenModal(t, 'editModal')}>
                                    <Edit2Icon />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span>Valor da transação: {formatToBRLToShow(t.amount)}</span>
                                    <span>Categoria da transação: {t.categoryName}</span>
                                </div>
                                <Badge
                                    className={`${t.type == 'CREDIT' ? 'bg-green-500' : 'bg-red-500'} text-black hover:bg-slate-900 w-fit`}
                                >
                                    {t.type == 'CREDIT' ? 'Credito' : 'Débito'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}

            <Dialog
                open={transactionModals.deleteModal}
                onOpenChange={(open) => setTransactionModals({ ...transactionModals, deleteModal: open })}
            >
                <DialogContent className="w-72">
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão de transação</DialogTitle>
                        <DialogDescription>Você tem certeza que deseja excluir essa transação?</DialogDescription>
                    </DialogHeader>
                    <Button size="sm" className="px-3" onClick={handleExcludeTransaction}>
                        Confirmar
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog
                open={transactionModals.editModal}
                onOpenChange={(open) => setTransactionModals({ ...transactionModals, editModal: open })}
            >
                <DialogContent className="w-72">
                    <DialogHeader>
                        <DialogTitle>Editar Transação</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-col justify-between">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel className="pl-1">Valor da Transação</FormLabel>
                                            <FormControl>
                                                <CurrencyInput
                                                    placeholder="R$ 0,00"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel className="pl-1">Descrição da Transação</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Descrição da sua Transação" {...field} value={field.value} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="transactionDate"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel className="pl-1">Data da Transação</FormLabel>
                                            <FormControl>
                                                <DatePicker onChange={field.onChange} value={field.value} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel className="pl-1">Tipo da Transação</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={selectedTransaction?.type}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo da transação" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={TransactionTypeSchema.Enum.CREDIT}>Crédito</SelectItem>
                                                    <SelectItem value={TransactionTypeSchema.Enum.DEBIT}>Débito</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryName"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel className="pl-1">Tipo da Transação</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={selectedTransaction?.categoryName}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo da transação" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoriesData?.data?.findAll &&
                                                        categoriesData.data.findAll.length > 0 &&
                                                        categoriesData.data.findAll.map((category) => (
                                                            <SelectItem value={category.name} key={category.name}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-end justify-end">
                                <Button type="submit">Confirmar</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
