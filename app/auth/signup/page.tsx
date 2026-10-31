
import SignupForm from "./signup-form"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50/60 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
            <Suspense fallback={
                <div className="w-full max-w-4xl p-8 text-center text-slate-500">
                    Loading Subscale onboarding...
                </div>
            }>
                <SignupForm />
            </Suspense>
        </div>
    )
}
