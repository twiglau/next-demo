'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
    params: Promise<{appId: string}>;
    children: React.ReactNode;
}

export default function Layout(props: Props) {
    const { params, children } = props;
    const { appId } = React.use(params);
    const path = usePathname();

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
                        asChild={path !== item.path}
                        disabled={path === item.path}
                        key={item.name}
                        size="lg"
                        variant={path !== item.path ? 'link':'ghost'}
                        >
                            {
                                path !== item.path ? 
                                    <Link href={item.path}>{item.name}</Link> : 
                                    item.name
                            }
                        </Button>
                    ))
                }
            </div>
            <div className='grow'>{children}</div>
        </div>
    )
}