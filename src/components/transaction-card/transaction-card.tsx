import { formSchemaForTransactions } from '@/@types/form';
import { fetchDeleteUserTransaction, fetchGetAllCategories, fetchUpdateTransaction, fetchUserData } from '@/api/user';
import { useUser } from '@/context/user-context';
import { GraphQLResponse } from '@/graphql/dataWrapper';
import { FindUserByIdentifierResponse, Transaction, TransactionType } from '@/graphql/types';
import { formatDate, formatToBRLToShow, resetUserQueries } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2Icon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreateTransactionAndCategoryTab } from '../create-transaction-and-category-tabs/create-transaction-and-category-tabs';
import { FilterComponent } from '../filter-component/filter-component';
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

const transactionsForm = formSchemaForTransactions;

export default function TransactionCard() {
    const queryClient = useQueryClient();
    const [transactionModals, setTransactionModals] = useState<{ deleteModal: boolean; editModal: boolean }>({
        deleteModal: false,
        editModal: false
    });
    const [createTransactionOrCategoryModal, setCreateTransactionOrCategoryModal] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
    const { userInfo } = useUser();
    const { isPending, data } = useQuery<GraphQLResponse<FindUserByIdentifierResponse>>({
        queryKey: ['getUserData', userInfo.uid],
        queryFn: () => fetchUserData(userInfo.uid)
    });
    const { data: categoriesData } = useQuery({
        queryKey: ['getAllCategories'],
        queryFn: fetchGetAllCategories
    });
    const [filteredData, setFilteredData] = useState<Transaction[] | undefined>(
        data?.data?.findUserByIdentifier?.transactions || []
    );
    const categories =
        categoriesData?.data?.findAll != null && categoriesData?.data?.findAll.length > 0
            ? categoriesData?.data?.findAll.map((category) => category.name)
            : [];
    const types: TransactionType[] = ['CREDIT', 'DEBIT'];

    const handleFilterChange = (filters: { category: string; date: Date | undefined; type: string }) => {
        if (data?.data?.findUserByIdentifier != null && data.data.findUserByIdentifier.transactions.length > 0) {
            const transactions = data.data.findUserByIdentifier.transactions;
            const filtered = transactions.filter((item) => {
                const categoryMatch = !filters.category || item.categoryName === filters.category;
                const typeMatch = !filters.type || item.type === filters.type;
                const dateMatch = !filters.date || new Date(item.transactionDate).toDateString() === filters.date.toDateString(); // Updated date comparison
                return categoryMatch && typeMatch && dateMatch;
            });
            setFilteredData(filtered);
            return;
        }
        setFilteredData([]);
    };

    function handleCreateTransactionOrCategoryModal() {
        setCreateTransactionOrCategoryModal(!createTransactionOrCategoryModal);
    }

    const form = useForm<z.infer<typeof transactionsForm>>({
        resolver: zodResolver(transactionsForm),
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
                categoryName: selectedTransaction.categoryId
            });
        }
    }, [selectedTransaction, form]);

    useEffect(() => {
        handleFilterChange({ category: '', date: undefined, type: '' });
    }, [data]);

    function handleOpenModal(transactionId: Transaction, modalType: 'deleteModal' | 'editModal') {
        setSelectedTransaction(transactionId);
        setTransactionModals({ ...transactionModals, [modalType]: true });
    }

    async function handleExcludeTransaction() {
        if (selectedTransaction) {
            await fetchDeleteUserTransaction(userInfo.uid, selectedTransaction.id);
            setTransactionModals({ ...transactionModals, deleteModal: false });
            resetUserQueries(queryClient);
        }
    }

    async function onSubmit(values: z.infer<typeof transactionsForm>) {
        if (selectedTransaction) {
            await fetchUpdateTransaction({ identifier: userInfo.uid, transactionId: selectedTransaction.id, ...values });
            setTransactionModals({ ...transactionModals, editModal: false });
            resetUserQueries(queryClient);
        }
    }

    if (isPending) {
        return <LoadingFetchData />;
    }

    return (
        <>
            <div className="flex flex-wrap items-center space-y-6 justify-between mb-2">
                <FilterComponent categories={categories} types={types} onFilterChange={handleFilterChange} />
                <Button
                    className="bg-gradient-to-r from-[#16A34A] to-[#FFD60A] hover:bg-gradient-to-r hover:from-[#0F7A37] hover:to-[#CCAA08]"
                    onClick={handleCreateTransactionOrCategoryModal}
                >
                    Adicionar / Editar
                </Button>
            </div>
            {filteredData && filteredData.length > 0 ? (
                filteredData.map((t) => (
                    <Card className="mb-4" key={t.id}>
                        <CardHeader className="flex flex-row items-start justify-between pt-3 pb-3 pr-6 pl-6">
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
                        <CardContent className="p-6 pt-0 pb-3 ">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span>Valor da transação: {formatToBRLToShow(t.amount)}</span>
                                    <span>Categoria da transação: {t.categoryName}</span>
                                </div>
                                <Badge
                                    className={`${t.type == 'CREDIT' ? 'bg-green-500 hover:bg-green-800' : 'bg-red-500 hover:bg-red-800'} text-black w-fit`}
                                >
                                    {t.type == 'CREDIT' ? 'Credito' : 'Débito'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center mt-4">Nenhuma transação disponível.</div>
            )}

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
                                                    {categories.length > 0 &&
                                                        categories.map((category) => (
                                                            <SelectItem value={category} key={category}>
                                                                {category}
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

            <CreateTransactionAndCategoryTab
                categories={categories}
                open={createTransactionOrCategoryModal}
                onClose={handleCreateTransactionOrCategoryModal}
            />
        </>
    );
}
