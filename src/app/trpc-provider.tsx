'use client';
import { FC, PropsWithChildren, useMemo } from "react";
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const TrpcProvider: FC<PropsWithChildren> = (props) => {
    const { children } = props;
    const queryClient = useMemo(() => new QueryClient(), []);
    return (
        <trpcClientReact.Provider client={trpcPureClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
            {children}
            </QueryClientProvider>
        </trpcClientReact.Provider>
    )
}

export { TrpcProvider };