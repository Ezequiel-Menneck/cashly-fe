import CategoriesChart from '@/components/categories-chart/categories-chart';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import useFirstTimeCheck from '@/hooks/ useFirstTimeCheck';
import { useUID } from '@/hooks/useUID';
import { useEffect, useState } from 'react';

export default function Home() {
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
        <>
            <CategoriesChart />
            <Dialog
                open={isDialogOpen}
                onOpenChange={handleOpenChange}
                modal={true}
            >
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
                                {<strong>{userUid}</strong>}. Guarde-o em um
                                local securo pois ele é a sua chave para acessar
                                suas informações de qualquer dispositivo
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => markAsViewed()}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
