'use client';


import { Button } from "@/components/ui/Button";
import { trpcClientReact } from "@/utils/api";
import Link from "next/link";
import React from "react";
interface AppPageProps {
    params: Promise<{ appId: string}>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function AppPage(props: AppPageProps) {
    const { appId } = React.use(props.params);
    console.log('appId', appId);
    const {data: apps, isPending } = trpcClientReact.apps.listApps.useQuery(
        undefined,
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false
        }
    );
    const currentApp = apps?.find((app) => app.id === appId);

    let children: React.ReactNode;
    if(isPending) {
        children = <div className="flex items-center justify-center ">Loading...</div>
    } else if(!currentApp) {
        children = (
            <div
            className="flex flex-col mt-10 p-4 border rounded-md max-w-48 mx-auto items-center"
            >
                <div className="flex flex-col gap-4 items-center">
                    {apps?.map((app) => (
                        <div className="flex flex-col w-full" key={app.id}>
                            <Button asChild variant="link">
                                <Link href={`/dashboard/apps/${app.id}`}>{app.name}</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return children;
}