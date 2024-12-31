import { useUserInfo } from '@/hooks/useUserInfo';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export default function UserIconMenu() {
    const UID = useUserInfo().uid || 'None';
    const [isDialogOpen, setIsDialogOpen] = useState<boolean | undefined>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(UID);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>Meu UID</DropdownMenuItem>
                    <DropdownMenuItem>Recuperar conta</DropdownMenuItem>
                    <DropdownMenuItem>Nova Conta</DropdownMenuItem>
                    <DropdownMenuItem>Apagar conta</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-64">
                    <DialogHeader>
                        <DialogTitle>UID</DialogTitle>
                        <div className="flex items-center justify-between">
                            <DialogDescription>UID: {UID}</DialogDescription>
                            <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                                <span className="sr-only">Copy</span>
                                <Copy />
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
