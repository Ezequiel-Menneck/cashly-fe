import { BaseSalaryChart } from '@/components/base-salary-chart/base-salary-chart';
import FirstTimeDialog from '@/components/first-time-dialog/first-time-dialog';
import TransactionCard from '@/components/transaction-card/transaction-card';
import TransactionsByCategoryChart from '@/components/transactions-by-category-chart/transactions-by-category-chart';
import { TransactionsByDateChart } from '@/components/transactions-by-date-chart/transactions-by-date-chart';
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
            <div className="flex gap-4 h-[300px]">
                <BaseSalaryChart />
                <TransactionsByCategoryChart />
                <TransactionsByDateChart />
            </div>

            <TransactionCard />

            <FirstTimeDialog open={showFirstTimeDialog} onClose={handleCloseForm} />
        </>
    );
}
