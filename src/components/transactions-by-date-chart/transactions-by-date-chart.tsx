'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { fetchTransactionsCountByDate } from '@/api/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraphQLResponse } from '@/graphql/dataWrapper';
import { DateOfTransactionsAndTransactionsCount, TransactionsCountByDate } from '@/graphql/types';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import LoadingFetchData from '../loading-fetch-data/loading-fetch-data';

const chartConfig = {
    visitors: {
        label: 'Visitors'
    },
    count: {
        label: 'Quantidade',
        color: 'hsl(var(--chart-1))'
    }
} satisfies ChartConfig;

type ChartData = {
    date: string;
    count: number;
};

export function TransactionsByDateChart() {
    const currentMonth = (new Date().getMonth() + 1).toString();
    const [timeRange, setTimeRange] = useState(currentMonth);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [mostRecentTransaction, setMostRecentTransaction] = useState<DateOfTransactionsAndTransactionsCount>();
    const { isPending, data } = useQuery<GraphQLResponse<TransactionsCountByDate>>({
        queryKey: ['getTransactionsCountByDate'],
        queryFn: () => fetchTransactionsCountByDate(useUserInfo().uid)
    });

    useEffect(() => {
        if (data?.data?.getTransactionsCountByDate && data.data.getTransactionsCountByDate.length > 0) {
            const transactionCount = data.data.getTransactionsCountByDate;
            const dynamicChartData = transactionCount.map((item) => ({
                date: `${item.date}T00:00:00.000Z`,
                count: item.transactionCount
            }));

            setChartData(dynamicChartData);

            const dynamicRecentTransaction = transactionCount.reduce((mostRecent, current) => {
                return new Date(`${current.date}T00:00:00.000Z`) > new Date(`${mostRecent.date}T00:00:00.000Z`)
                    ? current
                    : mostRecent;
            });
            setMostRecentTransaction(dynamicRecentTransaction);
        } else {
            setChartData([]);
            setMostRecentTransaction(undefined);
        }
    }, [data]);

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        if (!mostRecentTransaction?.date) return false;

        const selectedMonth = parseInt(timeRange);

        return date.getUTCMonth() + 1 === selectedMonth;
    });

    if (isPending) {
        return <LoadingFetchData />;
    }

    return (
        <Card className="w-[40%] h-full">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Quantidade de transações por mês</CardTitle>
                    <CardDescription>Exibindo a quantidade de transações do ano!</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="1" className="rounded-lg">
                            Janeiro
                        </SelectItem>
                        <SelectItem value="2" className="rounded-lg">
                            Fevereiro
                        </SelectItem>
                        <SelectItem value="3" className="rounded-lg">
                            Março
                        </SelectItem>
                        <SelectItem value="4" className="rounded-lg">
                            Abril
                        </SelectItem>
                        <SelectItem value="5" className="rounded-lg">
                            Maio
                        </SelectItem>
                        <SelectItem value="6" className="rounded-lg">
                            Junho
                        </SelectItem>
                        <SelectItem value="7" className="rounded-lg">
                            Julho
                        </SelectItem>
                        <SelectItem value="8" className="rounded-lg">
                            Agosto
                        </SelectItem>
                        <SelectItem value="9" className="rounded-lg">
                            Setembro
                        </SelectItem>
                        <SelectItem value="10" className="rounded-lg">
                            Outubro
                        </SelectItem>
                        <SelectItem value="11" className="rounded-lg">
                            Novembro
                        </SelectItem>
                        <SelectItem value="12" className="rounded-lg">
                            Dezembro
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[150px] w-full">
                    <AreaChart data={filteredData} reverseStackOrder>
                        <defs>
                            <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR', {
                                    month: 'short',
                                    day: 'numeric'
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString(
                                            'pt-BR',
                                            {
                                                month: 'short',
                                                day: 'numeric'
                                            }
                                        );
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area dataKey="count" type="natural" fill="url(#fillCount)" stroke="var(--color-count)" stackId="a" />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
