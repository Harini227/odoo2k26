'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { loginCustomer } from "../actions"
import { useSearchParams, useRouter } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import { toast } from "sonner"
import { TriangleAlert, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"

export default function LoginForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams.get('error')
    const toastShownRef = useRef(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (error && !toastShownRef.current) {
            toastShownRef.current = true
            setLoading(false) // Reset loading on error return

            toast.warning(error, {
                icon: <TriangleAlert className="h-5 w-5 mr-3 text-amber-500" />,
                description: "Please check your details.",
                duration: 5000,
                id: "login-error"
            })

            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('error')
            router.replace(newUrl.pathname + newUrl.search)
        } else if (!error) {
            toastShownRef.current = false
        }
    }, [error, router])

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
        >
            {/* LEFT PANEL: Deep Indigo/Slate Gradient with Value Highlights & Trust */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                    <div>
                        <Logo size="lg" subtitle="Enterprise Identity" inverted />
                    </div>

                    <div className="pt-4 space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Financial Command Center</h2>
                        <p className="text-xs text-indigo-200/90 leading-relaxed">
                            Sign in to orchestrate subscriptions, review real-time ledger syncs, and generate automated GST invoices.
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 text-xs text-indigo-100">
                            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            </div>
                            <span>SOC-2 Type II Certified Security</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-indigo-100">
                            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                            </div>
                            <span>Zero-Fee Recurring Billing</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-indigo-100">
                            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            </div>
                            <span>Automated Quote-to-Cash Settlement</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-6 relative z-10">
                    <p className="text-[11px] text-indigo-200/80 italic">
                        &ldquo;Subscale modernized our recurring billing pipeline with zero manual errors.&rdquo;
                    </p>
                    <p className="text-[10px] font-semibold text-white mt-1">Enterprise Finance Team</p>
                </div>
            </div>

            {/* RIGHT PANEL: Authentication Form */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-950">
                <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sign In to Your Workspace</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Enter your credentials below to access customer or administrator portals.
                    </p>
                </div>

                <form action={loginCustomer} onSubmit={() => setLoading(true)} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Work Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Password
                            </label>
                            <Link href="/auth/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 transition-all text-sm mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Sign In to Subscale"
                        )}
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 font-medium">
                            Or continue with
                        </span>
                    </div>
                </div>

                <form action={async () => {
                    setLoading(true)
                    const { loginWithGoogle } = await import("../actions")
                    await loginWithGoogle()
                }}>
                    <Button variant="outline" type="submit" disabled={loading} className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium">
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        {loading ? 'Redirecting...' : 'Sign in with Google'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold underline underline-offset-4">
                        Create an account
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
