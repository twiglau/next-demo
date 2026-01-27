import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";


type UpgradeDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpgradeDialog({open, onOpenChange}: UpgradeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            
            <DialogContent>
                <DialogTitle>Upgrade Plan</DialogTitle>
                <DialogContent>
                </DialogContent>
            </DialogContent>
        </Dialog>
    )
}