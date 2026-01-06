'use client';
import react, { useEffect } from 'react';
import { client } from "@/utils/trpc-api";
import { redirect } from "next/navigation";

export default function Home() {

  useEffect(() => {
    client.test.query();
  }, []);
  return redirect('/dashboard');
}