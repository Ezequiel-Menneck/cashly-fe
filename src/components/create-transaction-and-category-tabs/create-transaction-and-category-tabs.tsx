import {
    formSchemaForCategories,
    formSchemaForTransactions,
    formSchemaForUpdateCategory,
    TransactionTypeSchema
} from '@/@types/form';
import { fetchCreateCategory, fetchCreateTransaction, fetchUpdateCategory } from '@/api/user';
import { useUser } from '@/context/user-context';
import { resetCategoryQueries, resetUserQueries } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { CurrencyInput } from '../ui/currency-input';
import { DatePicker } from '../ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const transactionFormSchema = formSchemaForTransactions;
const categoryFormSchema = formSchemaForCategories;
const editCategoryFormSchema = formSchemaForUpdateCategory;

export function CreateTransactionAndCategoryTab({
    categories,
    open,
    onClose
}: {
    categories: string[];
    open: boolean;
    onClose: () => void;
}) {
    const { userInfo } = useUser();
    const queryClinet = useQueryClient();

    const transactionsForm = useForm<z.infer<typeof transactionFormSchema>>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            amount: 0,
            categoryName: '',
            description: '',
            transactionDate: new Date(),
            type: 'CREDIT'
        }
    });

    const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: ''
        }
    });

    const editCategoryForm = useForm<z.infer<typeof editCategoryFormSchema>>({
        resolver: zodResolver(editCategoryFormSchema),
        defaultValues: {
            oldName: '',
            newName: ''
        }
    });

    async function onTransactionCreateSubmit(values: z.infer<typeof transactionFormSchema>) {
        const result = await fetchCreateTransaction({ identifier: userInfo.uid, ...values });
        if (!result.errors) {
            resetUserQueries(queryClinet);
            onClose();
            transactionsForm.reset();
        }
    }

    async function onCategoryCreateSubmit(values: z.infer<typeof categoryFormSchema>) {
        const result = await fetchCreateCategory(values);
        if (!result.errors) {
            resetCategoryQueries(queryClinet);
            onClose();
        }
    }

    async function onCategoryUpdateSubmit(values: z.infer<typeof editCategoryFormSchema>) {
        const result = await fetchUpdateCategory(values);
        if (!result.errors) {
            resetCategoryQueries(queryClinet);
            resetUserQueries(queryClinet);
            onClose();
        }
    }

    return (
        <Dialog open={open} modal={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle className="hidden" />
                <DialogDescription className="hidden" />
                <Tabs defaultValue="transaction" className="w-full h-full p-3">
                    <TabsList className="grid w-full grid-cols-3 gap-2">
                        <TabsTrigger value="transaction" className="truncate">
                            Transação
                        </TabsTrigger>
                        <TabsTrigger value="category" className="truncate">
                            Categoria
                        </TabsTrigger>
                        <TabsTrigger value="edit-category" className="truncate">
                            Editar categoria
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="transaction">
                        <Form {...transactionsForm}>
                            <form
                                onSubmit={transactionsForm.handleSubmit(onTransactionCreateSubmit)}
                                className="space-y-3 space-x-3"
                            >
                                <div className="flex flex-col justify-between">
                                    <FormField
                                        control={transactionsForm.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor da transação</FormLabel>
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
                                        control={transactionsForm.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="mb-2">
                                                <FormLabel>Descrição da transação</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        onChange={field.onChange}
                                                        value={field.value}
                                                        placeholder="Digite sua descrição aqui"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={transactionsForm.control}
                                        name="transactionDate"
                                        render={({ field }) => (
                                            <FormItem className="mb-2">
                                                <FormLabel>Data da transação</FormLabel>
                                                <FormControl>
                                                    <DatePicker onChange={field.onChange} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={transactionsForm.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="mb-2">
                                                <FormLabel className="pl-1">Tipo da Transação</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={TransactionTypeSchema.Enum.CREDIT}
                                                >
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
                                        control={transactionsForm.control}
                                        name="categoryName"
                                        render={({ field }) => (
                                            <FormItem className="mb-2">
                                                <FormLabel className="pl-1">Categoria da Transação</FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a categoria da transação" />
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
                    </TabsContent>
                    <TabsContent value="category">
                        <Form {...categoryForm}>
                            <form onSubmit={categoryForm.handleSubmit(onCategoryCreateSubmit)} className="space-x-3 space-y-3">
                                <FormField
                                    control={categoryForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel>Nome da sua categoria</FormLabel>
                                            <FormControl>
                                                <Input
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    placeholder="Digite o nome da sua categoria"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-end justify-end">
                                    <Button type="submit">Confirmar</Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="edit-category">
                        <Form {...editCategoryForm}>
                            <form onSubmit={editCategoryForm.handleSubmit(onCategoryUpdateSubmit)} className="space-y-3 mt-3">
                                <FormField
                                    control={editCategoryForm.control}
                                    name="oldName"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel>Qual categoria você deseja editar?</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a categoria a editar" />
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
                                <FormField
                                    control={editCategoryForm.control}
                                    name="newName"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel>Qual o novo nome da categoria?</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Digite aqui o novo nome da categoria"
                                                    {...field}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-end justify-end">
                                    <Button>Confirmar</Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
