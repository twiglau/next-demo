'use client';

import { Button } from '@/components/ui/Button';
import { trpcClientReact } from '@/utils/api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Props {
    params: Promise<{ appId: string }>
}

export default function StoragePage(props: Props) {
    const { appId } = React.use(props.params);
    const utils = trpcClientReact.useUtils();
    const {mutate, isPending: isChangingStorage} = trpcClientReact.apps.changeStorage.useMutation({
        onSuccess: (data, variables) => {
            utils.apps.listApps.setData(undefined, (prev) => {
                if(!prev) return prev;
                return prev.map((app) => {
                    if(app.id === appId) {
                        return {
                            ...app,
                            storageId: variables.storageId,
                        }
                    }
                    return app;
                })
            });
        }
    });

    const {data: storages } = trpcClientReact.storages.listStorages.useQuery();
    const { data: apps } = trpcClientReact.apps.listApps.useQuery();

    const currentApp = apps?.find((app) => app.id === appId);

    return (
        <div className='pt-10 pl-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl mb-6'>Storage</h1>
                <Link href={`/dashboard/apps/${appId}/setting/storage/new`}>
                    <Button>
                        <Plus />
                    </Button>
                </Link>
            </div>
            {storages?.map((storage) => (
                <div 
                key={storage.id}
                className='border p-4 flex justify-between items-center m-4'
                >
                    <p>{storage.name}</p>
                    <Button 
                    className='cursor-pointer'
                    disabled={storage.id === currentApp?.storageId || isChangingStorage}
                    onClick={() => mutate({appId: appId, storageId: storage.id})}>
                        {storage.id === currentApp?.storageId ? 'Selected' : 'Select'}
                    </Button>
                </div>
            ))}
        </div>
    )
}