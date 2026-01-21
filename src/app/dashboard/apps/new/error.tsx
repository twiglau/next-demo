"use client";

import { Button } from "@/components/ui/Button";

export default function CreateAppError(props : {error: Error, reset:() => void;}) {
    return (
        <div className="h-full flex justify-center items-center">
            <div className="w-64 flex-col mx-auto p-8 flex justify-center items-center gap-4">
                <div className="text-red-500">{props.error.message}</div>
                <Button onClick={props.reset}>Reset</Button>
            </div>
        </div>
    )
}