import { fetchDeleteUserTransaction, fetchUserData } from '@/api/user';
import { GraphQLResponse } from '@/graphql/dataWrapper';
import { FindUserByIdentifierResponse } from '@/graphql/types';
import { useUserInfo } from '@/hooks/useUserInfo';
import { formatDate } from '@/utils/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2Icon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import LoadingFetchData from '../loading-fetch-data/loading-fetch-data';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

export default function TransactionCard() {
    const [excludeTransactionModal, setExcludeTransactionModal] = useState<boolean>(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string>('');
    const queryClient = useQueryClient();
    const userInfo = useUserInfo();

    const { isPending, data } = useQuery<GraphQLResponse<FindUserByIdentifierResponse>>({
        queryKey: ['getUserData'],
        queryFn: () => fetchUserData(userInfo.uid)
    });

    function handleExcludeTransactionModal() {
        setExcludeTransactionModal(false);
    }

    function handleOpenExcludeModal(transactionId: string) {
        setSelectedTransactionId(transactionId);
        setExcludeTransactionModal(true);
    }

    async function handleExcludeTransaction() {
        await fetchDeleteUserTransaction(userInfo.uid, selectedTransactionId);
        setExcludeTransactionModal(false);
        queryClient.invalidateQueries({ queryKey: ['getUserData'] });
        queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByDate'] });
        queryClient.invalidateQueries({ queryKey: ['getTransactionsCountByCategory'] });
        queryClient.invalidateQueries({ queryKey: ['getUserBaseSalaryAndSumTransactionsAmount'] });
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
                                <Button className="bg-primary" onClick={() => handleOpenExcludeModal(t.id)}>
                                    <Trash2 />
                                </Button>
                                <Button className="bg-edit hover:bg-edit-hover">
                                    <Edit2Icon />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span>Valor da transação: {t.amount}</span>
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

            <Dialog open={excludeTransactionModal} onOpenChange={handleExcludeTransactionModal}>
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
        </>
    );
}
