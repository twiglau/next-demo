'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { trpcClientReact } from '@/utils/api';
import { Plus } from 'lucide-react';
import React from 'react';

interface Props {
    params: Promise<{ appId: string}>;
}

export default function ApiKeyPage(props: Props) {
    const { appId } = React.use(props.params);
    const newApiKeyName = React.useRef('');
    const utils = trpcClientReact.useUtils();
    const { mutate } = trpcClientReact.apiKeys.createApiKey.useMutation({
        onSuccess: (data) => {}
    })
    const { data: apiKeys } = trpcClientReact.apiKeys.listApiKeys.useQuery({
        appId
    });

    return (
        <div className='pt-10'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl mb-6'>Api Keys</h1>
                <Popover>
                    <PopoverTrigger>
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
            {apiKeys?.map(keys => (
                <div 
                key={keys.id}
                className='border p-4 flex justify-between items-center m-4'
                >
                    <span>{keys.name}</span>
                    <span>{keys.key}</span>
                </div>
            ))}
        </div>
    )
}

