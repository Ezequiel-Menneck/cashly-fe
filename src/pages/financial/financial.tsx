import TransactionsByCategoryChart from '@/components/transactions-by-category-chart/transactions-by-category-chart';
import { TransactionsByDateChart } from '@/components/transactions-by-date-chart/transactions-by-date-chart';

export default function Financial() {
    return (
        <>
            <div className="flex gap-4 h-[300px]">
                <TransactionsByCategoryChart />
                <TransactionsByDateChart />
            </div>
        </>
    );
}
