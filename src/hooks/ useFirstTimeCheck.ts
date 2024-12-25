import { useEffect, useState } from 'react';

function generateUserUID() {
    return Number(
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    ).toString();
}

export default function useFirstTimeCheck() {
    const [isFirstTime, setIsFirstTime] = useState<boolean>(() => {
        return localStorage.getItem('isFirstTime') !== 'false';
    });

    useEffect(() => {
        if (isFirstTime) {
            if (!localStorage.getItem('userUID')) {
                localStorage.setItem('userUID', generateUserUID());
            }
        }
    }, []);

    const markAsViewed = () => {
        localStorage.setItem('isFirstTime', 'false');
        setIsFirstTime(false);
    };

    return { isFirstTime, markAsViewed };
}
