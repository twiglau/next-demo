'use client';

import { useEffect } from 'react';
import { client } from "@/utils/trpc-api-test";
import { redirect } from "next/navigation";
import { trpcClientReact } from '@/utils/api';

export default function Home() {

  const { data } = trpcClientReact.test.useQuery()

  return <div>{data?.hello}</div> // redirect('/dashboard');
}