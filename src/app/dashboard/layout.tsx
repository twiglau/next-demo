import { getServerSession } from "@/server/auth"
import { redirect } from "next/navigation";
import '../globals.css';
import React from 'react';


export default async function RootLayout({ 
children,
nav }: Readonly<{ 
    children: React.ReactNode, 
    nav:React.ReactNode 
}>){

    const session = await getServerSession();
    if(!session?.user) {
        redirect('/api/auth/signin')
    }


    return (
        <>
            {nav}
            {children}
        </>
    )
}