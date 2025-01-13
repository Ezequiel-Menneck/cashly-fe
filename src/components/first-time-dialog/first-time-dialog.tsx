import { formSchemaBaseSalary } from '@/@types/form';
import { fetchCreateUser } from '@/api/user';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@/context/user-context';
import { resetUserQueries } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { CurrencyInput } from '../ui/currency-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Separator } from '../ui/separator';

const formSchema = formSchemaBaseSalary;

export default function FirstTimeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { userInfo, updateUser } = useUser();
    const queryClinet = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            baseSalary: undefined
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        updateUser({ uid: userInfo.uid });
        await fetchCreateUser({ identifier: userInfo.uid, baseSalary: values.baseSalary });
        form.reset();
        onClose();
        resetUserQueries(queryClinet);
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col justify-between">
                            <DialogHeader>
                                <DialogTitle>Bem vindo ao Cashly!</DialogTitle>
                                <div className="flex flex-col justify-between">
                                    <DialogDescription className="mb-2">
                                        Sua ferramente completa para gerenciar sua vida financeira.
                                    </DialogDescription>
                                    <Separator />
                                    <DialogDescription className="mt-2">
                                        Sua "conta" é representada pelo seu UID: {<strong>{userInfo.uid}</strong>}. Guarde-o em um
                                        local securo pois ele é a sua chave para acessar suas informações de qualquer dispositivo
                                    </DialogDescription>
                                    <DialogDescription className="mt-2 mb-2">
                                        Digite o seu salário base para começar a usar o <strong>Cashly</strong>!
                                    </DialogDescription>
                                    <FormField
                                        control={form.control}
                                        name="baseSalary"
                                        render={({ field }) => (
                                            <FormItem className="mb-2">
                                                <FormLabel>Salário base mensal</FormLabel>
                                                <FormControl>
                                                    <CurrencyInput
                                                        placeholder="R$ 0,00"
                                                        value={field.value || 0}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogDescription className="mt-2 mb-2 text-xs">
                                    <i>Essas informações são necessárias para melhorar sua experiencia conosco</i>
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="min-w-[100px]">
                                Ok!
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
