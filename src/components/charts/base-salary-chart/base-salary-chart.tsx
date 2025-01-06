'use client';

import { ArrowUpIcon } from 'lucide-react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

import { fetchUserBaseSalaryAndSumOfTransactionsAmount } from '@/api/user';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GraphQLResponse } from '@/graphql/dataWrapper';
import { UserBaseSalaryAndTransactionsSum } from '@/graphql/types';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useQuery } from '@tanstack/react-query';
import LoadingFetchData from '../../loading-fetch-data/loading-fetch-data';

const chartConfig = {
    amount: {
        label: 'Saldo Atual',
        color: 'hsl(var(--chart-1))'
    }
} satisfies ChartConfig;

export function BaseSalaryChart() {
    const { isPending, data } = useQuery<GraphQLResponse<UserBaseSalaryAndTransactionsSum>>({
        queryKey: ['getUserBaseSalaryAndSumTransactionsAmount'],
        queryFn: () => fetchUserBaseSalaryAndSumOfTransactionsAmount(useUserInfo().uid, new Date().getMonth() + 1)
    });

    if (isPending) {
        return <LoadingFetchData />;
    }

    const chartData = [
        {
            name: 'Current Balance',
            amount:
                data?.data?.getUserBaseSalaryAndSumTransactionsAmount != undefined
                    ? data.data.getUserBaseSalaryAndSumTransactionsAmount.transactionsAmountSum / 100
                    : 0,
            baseSalary:
                data?.data?.getUserBaseSalaryAndSumTransactionsAmount != undefined
                    ? data.data.getUserBaseSalaryAndSumTransactionsAmount.baseSalary / 100
                    : 0,
            fill: 'url(#colorGradient)'
        }
    ];
    const { amount, baseSalary } = chartData[0];
    const percentageLeft = baseSalary != 0 ? 100 - (amount / baseSalary) * 100 : 0;
    const daysLeft = 30 - new Date().getDate();

    return (
        <Card className="w-[30%] max-w-2xl">
            <CardHeader>
                <CardTitle>Visão geral das finanças mensais</CardTitle>
                <CardDescription>Acompanhando seus gastos até o final do mês</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <div className="space-y-2">
                    <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Saldo Atual </p>
                    <p className="text-sm text-muted-foreground">${baseSalary.toLocaleString()} Salário Mensal</p>
                </div>
                <ChartContainer config={chartConfig} className="w-[200px] h-[100px] flex items-center justify-center">
                    <RadialBarChart
                        width={200}
                        height={100}
                        cx={100}
                        cy={80}
                        innerRadius={60}
                        outerRadius={80}
                        barSize={10}
                        data={chartData}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis type="number" domain={[0, baseSalary]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="amount" cornerRadius={30} fill="url(#colorGradient)" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <defs>
                            <linearGradient id="colorGradient" x1="1" y1="0" x2="0" y2="0">
                                <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                            </linearGradient>
                        </defs>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-1">
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">{percentageLeft.toFixed(1)}% restante</span>
                </div>
                <div className="text-sm text-muted-foreground">{daysLeft} Dias até o fim do mês</div>
            </CardFooter>
        </Card>
    );
}
