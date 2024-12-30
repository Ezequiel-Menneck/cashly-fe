'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { fetchTransactionsCountByDate } from '@/api/user';
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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    DateOfTransactionsAndTransactionsCount,
    TransactionsCountByDate
} from '@/graphql/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import LoadingFetchData from '../loading-fetch-data/loading-fetch-data';

const chartConfig = {
    visitors: {
        label: 'Visitors'
    },
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))'
    }
} satisfies ChartConfig;

type ChartData = {
    date: string;
    desktop: number;
};

export function Component() {
    const currentMonth = (new Date().getMonth() + 1).toString(); // Get current month (1-12)
    const [timeRange, setTimeRange] = useState(currentMonth);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [mostRecentTransaction, setMostRecentTransaction] =
        useState<DateOfTransactionsAndTransactionsCount>();
    const { isPending, data } = useQuery<TransactionsCountByDate>({
        queryKey: ['getTransactionsCountByDate'],
        queryFn: fetchTransactionsCountByDate
    });

    useEffect(() => {
        if (data) {
            const dynamicChartData = data.getTransactionsCountByDate.map(
                (item) => ({
                    date: item.date,
                    desktop: item.transactionCount
                })
            );

            setChartData(dynamicChartData);

            const dynamicRecentTransaction =
                data.getTransactionsCountByDate.reduce(
                    (mostRecent, current) => {
                        return new Date(current.date) >
                            new Date(mostRecent.date)
                            ? current
                            : mostRecent;
                    }
                );
            setMostRecentTransaction(dynamicRecentTransaction);
        }
    }, [data]);

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        if (!mostRecentTransaction?.date) return false;

        const selectedMonth = parseInt(timeRange) - 1; // Convert to 0-11 for Date API

        return date.getMonth() === selectedMonth;
    });

    if (isPending) {
        return <LoadingFetchData />;
    }

    return (
        <Card className="w-3/5">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Quantidade de transações por mês</CardTitle>
                    <CardDescription>
                        Exibindo a quantidade de transações do ano!
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="1" className="rounded-lg">
                            January
                        </SelectItem>
                        <SelectItem value="2" className="rounded-lg">
                            February
                        </SelectItem>
                        <SelectItem value="3" className="rounded-lg">
                            March
                        </SelectItem>
                        <SelectItem value="4" className="rounded-lg">
                            April
                        </SelectItem>
                        <SelectItem value="5" className="rounded-lg">
                            May
                        </SelectItem>
                        <SelectItem value="6" className="rounded-lg">
                            June
                        </SelectItem>
                        <SelectItem value="7" className="rounded-lg">
                            July
                        </SelectItem>
                        <SelectItem value="8" className="rounded-lg">
                            August
                        </SelectItem>
                        <SelectItem value="9" className="rounded-lg">
                            September
                        </SelectItem>
                        <SelectItem value="10" className="rounded-lg">
                            October
                        </SelectItem>
                        <SelectItem value="11" className="rounded-lg">
                            November
                        </SelectItem>
                        <SelectItem value="12" className="rounded-lg">
                            December
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData} reverseStackOrder>
                        <defs>
                            <linearGradient
                                id="fillDesktop"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillMobile"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.1}
                                />
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
                                return date.toLocaleDateString('pt-BR', {
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
                                        return new Date(
                                            value
                                        ).toLocaleDateString('pt-BR', {
                                            month: 'short',
                                            day: 'numeric'
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
