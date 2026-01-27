'use client';

import { trpcClientReact } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardAppList() {

    const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery(
        void 0,
        {
            gcTime: Infinity,
            staleTime: Infinity,
        }
    );

    return (
        <div className="w-fit mx-auto pt-10">
            {
                isPending ? (
                    <div>Loading...</div>
                ) : (
                    <div className="flex w-full max-w-md flex-col gap-2 rounded-md border p-4">
                        {apps?.map(app => (
                            <div 
                            key={app.id}
                            className="flex items-center justify-between gap-6"
                            >
                                <div>
                                    <h2 className="text-xl">{app.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {app.description || 'No description'}
                                    </p>
                                </div>
                                <Button asChild variant="destructive">
                                    <Link href={`/dashboard/apps/${app.id}`}>View</Link>
                                </Button>
                            </div>
                        ))}
                        <Button asChild variant="outline">
                            <Link href={`/dashboard/apps/new`}>New App</Link>
                        </Button>
                    </div>
                )
            }
        </div>
    )
}