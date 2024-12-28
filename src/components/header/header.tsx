import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router';
import AppLink from '../link/link';
import { ModeToggle } from '../theme-toggle/theme-toggle';
import { buttonVariants } from '../ui/button';
import UserIconMenu from '../user-icon-menu/user-icon-menu';

export default function Header() {
    return (
        <nav className="flex w-full min-h-16 border-2 bg-background mt-5 rounded-3xl items-center justify-between px-4 mb-5">
            <div className="flex gap-6">
                <Link to={'/'} className={buttonVariants({ variant: 'ghost' })}>
                    <HomeIcon />
                </Link>
                <AppLink to={'/financial'} label="Financeiro" />
                <AppLink to={'/crypto'} label="Crypto" />
            </div>
            <div className="flex gap-4 items-center">
                <ModeToggle />
                <UserIconMenu />
            </div>
        </nav>
    );
}
