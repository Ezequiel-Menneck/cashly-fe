import { Link, useLocation } from 'react-router';
import { buttonVariants } from '../ui/button';

export default function AppLink({ to, label }: { to: string; label: string }) {
    const location = useLocation();
    const isActive = to == location.pathname;

    return (
        <Link
            className={`${buttonVariants({ variant: 'ghost' })} ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
            to={to}
        >
            {label}
        </Link>
    );
}
