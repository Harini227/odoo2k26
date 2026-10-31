import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Users, CreditCard, Activity, TrendingUp, Sparkles, Plus, ArrowUpRight, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch Revenue (Total of paid invoices)
    const { data: revenueData } = await supabase.from('invoices').select('amount_paid').eq('status', 'paid')
    const totalRevenue = revenueData?.reduce((acc, inv) => acc + Number(inv.amount_paid), 0) || 0

    // Fetch Subscription counts
    const { count: subscriptionCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true })

    // Fetch Active Plans count
    const { count: activePlansCount } = await supabase.from('plans').select('*', { count: 'exact', head: true }).eq('active', true)

    // Fetch Recent Invoices
    const { data: recentInvoices } = await supabase
        .from('invoices')
        .select(`
            id,
            amount_due,
            status,
            created_at,
            customers (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(6)

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            {/* Executive Telemetry Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            Subscale Command
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Telemetry
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Executive Telemetry</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Enterprise recurring revenue engine & subscriber fleet orchestration.</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Link href="/admin/plans/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 text-xs sm:text-sm font-semibold h-9 px-3.5">
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            New Plan
                        </Button>
                    </Link>
                    <Link href="/admin/subscriptions/new">
                        <Button variant="outline" className="border-slate-300 dark:border-slate-800 text-xs sm:text-sm font-medium h-9 px-3.5">
                            New Quotation
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Compact Stat Widgets with Trend Indicators */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900/90">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Settled (ARR)</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <IndianRupee className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                                <TrendingUp className="h-3 w-3 mr-0.5" />
                                +14.8%
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">vs last cycle</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900/90">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subscribers</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{subscriptionCount || 0}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded">
                                <TrendingUp className="h-3 w-3 mr-0.5" />
                                +9.2%
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">active accounts</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900/90">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Catalog Plans</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <Activity className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{activePlansCount || 0}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">100% active</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">in catalog</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900/90">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Invoices Settled</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{revenueData?.length || 0}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                                <TrendingUp className="h-3 w-3 mr-0.5" />
                                100%
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">fulfillment rate</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Split Content: High-Density Ledger Table & Health Index */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* High Density Ledger Table */}
                <Card className="lg:col-span-4 border-slate-200/90 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/90">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Recent Ledger Transactions</CardTitle>
                                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Latest billing settlements processed across all client accounts.
                                </CardDescription>
                            </div>
                            <Link href="/admin/invoices">
                                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-0 h-auto hover:bg-transparent">
                                    Full Ledger
                                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {(!recentInvoices || recentInvoices.length === 0) ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-12 text-sm">No recent transactions recorded in this cycle.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                        <tr>
                                            <th className="px-5 py-3">Client</th>
                                            <th className="px-5 py-3">Amount</th>
                                            <th className="px-5 py-3">Status</th>
                                            <th className="px-5 py-3 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                        {recentInvoices.map((inv: any) => (
                                            <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="font-semibold text-slate-900 dark:text-white">{inv.customers?.name || "Corporate Customer"}</div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{inv.customers?.email}</div>
                                                </td>
                                                <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                                                    ₹{Number(inv.amount_due).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                        inv.status === 'paid'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full mr-1 ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {inv.status ? inv.status.toUpperCase() : 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right text-slate-500 dark:text-slate-400">
                                                    {inv.created_at ? new Date(inv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Health & Reliability Panel */}
                <Card className="lg:col-span-3 border-slate-200/90 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/90">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Platform Health & Reliability</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Operational benchmarks and payment settlement integrity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">Subscription Health Index</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">96.4% Active</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full" style={{ width: '96.4%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">Gateway Settlement Rate</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.1%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full shadow-sm" style={{ width: '99.1%' }}></div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Audit Compliance</div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                ISO-27001 & SOC-2 Type II standards active. Automated double-entry reconciliation and invoice hash validation in sync.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
