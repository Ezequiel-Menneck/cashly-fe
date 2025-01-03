import FirstTimeDialog from '@/components/first-time-dialog/first-time-dialog';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useEffect, useState } from 'react';

export default function Home() {
    const [showFirstTimeDialog, setShowFirstTimeDialog] = useState<boolean>(false);
    const userInfo = useUserInfo();

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
            <h1 className="mb-2 text-2xl">
                Bem vindo ao <strong>Cashly</strong> {userInfo.username != '' ? userInfo.username : ''}
            </h1>

            <FirstTimeDialog open={showFirstTimeDialog} onClose={handleCloseForm} />
        </>
    );
}
