'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle, ShieldCheck, Zap, Sparkles, HelpCircle } from "lucide-react"

interface PricingViewProps {
    plans: any[]
    user: any
}

export function PricingView({ plans, user }: PricingViewProps) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

    const comparisonFeatures = [
        { name: "Quote-to-Subscription Conversion", starter: true, growth: true, scale: true },
        { name: "Automated GST & Tax Invoicing", starter: true, growth: true, scale: true },
        { name: "Customer Self-Service Portal", starter: true, growth: true, scale: true },
        { name: "Payment Gateway Integration", starter: true, growth: true, scale: true },
        { name: "Real-Time Ledger Reconciliation", starter: false, growth: true, scale: true },
        { name: "Cohort Retention & Churn Analytics", starter: false, growth: true, scale: true },
        { name: "Multi-Currency Dynamic Billing", starter: false, growth: false, scale: true },
        { name: "Dedicated Account Concierge", starter: false, growth: false, scale: true },
        { name: "99.99% Uptime Financial SLA", starter: false, growth: false, scale: true },
    ]

    return (
        <div className="space-y-16">
            {/* Header & Interactive Billing Toggle */}
            <div className="flex flex-col items-center justify-center space-y-5 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-4 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Predictable Enterprise Pricing</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900 dark:text-white">
                    Scale Your Recurring Revenue
                </h1>
                <p className="text-slate-600 md:text-lg dark:text-slate-400">
                    Simple, transparent tiers with automated billing, self-service portals, and zero hidden platform cuts.
                </p>

                {/* Monthly vs. Annual Billing Toggle */}
                <div className="pt-3 inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                            billingCycle === 'monthly'
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                        }`}
                    >
                        Monthly Billing
                    </button>
                    <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                            billingCycle === 'annual'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                        }`}
                    >
                        <span>Annual Billing</span>
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                            Save 20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                {plans && plans.length > 0 ? (
                    plans.map((plan: any) => {
                        const baseAmount = Number(plan.amount)
                        const finalAmount = billingCycle === 'annual' ? Math.round(baseAmount * 0.8) : baseAmount

                        return (
                            <div
                                key={plan.id}
                                className="relative flex flex-col p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-2xl text-slate-900 dark:text-white">{plan.name}</h3>
                                        {plan.name.toLowerCase().includes('pro') && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                                                Most Popular
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                        {plan.products?.name || "Enterprise Tier"}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-baseline text-4xl font-extrabold text-slate-900 dark:text-white">
                                    ₹{finalAmount.toLocaleString()}
                                    <span className="ml-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        /{plan.interval} {billingCycle === 'annual' ? '(billed annually)' : ''}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 min-h-[44px]">
                                    {plan.products?.description || "Complete access to our recurring billing automation and tax calculation engine."}
                                </p>

                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3.5 flex-1">
                                    <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>Instant Quote-to-Cash Automation</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>Automated Invoicing & Receipts</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>Self-Service Customer Portal</span>
                                    </div>
                                    {plan.trial_period_days > 0 && (
                                        <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                            <span>{plan.trial_period_days}-Day Trial Included</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-4">
                                    <Link
                                        href={user ? `/dashboard/checkout?plan=${plan.id}` : `/auth/signup?next=/dashboard/checkout&plan=${plan.id}`}
                                        className="block w-full"
                                    >
                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 shadow-sm rounded-xl transition-all hover:-translate-y-0.5"
                                            size="lg"
                                        >
                                            {user ? "Subscribe to Tier" : "Get Started Free"}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">No public subscription tiers are currently available.</p>
                    </div>
                )}
            </div>

            {/* Feature Comparison Matrix */}
            <div className="max-w-5xl mx-auto pt-10">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Detailed Tier Comparison</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Compare enterprise architecture and capabilities across service tiers.</p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                                <th className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">Platform Capability</th>
                                <th className="p-4 text-center font-semibold text-slate-700 dark:text-slate-300">Basic</th>
                                <th className="p-4 text-center font-semibold text-indigo-600 dark:text-indigo-400">Standard / Pro</th>
                                <th className="p-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {comparisonFeatures.map((feat, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="p-4 sm:p-5 font-medium text-slate-800 dark:text-slate-200">
                                        {feat.name}
                                    </td>
                                    <td className="p-4 text-center">
                                        {feat.starter ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-slate-300 dark:text-slate-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {feat.growth ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-slate-300 dark:text-slate-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {feat.scale ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-slate-300 dark:text-slate-700 mx-auto" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
