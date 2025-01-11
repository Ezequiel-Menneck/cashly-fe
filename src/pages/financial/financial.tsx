import { BaseSalaryChart } from '@/components/charts/base-salary-chart/base-salary-chart';
import TransactionsByCategoryChart from '@/components/charts/transactions-by-category-chart/transactions-by-category-chart';
import { TransactionsByDateChart } from '@/components/charts/transactions-by-date-chart/transactions-by-date-chart';
import FirstTimeDialog from '@/components/first-time-dialog/first-time-dialog';
import TransactionCard from '@/components/transaction-card/transaction-card';
import { useEffect, useState } from 'react';

export default function Financial() {
    const [showFirstTimeDialog, setShowFirstTimeDialog] = useState<boolean>(false);

    useEffect(() => {
        const isFirstTime = !localStorage.getItem('isFirstTime');
        if (isFirstTime) {
            setShowFirstTimeDialog(true);
            localStorage.setItem('isFirstTime', 'false');
        }
    }, []);

    const handleCloseForm = () => {
        setShowFirstTimeDialog(false);
    };

    return (
        <>
            <div className="flex flex-col mb-2 sm:flex-col md:flex-col lg:flex-row gap-4">
                <BaseSalaryChart />
                <TransactionsByCategoryChart />
                <TransactionsByDateChart />
            </div>
            <div>
                <TransactionCard />
            </div>

            <FirstTimeDialog open={showFirstTimeDialog} onClose={handleCloseForm} />
        </>
    );
}
