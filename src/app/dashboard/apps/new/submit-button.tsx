"use client";

import { Button } from "@/components/ui/Button";
import { useFormStatus } from "react-dom";


export default function SubmitButton() {
    // TODO: useFormStatus 作用
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Submitting...' : 'Create'}
        </Button>
    );
}