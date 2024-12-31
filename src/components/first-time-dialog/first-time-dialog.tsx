import { fetchCreateUser } from '@/api/user';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useFirstTimeCheck from '@/hooks/ useFirstTimeCheck';
import { useSaveUserInfo, useUserInfo } from '@/hooks/useUserInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
    username: z
        .string()
        .min(5, { message: 'O nome de usuário deve ter pelo menos 5 caracteres' })
        .max(30, { message: 'O nome de usuário deve ter no máximo 30 caracteres' }),
    baseSalary: z
        .number({
            required_error: 'O salário base é obrigatório',
            invalid_type_error: 'O salário base deve ser um número'
        })
        .positive({ message: 'O salário base deve ser maior que zero' })
});

export default function FirstTimeDialog() {
    const { isFirstTime, markAsViewed } = useFirstTimeCheck();
    const userINFO = useUserInfo();
    const [isDialogOpen, setIsDialogOpen] = useState(isFirstTime);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            baseSalary: undefined
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        markAsViewed();
        useSaveUserInfo({ uid: userINFO.uid, username: values.username });
        await fetchCreateUser({ username: values.username, identifier: userINFO.uid, baseSalary: values.baseSalary });
    }

    useEffect(() => {
        setIsDialogOpen(isFirstTime);
    }, [isFirstTime]);

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            markAsViewed();
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
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
                                                        type="number"
                                                        placeholder="0"
                                                        value={field.value ?? ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value ? Number(value) : undefined);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </DialogHeader>
                            <DialogFooter>
                                <Button type="submit">Ok!</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
