import { useEffect, useState } from 'react';
import { useSaveUserInfo } from './useUserInfo';

export function generateUserUID() {
    return Number(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
}

export default function useFirstTimeCheck() {
    const [isFirstTime, setIsFirstTime] = useState<boolean>(() => {
        return localStorage.getItem('isFirstTime') !== 'false';
    });

    useEffect(() => {
        if (isFirstTime) {
            if (!localStorage.getItem('userINFO')) {
                const userInfo = { uid: generateUserUID(), username: '' };
                useSaveUserInfo(userInfo);
            }
        }
    }, []);

    const markAsViewed = () => {
        localStorage.setItem('isFirstTime', 'false');
        setIsFirstTime(false);
    };

    return { isFirstTime, markAsViewed };
}
