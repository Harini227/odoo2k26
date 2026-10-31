import { createClient } from "@/utils/supabase/server"
export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Search, Filter, ShieldCheck, ArrowUpRight, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { updateSubscriptionStatus } from "./actions"

export default async function SubscriptionsPage() {
    const supabase = await createClient()

    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select(`
      *,
      customers (name, email),
      plans (name, amount, interval, products(name))
    `)
        .order('created_at', { ascending: false })

    // Helper to safely format dates
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-'
        try {
            return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        } catch (e) {
            return '-'
        }
    }

    // Helper to safely calculate total
    const calculateTotal = (sub: any) => {
        const amount = Number(sub.plans?.amount || 0)
        const qty = Number(sub.quantity || 1)
        if (isNaN(amount) || isNaN(qty)) return 0
        return amount * qty
    }

    const totalActive = subscriptions?.filter((s: any) => s.status === 'active' || s.status === 'confirmed').length || 0

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            {/* Header Telemetry Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            Fleet Operations
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            {totalActive} Active Subscriptions
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Active Subscriptions Ledger</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage lifecycle states, contract periods, and recurring schedules.</p>
                </div>
                <Link href="/admin/subscriptions/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 text-xs sm:text-sm font-semibold h-9 px-4">
                        <Plus className="mr-1.5 h-4 w-4" /> Create Subscription
                    </Button>
                </Link>
            </div>

            {/* High-Density Ledger Table Card */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">
                {/* Search & Status Filter Strip */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by customer, plan or ID..."
                                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                        <span className="px-2.5 py-1 rounded-lg font-semibold bg-indigo-600 text-white shadow-sm">All ({subscriptions?.length || 0})</span>
                        <span className="px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Active</span>
                        <span className="px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Quotation</span>
                        <span className="px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Closed</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-3.5">Customer & Account</th>
                                <th className="px-5 py-3.5">Plan Details</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Billing Period</th>
                                <th className="px-5 py-3.5">Recurring Amount</th>
                                <th className="px-5 py-3.5 text-right">Workflow Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                            {!subscriptions || subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-32 text-center text-slate-500 py-12">
                                        No subscription records found in this cycle.
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub: any) => {
                                    const isSubActive = sub.status === 'active' || sub.status === 'confirmed'
                                    const isSubDraft = sub.status === 'draft' || sub.status === 'quotation'
                                    const isSubClosed = sub.status === 'closed' || sub.status === 'past_due'

                                    return (
                                        <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{sub.customers?.name || 'Unknown Client'}</div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{sub.customers?.email}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-slate-900 dark:text-white">{sub.plans?.products?.name || 'Enterprise SaaS'}</div>
                                                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{sub.plans?.name || 'Standard Tier'}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                                    isSubActive
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                        : isSubDraft
                                                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                                        isSubActive ? 'bg-emerald-500' : isSubDraft ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`}></span>
                                                    {sub.status ? sub.status.toUpperCase() : 'UNKNOWN'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                                                <div className="font-medium text-slate-900 dark:text-slate-200">
                                                    {formatDate(sub.current_period_start)}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    to {formatDate(sub.current_period_end)}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(calculateTotal(sub))}
                                                </div>
                                                <span className="text-[11px] text-slate-400 block capitalize">/ {sub.plans?.interval || 'cycle'}</span>
                                                {sub.quantity > 1 && (
                                                    <span className="text-[10px] text-slate-400 block">
                                                        ({sub.quantity} units)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {sub.status === 'draft' && (
                                                        <form action={updateSubscriptionStatus.bind(null, sub.id, 'quotation')}>
                                                            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-300 dark:border-slate-700 font-semibold">
                                                                Convert
                                                            </Button>
                                                        </form>
                                                    )}
                                                    {sub.status === 'quotation' && (
                                                        <form action={updateSubscriptionStatus.bind(null, sub.id, 'confirmed')}>
                                                            <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                                                                Confirm
                                                            </Button>
                                                        </form>
                                                    )}
                                                    {sub.status === 'confirmed' && (
                                                        <form action={updateSubscriptionStatus.bind(null, sub.id, 'active')}>
                                                            <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                                                                Activate
                                                            </Button>
                                                        </form>
                                                    )}
                                                    {sub.status === 'active' && (
                                                        <form action={updateSubscriptionStatus.bind(null, sub.id, 'closed')}>
                                                            <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 dark:hover:bg-rose-950/40">
                                                                Close
                                                            </Button>
                                                        </form>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
