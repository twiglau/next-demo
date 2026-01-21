import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getServerSession } from "@/server/auth";
import { createAppSchema } from "@/server/db/validate-schema";
import { serverCaller } from "@/utils/trpc";
import { redirect } from "next/navigation";
import SubmitButton from "./submit-button";


export default function CreateApp() {
    const createApp = async (formData: FormData) => {
        'use server';
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const input = createAppSchema.pick({name: true, description: true}).safeParse({name, description});
        if (!input.success) {
            throw input.error;
        }
        const session = await getServerSession();
        const newApp = await serverCaller({ session }).apps.createApp(input.data);
        redirect(`/dashboard/apps/${newApp.id}`);
    }

    return (
        <div className="h-full flex justify-center items-center">
            <form action={createApp} className="flex flex-col gap-4 w-full max-w-md">
                <h1 className="text-center text-xl font-bold">Create App</h1>
                <Input 
                    name="name"
                    placeholder="App Name"
                    minLength={3}
                    required
                />
                <Textarea 
                    name="description"
                    placeholder="App Description"
                />
                <SubmitButton />
            </form>
        </div>
    );
}