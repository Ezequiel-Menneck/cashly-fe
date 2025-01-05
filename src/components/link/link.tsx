import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { buttonVariants } from '../ui/button';

export default function AppLink({ to, label, icon }: { to: string; label: string; icon?: ReactNode }) {
    const location = useLocation();
    const isActive = to == location.pathname;

    return (
        <Link className={`${buttonVariants({ variant: 'ghost' })} ${isActive ? 'bg-accent text-accent-foreground' : ''}`} to={to}>
            {icon && icon}
            {label}
        </Link>
    );
}
