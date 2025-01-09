import { fetchDeleteUserAccount, fetchUserData } from '@/api/user';
import { generateUserUID, UserUidAndUsername, useUser } from '@/context/user-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FirstTimeDialog from '../first-time-dialog/first-time-dialog';
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
    const { userInfo, updateUser } = useUser();
    const queryClient = useQueryClient();
    const [userActionsDialogs, setUserActionsDialogs] = useState({
        uidDialog: false,
        recoveryAccount: false,
        newAccount: false,
        closeAccount: false,
        errorDialog: false
    });
    const [showFirstTimeDialog, setShowFirstTimeDialog] = useState<boolean>(false);

    const handleCloseFirstTimeDialog = () => {
        setShowFirstTimeDialog(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(userInfo.uid);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            uid: ''
        }
    });

    async function onSubmitRecoveryUserAccount(value: z.infer<typeof formSchema>) {
        const userData = await fetchUserData(value.uid);
        if (userData.errors) {
            setUserActionsDialogs({ ...userActionsDialogs, errorDialog: true });
            return;
        }

        updateUser({
            uid: value.uid,
            username: userData.data?.findUserByIdentifier.username ? userData.data.findUserByIdentifier.username : ''
        });
        setUserActionsDialogs({ ...userActionsDialogs, recoveryAccount: false });
        resetUserQueries();
    }

    function resetUserQueries() {
        console.log('reseterr');
        queryClient.invalidateQueries({ queryKey: ['getUserData'] });
        queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByDate'] });
        queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByCategory'] });
        queryClient.invalidateQueries({ queryKey: ['getUserBaseSalaryAndSumTransactionsAmount'] });
    }

    async function handleDeleteAccount(): Promise<void> {
        const deleted = await fetchDeleteUserAccount(userInfo.uid);
        if (deleted) {
            setUserActionsDialogs({ ...userActionsDialogs, closeAccount: false });
            setShowFirstTimeDialog(true);
        }
    }

    function handleCreateNewAccount(): void {
        const userInfo: UserUidAndUsername = { uid: generateUserUID(), username: '' };
        updateUser(userInfo);
        setUserActionsDialogs({ ...userActionsDialogs, newAccount: false });
        setShowFirstTimeDialog(true);
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
                    <DropdownMenuItem onSelect={() => setUserActionsDialogs({ ...userActionsDialogs, newAccount: true })}>
                        Nova Conta
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setUserActionsDialogs({ ...userActionsDialogs, closeAccount: true })}>
                        Apagar conta
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Show UID Modal */}
            <Dialog
                open={userActionsDialogs.uidDialog}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, uidDialog: open })}
            >
                <DialogContent className="w-64">
                    <DialogHeader>
                        <DialogTitle>UID</DialogTitle>
                        <div className="flex items-center justify-between">
                            <DialogDescription>UID: {userInfo.uid}</DialogDescription>
                            <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                                <span className="sr-only">Copy</span>
                                <Copy />
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Recovery Account Modal */}
            <Dialog
                open={userActionsDialogs.recoveryAccount}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, recoveryAccount: open })}
            >
                <DialogContent className="w-64">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitRecoveryUserAccount)} className="space-y-8">
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

            {/* New Account Modal */}
            <Dialog
                open={userActionsDialogs.newAccount}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, newAccount: open })}
            >
                <DialogContent className="w-96">
                    <DialogHeader>
                        <DialogTitle>Você tem certeza que deseja criar uma nova conta?</DialogTitle>
                        <div className="flex flex-col">
                            <DialogDescription className="mb-3">
                                Você podera continuar acessando sua conta antiga, para isso tenha certeza de guardar seu UID em um
                                local seguro.
                            </DialogDescription>
                            <DialogDescription className="mb-3">
                                Para isso, clique no seu ícone de usuário e selecione a opção 'Recuperar conta'. Insira seu UID e
                                confirme que já estará utilizando a conta desejada.
                            </DialogDescription>
                            <Button type="submit" size="sm" className="px-3" onClick={handleCreateNewAccount}>
                                Confirmar
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Delete Account Modal */}
            <Dialog
                open={userActionsDialogs.closeAccount}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, closeAccount: open })}
            >
                <DialogContent className="w-96">
                    <DialogHeader>
                        <DialogTitle>Você tem certeza que deseja deletar sua conta?</DialogTitle>
                        <div className="flex flex-col">
                            <DialogDescription className="mb-3">
                                Essa é uma ação irrevestivel, caso você prosiga seus dados não poderão ser recuperados
                            </DialogDescription>
                            <Button type="submit" size="sm" className="px-3" onClick={handleDeleteAccount}>
                                Confirmar
                            </Button>
                        </div>
                    </DialogHeader>
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

            <FirstTimeDialog open={showFirstTimeDialog} onClose={handleCloseFirstTimeDialog} />
        </>
    );
}
