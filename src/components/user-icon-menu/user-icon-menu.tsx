import { formSchemaBaseSalary, formSchemaForRecoveryAccount } from '@/@types/form';
import { fetchDeleteUserAccount, fetchUpdateBaseSalary, fetchUserData } from '@/api/user';
import { generateUserUID, UserUid, useUser } from '@/context/user-context';
import { resetUserQueries } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FirstTimeDialog from '../first-time-dialog/first-time-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CurrencyInput } from '../ui/currency-input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

const recoveryAccountFormSchema = formSchemaForRecoveryAccount;
const updateBaseSalaryFormSchema = formSchemaBaseSalary;

export default function UserIconMenu() {
    const { userInfo, updateUser } = useUser();
    const queryClient = useQueryClient();
    const [userActionsDialogs, setUserActionsDialogs] = useState({
        uidDialog: false,
        changeBaseSalary: false,
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

    const formRecoveryAccount = useForm<z.infer<typeof recoveryAccountFormSchema>>({
        resolver: zodResolver(recoveryAccountFormSchema),
        defaultValues: {
            uid: ''
        }
    });

    const formUpdateBaseSalary = useForm<z.infer<typeof updateBaseSalaryFormSchema>>({
        resolver: zodResolver(updateBaseSalaryFormSchema),
        defaultValues: {
            baseSalary: undefined
        }
    });

    async function onSubmitRecoveryUserAccount(value: z.infer<typeof recoveryAccountFormSchema>) {
        const userData = await fetchUserData(value.uid);
        if (userData.errors) {
            setUserActionsDialogs({ ...userActionsDialogs, errorDialog: true });
            return;
        }

        updateUser({ uid: value.uid });
        setUserActionsDialogs({ ...userActionsDialogs, recoveryAccount: false });
        resetUserQueries(queryClient);
    }

    async function handleDeleteAccount(): Promise<void> {
        const deleted = await fetchDeleteUserAccount(userInfo.uid);
        if (deleted) {
            setUserActionsDialogs({ ...userActionsDialogs, closeAccount: false });
            setShowFirstTimeDialog(true);
        }
    }

    function handleCreateNewAccount(): void {
        const userInfo: UserUid = { uid: generateUserUID() };
        updateUser(userInfo);
        setUserActionsDialogs({ ...userActionsDialogs, newAccount: false });
        setShowFirstTimeDialog(true);
    }

    async function handleUpdateBaseSalary(value: z.infer<typeof updateBaseSalaryFormSchema>): Promise<void> {
        const result = await fetchUpdateBaseSalary({ identifier: userInfo.uid, baseSalary: value.baseSalary });
        console.log(result);
        if (!result.errors) {
            setUserActionsDialogs({ ...userActionsDialogs, changeBaseSalary: false });
            resetUserQueries(queryClient);
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
                    <DropdownMenuItem onSelect={() => setUserActionsDialogs({ ...userActionsDialogs, changeBaseSalary: true })}>
                        Alterar Salário Base
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

            {/* Show change base salary modal */}
            <Dialog
                open={userActionsDialogs.changeBaseSalary}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, changeBaseSalary: open })}
            >
                <DialogContent className="w-64">
                    <DialogHeader>
                        <DialogTitle>Altere seu Salário Base</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Form {...formUpdateBaseSalary}>
                        <form onSubmit={formUpdateBaseSalary.handleSubmit(handleUpdateBaseSalary)} className="space-y-8">
                            <FormField
                                control={formUpdateBaseSalary.control}
                                name="baseSalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qual seu novo Salário Base?</FormLabel>
                                        <FormControl>
                                            <CurrencyInput onChange={field.onChange} placeholder="R$ 0.00" value={field.value} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-end justify-end">
                                <Button type="submit">Confirmar</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Recovery Account Modal */}
            <Dialog
                open={userActionsDialogs.recoveryAccount}
                onOpenChange={(open) => setUserActionsDialogs({ ...userActionsDialogs, recoveryAccount: open })}
            >
                <DialogContent className="w-64">
                    <Form {...formRecoveryAccount}>
                        <form onSubmit={formRecoveryAccount.handleSubmit(onSubmitRecoveryUserAccount)} className="space-y-8">
                            <div>
                                <DialogHeader>
                                    <DialogTitle>UID</DialogTitle>
                                    <div className="flex flex-col">
                                        <DialogDescription className="mb-2">
                                            Insira ser <strong>UID</strong> para recuperar sua conta e poder utiliza-la nesse
                                            dispositivo
                                        </DialogDescription>
                                        <FormField
                                            control={formRecoveryAccount.control}
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
