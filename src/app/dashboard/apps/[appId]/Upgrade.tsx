import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";


type UpgradeDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appId: string;
}

export function UpgradeDialog({open, onOpenChange, appId}: UpgradeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upgrade Plan</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Your current plan is free plan, you can upgrade to pro plan to get more features.
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button asChild>
                            <Link href={`/dashboard/apps/${appId}/plan`}>Upgrade</Link>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}