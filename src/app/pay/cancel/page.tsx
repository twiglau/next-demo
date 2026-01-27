

import { X } from "lucide-react";



export default function CancelPage() {
    return (
        <section>
            <div className="container p-4 mx-auto">
                <div className="bg-red-200 py-8 flex flex-col items-center space-y-4 md:space-y-8">
                    <div className="flex items-center justify-center size-16 rounded-full bg-red-500">
                        <X />
                    </div>
                    <h2 className="text-2xl font-semibold">Cancel</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Your payment has been canceled.
                    </p>
                </div>
            </div>
        </section>
    )
}