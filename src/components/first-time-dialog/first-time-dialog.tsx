import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from '@/components/ui/dialog';
import useFirstTimeCheck from '@/hooks/ useFirstTimeCheck';
import { useUID } from '@/hooks/useUID';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DialogFooter, DialogHeader } from '../ui/dialog';

export default function FirstTimeDialog() {
    const { isFirstTime, markAsViewed } = useFirstTimeCheck();
    const userUid = useUID();
    const [isDialogOpen, setIsDialogOpen] = useState(isFirstTime);

    useEffect(() => {
        setIsDialogOpen(isFirstTime);
    }, [isFirstTime]);

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            markAsViewed();
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>Bem vindo ao Cashly!</DialogTitle>
                    <div className="flex flex-col justify-between">
                        <DialogDescription className="mb-2">
                            Sua ferramente completa para gerenciar sua vida
                            financeira.
                        </DialogDescription>
                        <Separator />
                        <DialogDescription className="mt-2">
                            Sua "conta" é representada pelo seu UID:{' '}
                            {<strong>{userUid}</strong>}. Guarde-o em um local
                            securo pois ele é a sua chave para acessar suas
                            informações de qualquer dispositivo
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => markAsViewed()}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
