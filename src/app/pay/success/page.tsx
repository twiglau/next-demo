import { Check } from "lucide-react";
import { AutoRedirect } from "./AutoRedirect";


export default function SuccessPage() {
    return (
        <section>
            <div className="container p-4 mx-auto">
                <div className="bg-amber-200 py-8 flex flex-col items-center space-y-4 md:space-y-8">
                    <div className="flex items-center justify-center size-16 rounded-full bg-green-500">
                        <Check />
                    </div>
                    <h2 className="text-2xl font-semibold">Success</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Your payment has been successfully processed.
                    </p>
                </div>
                <AutoRedirect delay={3000} url="/dashboard" />
            </div>
        </section>
    )
}