import React from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { ShieldCheck, ArrowUpRight } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-4">
                        <Logo size="md" subtitle="Revenue Infrastructure" />
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                            Subscale is an autonomous recurring billing, contract lifecycle, and automated invoice settlement platform built for high-growth SaaS and enterprise fintech.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                All Systems Operational
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                                SOC-2 Type II
                            </span>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Solutions
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                <Link href="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Recurring Engine
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Catalog Tiers
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Customer Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Admin Telemetry
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Access & Compliance */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Platform
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                <Link href="/auth/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                                    Client Sign In
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                                    Get Started
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </li>
                            <li>
                                <span className="text-xs text-slate-400">API Documentation v3.0</span>
                            </li>
                            <li>
                                <span className="text-xs text-slate-400">GST Double-Entry Ledger</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <p>© {new Date().getFullYear()} Subscale Inc. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Engineered with Next.js, Supabase & Tailwind CSS.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
