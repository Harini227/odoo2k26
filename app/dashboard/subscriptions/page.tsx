import { createClient } from "@/utils/supabase/server"
export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldCheck, ArrowUpRight, CreditCard, Sparkles } from "lucide-react"

export default async function MySubscriptionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div className="p-8 text-center text-slate-500">Please sign in to view your subscriptions.</div>

    const { data: customer } = await supabase.from('customers').select('id').eq('email', user.email || '').single()

    if (!customer) return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <CreditCard className="h-8 w-8 text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No client billing profile found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">Contact support or subscribe to an enterprise plan to initialize your ledger.</p>
            <Link href="/pricing" className="mt-4">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                    Browse Plans
                </Button>
            </Link>
        </div>
    )

    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select(`
            *,
            plans (name, amount, interval, products(name))
        `)
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            {/* Header Telemetry */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            Client Entitlements
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Active Service Contracts</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">View and manage your active enterprise service entitlements and renewal schedules.</p>
                </div>
                <Link href="/pricing">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 text-xs sm:text-sm font-semibold h-9 px-4">
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Upgrade / Add Plan
                    </Button>
                </Link>
            </div>

            {/* High-Density Ledger Table */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-3.5">Contract ID</th>
                                <th className="px-5 py-3.5">Product & Service Tier</th>
                                <th className="px-5 py-3.5">Recurring Rate</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Current Period End</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                            {!subscriptions || subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-32 text-center text-slate-500 py-12">
                                        No active service subscriptions linked to this corporate account.
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub: any) => {
                                    const isActive = sub.status === 'active' || sub.status === 'confirmed' || sub.status === 'trialing'

                                    return (
                                        <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-white uppercase">
                                                SUB-{sub.id.slice(0, 8)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{sub.plans?.products?.name || 'Enterprise Service'}</div>
                                                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{sub.plans?.name}</div>
                                            </td>
                                            <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                                ₹{sub.plans?.amount} <span className="text-[11px] text-slate-400 font-normal">/ {sub.plans?.interval}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                                    isActive
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                    {sub.status ? sub.status.toUpperCase() : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                                {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link href={`/dashboard/subscriptions/${sub.id}`}>
                                                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold h-7 px-2">
                                                        Manage
                                                        <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                                                    </Button>
                                                </Link>
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

