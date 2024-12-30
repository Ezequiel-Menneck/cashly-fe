import FirstTimeDialog from '@/components/first-time-dialog/first-time-dialog';
import TransactionsByCategoryChart from '@/components/transactions-by-category-chart/transactions-by-category-chart';
import { TransactionsByDateChart } from '@/components/transactions-by-date-chart/transactions-by-date-chart';

export default function Home() {
    return (
        <>
            <div className="flex gap-2">
                <TransactionsByCategoryChart />
                <TransactionsByDateChart />
            </div>
            <FirstTimeDialog />
        </>
    );
}
