
'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
    ArrowRight, 
    Sparkles, 
    ShieldCheck, 
    Zap, 
    Percent, 
    Activity, 
    TrendingUp, 
    Receipt, 
    CheckCircle2, 
    Layers, 
    Users 
} from "lucide-react"

export function LandingHero() {
    const [planTier, setPlanTier] = useState<'starter' | 'growth' | 'scale'>('growth')
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
    const [subscribers, setSubscribers] = useState(250)

    const tierRates = {
        starter: { name: 'Starter Tier', base: 499, perSub: 8 },
        growth: { name: 'Growth Tier', base: 1499, perSub: 6 },
        scale: { name: 'Enterprise Scale', base: 4999, perSub: 4 }
    }

    const currentBase = tierRates[planTier].base
    const currentPerSub = tierRates[planTier].perSub
    const multiplier = billingCycle === 'annual' ? 0.8 : 1.0 // 20% discount
    const calculatedMRR = Math.round((currentBase + (subscribers * currentPerSub)) * multiplier)

    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            {/* Dynamic Background Mesh */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-indigo-500/15 via-emerald-500/10 to-transparent blur-3xl" />
                <div className="absolute top-1/2 right-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f012_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f012_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* LEFT COLUMN: Asymmetrical Bold Value Prop */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                        {/* Micro Brand Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Subscale v3.0</span>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <span className="text-slate-700 dark:text-slate-300">Modern Recurring Revenue Platform</span>
                        </motion.div>

                        {/* Hero Headline */}
                        <motion.h1
                            className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            Orchestrate Recurring Revenue with <br className="hidden sm:inline" />
                            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                                Autonomous Precision
                            </span>
                        </motion.h1>

                        {/* Value Subtitle */}
                        <motion.p
                            className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            Eliminate revenue leaks with unified contract lifecycles, automated multi-tier billing, dynamic tax compliance, and instant ledger reconciliation.
                        </motion.p>

                        {/* Quick-Action Feature Pills */}
                        <motion.div
                            className="flex flex-wrap gap-2.5 pt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                SOC-2 Type II Certified
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                                <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                Instant Ledger Sync
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                                <Percent className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                Automated GST & Taxes
                            </span>
                        </motion.div>

                        {/* Call to Actions */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3.5 pt-3 w-full sm:w-auto"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <Link href="/auth/signup" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto h-12 px-7 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all">
                                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/pricing" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 text-sm font-medium rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900">
                                    View Pricing Tiers
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Key Baseline Metrics */}
                        <motion.div
                            className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-6 w-full max-w-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                        >
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">99.98%</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Ledger SLA</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Automated Billing</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">&lt; 1 sec</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Invoice Dispatch</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Live Interactive Subscription Simulator Card */}
                    <div className="lg:col-span-5 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 shadow-2xl shadow-indigo-950/10"
                        >
                            {/* Simulator Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Live Billing Simulator</h3>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Interactive revenue forecast</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live Calculator
                                </span>
                            </div>

                            {/* Tier Selection Pills */}
                            <div className="pt-4 space-y-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    Select Plan Tier
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['starter', 'growth', 'scale'] as const).map((tier) => (
                                        <button
                                            key={tier}
                                            onClick={() => setPlanTier(tier)}
                                            className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all text-center capitalize ${
                                                planTier === tier
                                                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-sm'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50'
                                            }`}
                                        >
                                            {tier}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cycle Toggle */}
                            <div className="pt-4 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    Billing Frequency
                                </span>
                                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100/70 dark:bg-slate-800/50">
                                    <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                            billingCycle === 'monthly'
                                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('annual')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                                            billingCycle === 'annual'
                                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                                        }`}
                                    >
                                        <span>Annual</span>
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">-20%</span>
                                    </button>
                                </div>
                            </div>

                            {/* Subscriber Slider */}
                            <div className="pt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Subscribers Scale
                                    </span>
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                                        {subscribers.toLocaleString()} Active Clients
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="2000"
                                    step="10"
                                    value={subscribers}
                                    onChange={(e) => setSubscribers(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>

                            {/* Real-time Result Box */}
                            <div className="mt-5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/30 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                                            Forecasted Recurring Revenue
                                        </div>
                                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                                            ₹{calculatedMRR.toLocaleString()}
                                            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                                                /{billingCycle === 'annual' ? 'mo (billed ann.)' : 'mo'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center shrink-0">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Receipt className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                        Auto-invoices: {subscribers} generated
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Zero fees
                                    </span>
                                </div>
                            </div>

                            {/* Simulator Action Button */}
                            <div className="mt-5">
                                <Link href="/auth/signup" className="block w-full">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 transition-all text-xs">
                                        Deploy {tierRates[planTier].name} Architecture <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}

