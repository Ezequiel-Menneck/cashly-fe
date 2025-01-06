import { fetchUserData } from '@/api/user';
import { GraphQLResponse } from '@/graphql/dataWrapper';
import { FindUserByIdentifierResponse } from '@/graphql/types';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useQuery } from '@tanstack/react-query';
import { Edit2Icon, Trash2 } from 'lucide-react';
import LoadingFetchData from '../loading-fetch-data/loading-fetch-data';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function TransactionCard() {
    const userInfo = useUserInfo();

    const { isPending, data } = useQuery<GraphQLResponse<FindUserByIdentifierResponse>>({
        queryKey: ['getUserData'],
        queryFn: () => fetchUserData(userInfo.uid)
    });

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
                                <CardDescription>{t.transactionDate}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button className="bg-primary">
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
        </>
    );
}
