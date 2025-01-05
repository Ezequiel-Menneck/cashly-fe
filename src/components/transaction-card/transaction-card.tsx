import { Edit2Icon, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const transactions = [
    {
        id: '1',
        amount: 1757.95,
        transactionDate: '2024-12-05T08:08:05',
        description: 'Transaction 1',
        type: 'EXPENSE',
        categoryId: 'salary'
    },
    {
        id: '2',
        amount: 3037.4,
        transactionDate: '2024-02-22T03:13:15',
        description: 'Transaction 2',
        type: 'EXPENSE',
        categoryId: 'transport'
    },
    {
        id: '3',
        amount: 2947.6,
        transactionDate: '2024-10-06T14:12:22',
        description: 'Transaction 3',
        type: 'INCOME',
        categoryId: 'salary'
    },
    {
        id: '4',
        amount: 3228.53,
        transactionDate: '2024-07-16T23:48:18',
        description: 'Transaction 4',
        type: 'EXPENSE',
        categoryId: 'salary'
    },
    {
        id: '5',
        amount: 4057.73,
        transactionDate: '2024-05-09T16:42:23',
        description: 'Transaction 5',
        type: 'INCOME',
        categoryId: 'health'
    },
    {
        id: '6',
        amount: 2600.17,
        transactionDate: '2024-09-29T21:55:12',
        description: 'Transaction 6',
        type: 'INCOME',
        categoryId: 'salary'
    },
    {
        id: '7',
        amount: 1468.38,
        transactionDate: '2024-08-25T00:04:38',
        description: 'Transaction 7',
        type: 'EXPENSE',
        categoryId: 'entertainment'
    },
    {
        id: '8',
        amount: 461.5,
        transactionDate: '2024-11-08T21:11:16',
        description: 'Transaction 8',
        type: 'INCOME',
        categoryId: 'health'
    },
    {
        id: '9',
        amount: 2246.36,
        transactionDate: '2024-12-16T14:25:44',
        description: 'Transaction 9',
        type: 'INCOME',
        categoryId: 'entertainment'
    },
    {
        id: '10',
        amount: 3623.51,
        transactionDate: '2024-12-24T08:50:23',
        description: 'Transaction 10',
        type: 'INCOME',
        categoryId: 'entertainment'
    },
    {
        id: '11',
        amount: 816.65,
        transactionDate: '2024-11-03T10:18:42',
        description: 'Transaction 11',
        type: 'EXPENSE',
        categoryId: 'health'
    },
    {
        id: '12',
        amount: 1021.96,
        transactionDate: '2024-07-15T02:36:43',
        description: 'Transaction 12',
        type: 'INCOME',
        categoryId: 'entertainment'
    },
    {
        id: '13',
        amount: 1471.53,
        transactionDate: '2024-09-26T00:31:26',
        description: 'Transaction 13',
        type: 'EXPENSE',
        categoryId: 'transport'
    },
    {
        id: '14',
        amount: 4472.07,
        transactionDate: '2024-03-10T03:07:25',
        description: 'Transaction 14',
        type: 'INCOME',
        categoryId: 'food'
    },
    {
        id: '15',
        amount: 3140.96,
        transactionDate: '2024-10-25T12:30:23',
        description: 'Transaction 15',
        type: 'INCOME',
        categoryId: 'entertainment'
    },
    {
        id: '16',
        amount: 1536.04,
        transactionDate: '2024-06-15T11:21:25',
        description: 'Transaction 16',
        type: 'EXPENSE',
        categoryId: 'health'
    },
    {
        id: '17',
        amount: 2027.82,
        transactionDate: '2024-02-08T05:10:17',
        description: 'Transaction 17',
        type: 'INCOME',
        categoryId: 'transport'
    },
    {
        id: '18',
        amount: 3242.49,
        transactionDate: '2024-09-15T10:01:45',
        description: 'Transaction 18',
        type: 'INCOME',
        categoryId: 'transport'
    },
    {
        id: '19',
        amount: 2230.3,
        transactionDate: '2024-07-22T21:52:40',
        description: 'Transaction 19',
        type: 'EXPENSE',
        categoryId: 'salary'
    },
    {
        id: '20',
        amount: 1273.19,
        transactionDate: '2024-05-04T00:29:39',
        description: 'Transaction 20',
        type: 'INCOME',
        categoryId: 'utilities'
    },
    {
        id: '21',
        amount: 1055.38,
        transactionDate: '2024-05-10T10:48:17',
        description: 'Transaction 21',
        type: 'INCOME',
        categoryId: 'utilities'
    },
    {
        id: '22',
        amount: 2843.57,
        transactionDate: '2024-03-25T06:54:19',
        description: 'Transaction 22',
        type: 'EXPENSE',
        categoryId: 'utilities'
    },
    {
        id: '23',
        amount: 1470.2,
        transactionDate: '2024-10-02T01:00:34',
        description: 'Transaction 23',
        type: 'INCOME',
        categoryId: 'utilities'
    },
    {
        id: '24',
        amount: 1717.12,
        transactionDate: '2024-08-13T06:30:24',
        description: 'Transaction 24',
        type: 'INCOME',
        categoryId: 'entertainment'
    },
    {
        id: '25',
        amount: 1778.85,
        transactionDate: '2024-07-08T16:31:45',
        description: 'Transaction 25',
        type: 'EXPENSE',
        categoryId: 'utilities'
    },
    {
        id: '26',
        amount: 3975.6,
        transactionDate: '2024-04-06T23:45:42',
        description: 'Transaction 26',
        type: 'EXPENSE',
        categoryId: 'salary'
    },
    {
        id: '27',
        amount: 4708.75,
        transactionDate: '2024-05-21T12:16:35',
        description: 'Transaction 27',
        type: 'EXPENSE',
        categoryId: 'utilities'
    },
    {
        id: '28',
        amount: 4906.03,
        transactionDate: '2024-12-18T11:06:15',
        description: 'Transaction 28',
        type: 'INCOME',
        categoryId: 'dining'
    },
    {
        id: '29',
        amount: 2036.35,
        transactionDate: '2024-05-09T15:10:17',
        description: 'Transaction 29',
        type: 'EXPENSE',
        categoryId: 'transport'
    },
    {
        id: '30',
        amount: 1046.26,
        transactionDate: '2024-01-10T13:05:36',
        description: 'Transaction 30',
        type: 'INCOME',
        categoryId: 'health'
    },
    {
        id: '31',
        amount: 4240.9,
        transactionDate: '2024-04-19T01:38:27',
        description: 'Transaction 31',
        type: 'EXPENSE',
        categoryId: 'dining'
    },
    {
        id: '32',
        amount: 3831.45,
        transactionDate: '2024-07-20T19:25:53',
        description: 'Transaction 32',
        type: 'INCOME',
        categoryId: 'salary'
    },
    {
        id: '33',
        amount: 1641.95,
        transactionDate: '2024-06-07T11:22:43',
        description: 'Transaction 33',
        type: 'INCOME',
        categoryId: 'dining'
    },
    {
        id: '34',
        amount: 425.02,
        transactionDate: '2024-11-17T17:43:41',
        description: 'Transaction 34',
        type: 'EXPENSE',
        categoryId: 'food'
    },
    {
        id: '35',
        amount: 4680.27,
        transactionDate: '2024-01-21T14:08:32',
        description: 'Transaction 35',
        type: 'INCOME',
        categoryId: 'salary'
    },
    {
        id: '36',
        amount: 1426.18,
        transactionDate: '2024-01-03T12:48:01',
        description: 'Transaction 36',
        type: 'INCOME',
        categoryId: 'dining'
    },
    {
        id: '37',
        amount: 3883.95,
        transactionDate: '2024-08-07T05:21:04',
        description: 'Transaction 37',
        type: 'INCOME',
        categoryId: 'dining'
    },
    {
        id: '38',
        amount: 1539.26,
        transactionDate: '2024-12-11T19:26:51',
        description: 'Transaction 38',
        type: 'EXPENSE',
        categoryId: 'dining'
    },
    {
        id: '39',
        amount: 840.37,
        transactionDate: '2024-04-22T00:32:01',
        description: 'Transaction 39',
        type: 'EXPENSE',
        categoryId: 'dining'
    },
    {
        id: '40',
        amount: 1380.41,
        transactionDate: '2024-11-09T07:53:32',
        description: 'Transaction 40',
        type: 'INCOME',
        categoryId: 'utilities'
    },
    {
        id: '41',
        amount: 860.21,
        transactionDate: '2024-03-29T07:52:14',
        description: 'Transaction 41',
        type: 'EXPENSE',
        categoryId: 'health'
    },
    {
        id: '42',
        amount: 4699.24,
        transactionDate: '2024-02-13T17:37:29',
        description: 'Transaction 42',
        type: 'EXPENSE',
        categoryId: 'food'
    },
    {
        id: '43',
        amount: 974.67,
        transactionDate: '2024-05-11T07:52:41',
        description: 'Transaction 43',
        type: 'INCOME',
        categoryId: 'entertainment'
    },
    {
        id: '44',
        amount: 297.97,
        transactionDate: '2024-07-14T01:49:08',
        description: 'Transaction 44',
        type: 'EXPENSE',
        categoryId: 'transport'
    },
    {
        id: '45',
        amount: 2118.17,
        transactionDate: '2024-06-20T08:24:56',
        description: 'Transaction 45',
        type: 'INCOME',
        categoryId: 'food'
    },
    {
        id: '46',
        amount: 1013.07,
        transactionDate: '2024-08-08T18:31:22',
        description: 'Transaction 46',
        type: 'INCOME',
        categoryId: 'salary'
    },
    {
        id: '47',
        amount: 276.6,
        transactionDate: '2024-07-13T15:35:06',
        description: 'Transaction 47',
        type: 'EXPENSE',
        categoryId: 'food'
    },
    {
        id: '48',
        amount: 4140.71,
        transactionDate: '2024-09-07T23:30:46',
        description: 'Transaction 48',
        type: 'INCOME',
        categoryId: 'utilities'
    },
    {
        id: '49',
        amount: 3956.46,
        transactionDate: '2024-10-01T02:25:34',
        description: 'Transaction 49',
        type: 'EXPENSE',
        categoryId: 'food'
    },
    {
        id: '50',
        amount: 4778.9,
        transactionDate: '2024-04-23T09:03:16',
        description: 'Transaction 50',
        type: 'EXPENSE',
        categoryId: 'health'
    }
];

export default function TransactionCard() {
    return (
        <>
            <div>Filtros</div>
            {transactions &&
                transactions.map((t) => (
                    <Card className="mb-4">
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
                                    <span>Categoria da transação: {t.categoryId}</span>
                                </div>
                                <Badge
                                    className={`${t.type == 'INCOME' ? 'bg-green-500' : 'bg-red-500'} text-black hover:bg-slate-900 w-fit`}
                                >
                                    {t.type.toUpperCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </>
    );
}
