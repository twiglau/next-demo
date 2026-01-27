'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
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
            <Accordion type='single' collapsible>
                {storages?.map((storage) => (
                <AccordionItem 
                key={storage.id}
                value={`${storage.id}`}
                >
                    <AccordionTrigger
                    className={storage.id === currentApp?.storageId ? '' : ''}
                    >
                        {storage.name}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className='text-lg mb-6'>
                            <div className='flex justify-between items-center'>
                                <span>Region</span>
                                <span>{storage.configuration.region}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span>Bucket</span>
                                <span>{storage.configuration.bucket}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span>Endpoint</span>
                                <span>{storage.configuration.apiEndPoint}</span>
                            </div>
                        </div>
                        <Button 
                        className='cursor-pointer'
                        disabled={storage.id === currentApp?.storageId || isChangingStorage}
                        onClick={() => mutate({appId: appId, storageId: storage.id})}>
                            {storage.id === currentApp?.storageId ? 'Selected' : 'Select'}
                        </Button>
                        
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </div>
    )
}