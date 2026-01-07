'use client';

import { useEffect } from 'react';
import { client } from "@/utils/trpc-api-test";
import { redirect } from "next/navigation";

export default function Home() {

  useEffect(() => {
    client.test.query();
  }, []);

  return <div>aaa</div> // redirect('/dashboard');
}