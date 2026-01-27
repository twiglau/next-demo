'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export function AutoRedirect({ delay, url }: { delay: number; url: string }) {

    const router = useRouter();
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(url)
        }, delay);
        return () => clearTimeout(timer);
        
    }, [delay, url, router]);

    return null;
}