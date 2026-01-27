'use client';

import React from "react";
import { trpcClientReact } from "@/utils/api";


export function Plan(props: React.HTMLAttributes<HTMLSpanElement>) {
    const { data: plan } = trpcClientReact.users.getPlan.useQuery(void 0, {
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    return (
        <span {...props}>
            {plan}
        </span>
    )
}