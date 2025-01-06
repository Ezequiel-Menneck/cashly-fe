import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import { fetchTransactionsCountByCategory } from '@/api/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GraphQLResponse } from '@/graphql/dataWrapper';
import { TransactionsCountByCategory } from '@/graphql/types';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import LoadingFetchData from '../../loading-fetch-data/loading-fetch-data';

type ChartData = {
    category: string;
    transactionCount: number;
    fill: string;
};

type ChartConfigType = Record<string, { label: string; color?: string }>;

function getMonthName(): String {
    const date = new Date();
    const monthName = date.toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return capitalizedMonthName;
}

export default function TransactionsByCategoryChart() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfigType>({});
    const { isPending, data } = useQuery<GraphQLResponse<TransactionsCountByCategory>>({
        queryKey: ['getTransactionsCountByCategory'],
        queryFn: () => fetchTransactionsCountByCategory(useUserInfo().uid)
    });

    useEffect(() => {
        if (data?.data?.getTransactionsCountByCategory && data.data.getTransactionsCountByCategory.length > 0) {
            const transactionCount = data.data.getTransactionsCountByCategory;
            const dynamicChartData = transactionCount.map((item, index) => ({
                category: item.categoryName,
                transactionCount: item.transactionCount,
                fill: `hsl(var(--chart-${index + 1}))`
            }));

            const dynamicChartConfig = transactionCount.reduce(
                (config, item, index) => {
                    return {
                        ...config,
                        [item.categoryName.toLocaleLowerCase()]: {
                            label: item.categoryName,
                            color: `hsl(var(--chart-${index + 1}))`
                        }
                    };
                },
                {} as Record<string, { label: string; color: string }>
            );

            setChartData(dynamicChartData);
            setChartConfig({
                transactionCount: {
                    label: 'Quantia'
                },
                ...dynamicChartConfig
            } satisfies ChartConfig);
        } else {
            setChartData([]);
            setChartConfig({});
        }
    }, [data]);

    if (isPending) {
        return <LoadingFetchData />;
    }

    return (
        <Card className="w-full sm:w-[30%]">
            <CardHeader className="pb-2">
                <CardTitle>Compras por categoria</CardTitle>
                <CardDescription>{getMonthName()}</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px]">
                <ChartContainer config={chartConfig} className="h-[200px]">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                            top: 0,
                            bottom: 0,
                            right: 0
                        }}
                    >
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const config = chartConfig[value as keyof ChartConfig];
                                return config ? config.label : value;
                            }}
                            width={80}
                            tick={{ textAnchor: 'start', dx: -50 }}
                            // height={}
                        />
                        <XAxis dataKey="transactionCount" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="transactionCount" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
