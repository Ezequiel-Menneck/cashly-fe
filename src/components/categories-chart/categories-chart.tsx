import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import { fetchTransactionsCountByCategory } from '@/api/user';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';
import { TransactionsCountByCategory } from '@/graphql/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type ChartData = {
    category: string;
    transactionCount: number;
    fill: string;
};

type ChartConfigType = Record<string, { label: string; color?: string }>;

function getMonthName(): String {
    const date = new Date();
    const monthName = date.toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonthName =
        monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return capitalizedMonthName;
}

export default function CategoriesChart() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfigType>({});
    const { isPending, data } = useQuery<TransactionsCountByCategory>({
        queryKey: ['getTransactionsCountByCategory'],
        queryFn: fetchTransactionsCountByCategory
    });

    useEffect(() => {
        if (data) {
            const dynamicChartData = data.getTransactionsCountByCategory.map(
                (item, index) => ({
                    category: item.categoryName,
                    transactionCount: item.transactionCount,
                    fill: `hsl(var(--chart-${index + 1}))`
                })
            );

            const dynamicChartConfig =
                data.getTransactionsCountByCategory.reduce(
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
        }
    }, [data]);

    if (isPending)
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );

    return (
        <Card className="w-max h-max">
            <CardHeader>
                <CardTitle>Compras por categoria</CardTitle>
                <CardDescription>{getMonthName()}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0
                        }}
                    >
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const config =
                                    chartConfig[value as keyof ChartConfig];
                                return config ? config.label : value;
                            }}
                            width={80}
                            tick={{ textAnchor: 'start', dx: -50 }}
                        />
                        <XAxis dataKey="transactionCount" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="transactionCount"
                            layout="vertical"
                            radius={5}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
