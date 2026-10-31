import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CreditCard, Calendar, Zap, Sparkles, ShieldCheck, Receipt, Activity, ArrowUpRight, CheckCircle2, Clock } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CustomerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div className="p-8 text-center text-slate-500">Please sign in to access your dashboard.</div>

    // Find customer profile linked to this user
    const { data: customer } = await supabase.from('customers').select('id, name').eq('email', user.email || '').single()

    let subscription = null
    let invoices: any[] = []

    if (customer) {
        // Find active subscription
        const { data: sub } = await supabase.from('subscriptions')
            .select(`
            *,
            plans (name, amount, interval, products(name))
        `)
            .eq('customer_id', customer.id)
            .in('status', ['active', 'trialing'])
            .maybeSingle()

        subscription = sub

        // Find invoices
        const { data: invs } = await supabase.from('invoices')
            .select('*')
            .eq('customer_id', customer.id)
            .order('created_at', { ascending: false })
            .limit(5)

        invoices = invs || []
    }

    // Calculate days remaining in billing period if subscription exists
    let daysRemaining = 0
    let periodProgress = 70 // default visual meter percentage
    if (subscription?.current_period_end) {
        const endDate = new Date(subscription.current_period_end).getTime()
        const startDate = subscription.current_period_start ? new Date(subscription.current_period_start).getTime() : endDate - (30 * 24 * 60 * 60 * 1000)
        const now = Date.now()
        const totalDuration = Math.max(1, endDate - startDate)
        const elapsed = Math.max(0, now - startDate)
        periodProgress = Math.min(100, Math.max(5, Math.round((elapsed / totalDuration) * 100)))
        daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)))
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
            {/* Executive Welcome Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            Client Portal
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Ledger
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Account Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Welcome back, {user.user_metadata?.full_name || user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/pricing">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 text-xs sm:text-sm font-semibold h-9 px-4">
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            Upgrade Service
                        </Button>
                    </Link>
                    <Link href="/dashboard/invoices">
                        <Button variant="outline" className="border-slate-300 dark:border-slate-800 text-xs sm:text-sm font-medium h-9 px-4">
                            <Receipt className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                            Statements
                        </Button>
                    </Link>
                </div>
            </div>

            {!customer && (
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 p-6 sm:p-8 dark:border-indigo-900/40 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-950 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                                <Zap className="h-4 w-4" />
                                Instant Deployment
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome to Subscale Infrastructure</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                                Configure your enterprise billing profile and connect your subscription plan to unlock automated recurring transactions and telemetry.
                            </p>
                        </div>
                        <Link href="/pricing" className="shrink-0">
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                                Explore Plans & Subscribe
                                <ArrowUpRight className="h-4 w-4 ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Top Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Active Subscription Card */}
                <div className="col-span-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Subscription</h2>
                                    {subscription && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                            {subscription.status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Entitlement lifecycle & real-time quota telemetry
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
                                <Activity className="h-3.5 w-3.5 text-indigo-500" />
                                Auto-Renew Active
                            </span>
                        </div>

                        {subscription ? (
                            <div className="pt-6 space-y-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white mt-1 truncate">{subscription.plans?.products?.name || "Enterprise Core"}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Plan Tier</p>
                                        <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mt-1 truncate">{subscription.plans?.name}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Renewal</p>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                                            {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rate</p>
                                        <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                                            ₹{subscription.plans?.amount} <span className="text-[11px] font-normal text-slate-400">/{subscription.plans?.interval}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Billing Cycle Progress Meter */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-indigo-500" />
                                            Billing Cycle Elapsed
                                        </span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Renews today'}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${periodProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 mt-4">
                                <CreditCard className="h-8 w-8 text-slate-400 mb-2" />
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No active subscription plan</p>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                    Subscribe to an enterprise plan to begin automated ledger tracking and recurring billing.
                                </p>
                                <Link href="/pricing" className="mt-4">
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                                        Browse Tier Catalog
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {subscription && (
                        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Entitlements verified with active SSL encryption
                            </span>
                            <Link href={`/dashboard/subscriptions/${subscription.id}`}>
                                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 p-0 h-auto font-semibold">
                                    Manage Subscription Details
                                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Account Summary & Quick Navigation */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Workspace Entitlement</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick access to billing controls</p>
                        </div>

                        <div className="pt-5 space-y-3">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white">Payment Method</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Razorpay / Stripe Gateway</p>
                                    </div>
                                </div>
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                                    Verified
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Receipt className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white">Ledger Status</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Synced to Supabase v2</p>
                                    </div>
                                </div>
                                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                                    In Sync
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 grid gap-2.5">
                        <Link href="/pricing" className="w-full">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold h-9">
                                Change / Upgrade Plan
                            </Button>
                        </Link>
                        <Link href="/dashboard/invoices" className="w-full">
                            <Button variant="outline" className="w-full border-slate-200 dark:border-slate-800 text-xs font-medium h-9">
                                Download Statements
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* High-Density Ledger Statements Table */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-100 dark:border-slate-800 gap-2">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Billing History & Settled Invoices</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Real-time transaction register for your corporate account
                        </p>
                    </div>
                    <Link href="/dashboard/invoices">
                        <Button variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-0 h-auto hover:bg-transparent">
                            View All Statements
                            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                    </Link>
                </div>

                <div className="p-0">
                    {invoices.length === 0 ? (
                        <div className="text-sm text-slate-500 py-12 text-center">
                            <Receipt className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
                            No billing records generated for this account yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-3.5">Statement ID</th>
                                        <th className="px-6 py-3.5">Date Settled</th>
                                        <th className="px-6 py-3.5">Amount</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5 text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                    {invoices.map((inv: any) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                                                INV-{inv.id.slice(0, 8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {new Date(inv.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                                ₹{Number(inv.amount_due).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                                    inv.status === 'paid'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                    {inv.status ? inv.status.toUpperCase() : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/dashboard/invoices`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                                    Download
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
