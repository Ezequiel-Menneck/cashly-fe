import { Bitcoin, CircleDollarSign } from 'lucide-react';
import AppLink from '../link/link';
import { ModeToggle } from '../theme-toggle/theme-toggle';
import UserIconMenu from '../user-icon-menu/user-icon-menu';

export default function Header() {
    return (
        <nav className="flex w-full min-h-16 border-2 bg-background mt-5 rounded-3xl items-center justify-between px-4 mb-5">
            <div className="flex gap-6">
                <AppLink to={'/'} label="Financeiro" icon={<CircleDollarSign />} />
                <AppLink to={'/crypto'} label="Crypto" icon={<Bitcoin />} />
            </div>
            <div className="flex gap-4 items-center">
                <ModeToggle />
                <UserIconMenu />
            </div>
        </nav>
    );
}
