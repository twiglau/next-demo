'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { trpcClientReact } from '@/utils/api';
import copy from 'copy-to-clipboard';
import { Copy, Eye, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    params: Promise<{ appId: string}>;
}

function KeyString(props: {id:number}) {
    const { data: key } = trpcClientReact.apiKeys.requestKey.useQuery(props.id);

    return (
        <div className='flex justify-end items-center gap-2'>
            <span>{ key }</span>
            <Button
             size='sm'
             variant='ghost'
             onClick={() => {
                copy(key!);
                toast('secret key copied!')
             }}
            >
                <Copy />
            </Button>
        </div>
    )
}

export default function ApiKeyPage(props: Props) {
    const { appId } = React.use(props.params);
    const newApiKeyName = React.useRef('');
    const utils = trpcClientReact.useUtils();
    const { mutate } = trpcClientReact.apiKeys.createApiKey.useMutation({
        onSuccess: (data) => {
            utils.apiKeys.listApiKeys.setData({appId}, (prev) => {
                newApiKeyName.current = '';
                if(!prev || !data) {
                    return prev;
                }
                return [data, ...prev];
            })
        }
    })
    const { data: apiKeys } = trpcClientReact.apiKeys.listApiKeys.useQuery({
        appId
    });

    const [showKeyMap, setShowKeyMap] = useState<Record<number, boolean>>({})

    return (
        <div className='pt-10'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl mb-6'>Api Keys</h1>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button> <Plus /> </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className='flex flex-col gap-4'>
                            <Input 
                            placeholder='Name'
                            onChange={(e) => newApiKeyName.current = e.target.value}
                            />
                            <Button 
                            type='submit' 
                            onClick={() => mutate({appId, name: newApiKeyName.current})}
                            >
                                Submit
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <Accordion type='single' collapsible>
                {apiKeys?.map(keys => (
                    <AccordionItem 
                    key={keys.id}
                    value={keys.id.toString()}
                    >
                        <AccordionTrigger>{keys.name}</AccordionTrigger>
                        <AccordionContent>
                            <div className='flex justify-between text-lg mb-4'>
                                <span>Client Id</span>
                                <div className='flex justify-end items-center gap-2'>
                                    <span>{keys.clientId}</span>
                                    <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => {
                                        copy(keys.clientId);
                                        toast("client id copied!");
                                    }}
                                    >
                                        <Copy />
                                    </Button>
                                </div>
                            </div>
                            <div className='flex justify-between text-lg mb-4'>
                                <span>Secret Key</span>
                                {!showKeyMap[keys.id] && (
                                    <Button
                                    onClick={() => {
                                        setShowKeyMap((oldMap) => ({
                                            ...oldMap,
                                            [keys.id]: true
                                        }))
                                    }}
                                    >
                                        <Eye />
                                    </Button>
                                )}
                                {showKeyMap[keys.id] && (
                                    <KeyString id={keys.id} />
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

