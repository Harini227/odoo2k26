
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { signup } from "../actions"
import { useSearchParams, useRouter } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import { toast } from "sonner"
import { TriangleAlert, Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"

export default function SignupForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams.get('error')
    const toastShownRef = useRef(false)
    const [password, setPassword] = useState('')

    const passwordRequirements = {
        length: password.length > 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]|_/.test(password),
    }

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

    useEffect(() => {
        if (error && !toastShownRef.current) {
            toastShownRef.current = true

            toast.warning(error, {
                icon: <TriangleAlert className="h-5 w-5 mr-3 text-amber-500" />,
                description: "Review current fields and try again.",
                duration: 5000,
                id: "signup-error"
            })

            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('error')
            router.replace(newUrl.pathname + newUrl.search)
        } else if (!error) {
            toastShownRef.current = false
        }
    }, [error, router])

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const result = await signup(formData).catch(() => null)
        // If signup redirects, loading stays true until page change.
        // If correct, user is redirected. If error is returned via URL param,
        // the useEffect above flips it off.
        if (!result) setLoading(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
        >
            {/* LEFT PANEL: Deep Indigo/Slate Gradient */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                    <div>
                        <Logo size="lg" subtitle="Enterprise Onboarding" inverted />
                    </div>

                    <div className="pt-4 space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Deploy Your Recurring Engine</h2>
                        <p className="text-xs text-indigo-200/90 leading-relaxed">
                            Create an account in 60 seconds to access multi-currency billing, custom subscription tiers, and automated invoice dispatch.
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 text-xs text-indigo-100">
                            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            </div>
                            <span>14-Day Full Platform Trial</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-indigo-100">
                            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                            </div>
                            <span>No Credit Card Required</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-indigo-100">
                            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            </div>
                            <span>Instant Sandbox Verification</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-6 relative z-10">
                    <p className="text-[11px] text-indigo-200/80">
                        Protected by bank-grade TLS encryption and strict SOC-2 Type II standards.
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL: Registration Form */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-950">
                <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create Enterprise Account</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Fill in your business details to launch your Subscale subscription space.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label htmlFor="first-name" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">First Name</label>
                            <Input id="first-name" name="first-name" placeholder="Alex" required className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="last-name" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Last Name</label>
                            <Input id="last-name" name="last-name" placeholder="Vance" required className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Work Email</label>
                        <Input id="email" name="email" type="email" placeholder="alex@company.com" required className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Password</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {password && (
                            <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px]">
                                <div className={`flex items-center gap-1.5 ${passwordRequirements.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {passwordRequirements.length ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                                    <span>8+ characters</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordRequirements.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {passwordRequirements.uppercase ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                                    <span>1 uppercase letter</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordRequirements.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {passwordRequirements.lowercase ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                                    <span>1 lowercase letter</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordRequirements.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {passwordRequirements.special ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                                    <span>1 special character</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 transition-all text-sm mt-2"
                        disabled={(!isPasswordValid && password.length > 0) || loading}
                    >
                        {loading ? 'Deploying workspace...' : 'Get Started with Subscale'}
                    </Button>
                </form>

                <div className="relative my-5">
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
                    const { loginWithGoogle } = await import("../actions")
                    await loginWithGoogle()
                }}>
                    <Button variant="outline" type="submit" className="w-full h-10 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium">
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Sign up with Google
                    </Button>
                </form>

                <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
