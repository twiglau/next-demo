import { DialogContent, DialogTitle } from "@/components/ui/Dialog";
import BackableDialog from "./backable-dialog";
import CreateApp from "@/app/dashboard/apps/new/page";


export default function InterceptingCreateApp() {
    return (
        <BackableDialog>
            <DialogTitle>- 创建应用 -</DialogTitle>
            <DialogContent>
                <CreateApp />
            </DialogContent>
        </BackableDialog>
    )
}