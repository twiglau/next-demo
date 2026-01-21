'use client';


import { Button } from "@/components/ui/Button";
import { trpcClientReact } from "@/utils/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import React  from "react"

type Props = {
    params: Promise<{appId: string}>
}

export default function AppDashboardNav(props: Props) {
    const { appId } = React.use(props.params);
    const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
    const currentApp = apps?.find(app => app.id === appId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    {isPending ? 'Loading...' : currentApp ? currentApp.name : '...'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {apps?.map(app => (
                    <DropdownMenuItem disabled={app.id === appId} key={app.id}>
                        <Link className="w-full" href={`/dashboard/apps/${app.id}`}>
                            {app.name}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )

}