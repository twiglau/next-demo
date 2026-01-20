'use client';

import { Button } from "@/components/ui/Button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";



export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        setReady(true);
    }, []);

    if(!ready) {
        return null;
    }
    
    return (
        <Button className="cursor-pointer" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            { isDark ? <Sun /> : <Moon />}
        </Button>
    );
}