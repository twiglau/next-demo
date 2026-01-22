'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import React from 'react';

type Props = {
    params: Promise<{appId: string}>;
    children: React.ReactNode;
}

export default function Layout(props: Props) {
    const { params, children } = props;
    const { appId } =React.use(params);

    const links:{name:string, path:string}[] = [
       {name: 'Storage', path: `/dashboard/apps/${appId}/setting/storage`},
       {name: 'Api Key', path: `/dashboard/apps/${appId}/setting/api-key`},
       {name: 'Tag Manager', path: `/dashboard/apps/${appId}/setting/tag-manager`},
    ]

    return (
        <div className='flex justify-start container mx-auto'>
            <div className='flex flex-col w-60 shrink-0   pt-10 gap-4'>
                { 
                    links.map(item => (
                        <Button
                        key={item.name}
                        size="lg"
                        variant="ghost"
                        >
                            <Link href={item.path}>{item.name}</Link>
                        </Button>

                    ))
                }
            </div>
            <div className='grow'>{children}</div>
        </div>
    )
}