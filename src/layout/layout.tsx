import Header from '@/components/header/header';
import { UserProvider } from '@/context/UserContext';
import { Outlet } from 'react-router';

export default function Layout() {
    return (
        <UserProvider>
            <div className="w-screen h-screen overflow-x-hidden flex justify-center items-center">
                <div className="w-4/5 max-w-screen-xl h-full flex flex-col">
                    <Header />
                    <main className="flex-grow w-full">
                        <Outlet />
                    </main>
                </div>
            </div>
        </UserProvider>
    );
}
