'use client';

import { Button } from "@/components/ui/Button";
import { trpcClientReact } from "@/utils/api";


export default function PlanPage() {

    const {mutateAsync, isPending} = trpcClientReact.users.upgrade.useMutation({
        onSuccess: (resp) => {
            window.location.href = resp.url
        }
    } )


    const handleUpgrade = () => {
        mutateAsync()
    }
    return (
        <section>
            <div className="container p-4 mx-auto">
                <div className="flex flex-col items-center space-y-4 md:space-y-8">
                    <div className="grid max-w-sm gap-4 md:grid-cols-1 md:max-w-none md:gap-8">
                        <div className="flex flex-col rounded-lg border-2 border-indigo-600">
                            <div className="flex-1 grid items-center justify-center p-6 text-center">
                                <h2 className="text-2xl font-semibold">Pro</h2>
                                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                                    For growing usage with additional needs.
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-6">
                                <span className="text-2xl font-semibold">$19</span>
                                <span className="ml-1 text-sm text-gray-400 dark:text-gray-500">/month</span>
                            </div>
                            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                                <li className="flex items-center justify-between p-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Unlimited</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Upload</span>
                                </li>
                                <li className="flex items-center justify-between p-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Unlimited</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">App</span>
                                </li>
                                <li className="flex items-center justify-between p-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Unlimited</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Storage Configurations</span>
                                </li>
                                <li className="flex items-center justify-between p-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">AI</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Feature</span>
                                </li>
                            </ul>
                            <div className="p-4 mx-auto">
                                <Button
                                    variant="default"
                                    size="lg"
                                    disabled={isPending}
                                    loading={isPending}
                                    onClick={handleUpgrade}
                                >
                                    Upgrade
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}