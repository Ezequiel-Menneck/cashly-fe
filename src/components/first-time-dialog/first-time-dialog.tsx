import { fetchCreateUser } from '@/api/user';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSaveUserInfo, useUserInfo } from '@/hooks/useUserInfo';
import { formatToBRL } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres' })
        .max(30, { message: 'O nome de usuário deve ter no máximo 30 caracteres' }),
    baseSalary: z
        .number({
            required_error: 'O salário base é obrigatório',
            invalid_type_error: 'O salário base deve ser um número'
        })
        .positive({ message: 'O salário base deve ser maior que zero' })
});

export default function FirstTimeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const userINFO = useUserInfo();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            baseSalary: undefined
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        useSaveUserInfo({ uid: userINFO.uid, username: values.username });
        await fetchCreateUser({ username: values.username, identifier: userINFO.uid, baseSalary: values.baseSalary });
        form.reset();
        onClose();
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
                                        Sua "conta" é representada pelo seu UID: {<strong>{userINFO?.uid}</strong>}. Guarde-o em
                                        um local securo pois ele é a sua chave para acessar suas informações de qualquer
                                        dispositivo
                                    </DialogDescription>
                                    <DialogDescription className="mt-2 mb-2">
                                        Digite o seu nome de usuário desejado e seu salário base para começar a usar o{' '}
                                        <strong>Cashly</strong>!
                                    </DialogDescription>
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem className="mb-2">
                                                <FormLabel>Nome de usuário:</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Seu nome de usuário" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="baseSalary"
                                        render={({ field }) => (
                                            <FormItem className="mb-2">
                                                <FormLabel>Salário base mensal</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="R$ 0,00"
                                                        value={field.value ? formatToBRL(field.value / 100) : ''}
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value.replace(/\D/g, '');
                                                            const numberValue = rawValue ? Number(rawValue) : 0;
                                                            field.onChange(numberValue);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                !/[\d]/.test(e.key) &&
                                                                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(
                                                                    e.key
                                                                ) &&
                                                                !e.ctrlKey &&
                                                                !e.metaKey
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }}
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
