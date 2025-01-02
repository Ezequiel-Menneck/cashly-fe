import { fetchUserData } from '@/api/user';
import { useSaveUserInfo, useUserInfo } from '@/hooks/useUserInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
    uid: z
        .string()
        .min(6, { message: 'O UID de usuário deve ter no mínimo 6 caracteres' })
        .max(6, { message: 'O UID de usuário deve ter no maximo 6 caracteres' })
});

export default function UserIconMenu() {
    const UID = useUserInfo().uid || 'None';
    const queryClient = useQueryClient();

    const [userActionsDialogs, setUserActionsDialogs] = useState({
        uidDialog: false,
        recoveryAccount: false,
        closeAccount: false,
        errorDialog: false
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(UID);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            uid: ''
        }
    });

    async function onSubmit(value: z.infer<typeof formSchema>) {
        try {
            const userData = await fetchUserData(value.uid);
            if (userData.errors) {
                setUserActionsDialogs({ ...userActionsDialogs, errorDialog: true });
            }

            useSaveUserInfo({ uid: value.uid, username: userData.data?.findUserByIdentifier.username });
            queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByDate'] });
            queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByCategory'] });

            setUserActionsDialogs({ ...userActionsDialogs, recoveryAccount: false });
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setUserActionsDialogs({ ...userActionsDialogs, uidDialog: true })}>
                        Meu UID
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setUserActionsDialogs({ ...userActionsDialogs, recoveryAccount: true })}>
                        Recuperar conta
                    </DropdownMenuItem>
                    <DropdownMenuItem>Nova Conta</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setUserActionsDialogs({ ...userActionsDialogs, closeAccount: true })}>
                        Apagar conta
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={userActionsDialogs.uidDialog}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, uidDialog: open })}
            >
                <DialogContent className="w-64">
                    <DialogHeader>
                        <DialogTitle>UID</DialogTitle>
                        <div className="flex items-center justify-between">
                            <DialogDescription>UID: {UID}</DialogDescription>
                            <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                                <span className="sr-only">Copy</span>
                                <Copy />
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog
                open={userActionsDialogs.recoveryAccount}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, recoveryAccount: open })}
            >
                <DialogContent className="w-64">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div>
                                <DialogHeader>
                                    <DialogTitle>UID</DialogTitle>
                                    <div className="flex flex-col">
                                        <DialogDescription className="mb-2">
                                            Insira ser <strong>UID</strong> para recuperar sua conta e poder utiliza-la nesse
                                            dispositivo
                                        </DialogDescription>
                                        <FormField
                                            control={form.control}
                                            name="uid"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Seu UID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Seu UID" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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

            {/* Error Dialog for Recovery Account */}
            <Dialog
                open={userActionsDialogs.errorDialog}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, errorDialog: open })}
            >
                <DialogContent className="w-64">
                    <DialogHeader>
                        <DialogTitle>Erro ao recuperar conta</DialogTitle>
                        <div className="flex items-center justify-between">
                            <DialogDescription>
                                Por favor, verifique se esse UID está correto, não encontramos nenhuma conta ligada a ele
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
