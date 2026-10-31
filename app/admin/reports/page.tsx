import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, TrendingUp, Users, AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
    const supabase = await createClient()

    // 1. Get Revenue Summary
    const { data: revData } = await supabase.from('invoices').select('amount_paid, amount_due, status, due_date')
    const totalRevenue = revData?.filter(i => i.status === 'paid').reduce((acc, i) => acc + Number(i.amount_paid || 0), 0) || 0
    const pendingRevenue = revData?.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((acc, i) => acc + Number(i.amount_due || 0), 0) || 0

    // Check for overdue (due_date < now and status != 'paid')
    const now = new Date().toISOString()
    const overdueInvoices = revData?.filter(i => i.status !== 'paid' && i.status !== 'cancelled' && i.due_date < now).length || 0

    // 2. Get Subscription status counts
    const { data: subData } = await supabase.from('subscriptions').select('status')
    const activeSubs = subData?.filter(s => s.status === 'active').length || 0
    const trialSubs = subData?.filter(s => s.status === 'trialing').length || 0
    const closedSubs = subData?.filter(s => s.status === 'closed').length || 0

    // 3. Get Top Customers (by revenue)
    const { data: topCustomers } = await supabase
        .from('invoices')
        .select('customer_id, amount_paid, customers(name)')
        .eq('status', 'paid')

    // Group and sort
    const customerRev: Record<string, { name: string, total: number }> = {}
    topCustomers?.forEach((inv: any) => {
        const id = inv.customer_id
        if (!customerRev[id]) customerRev[id] = { name: inv.customers?.name || 'Unknown', total: 0 }
        customerRev[id].total += Number(inv.amount_paid)
    })
    const sortedCustomers = Object.entries(customerRev)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5)

    return (
        <div className="space-y-6">
            <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Financial & Operations Intelligence</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ledger audit, revenue realization, and cohort retention telemetry.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-emerald-50/70 border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-800/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Settled Revenue</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-950 dark:text-emerald-100">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">Realized to account</p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50/70 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-800/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">Outstanding Invoices</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-950 dark:text-amber-100">{formatCurrency(pendingRevenue)}</div>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-medium">In dispatch cycle</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Subs</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeSubs}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Live contracts</p>
                    </CardContent>
                </Card>

                <Card className="bg-rose-50/70 border-rose-200/80 dark:bg-rose-950/30 dark:border-rose-800/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-300">Overdue Invoices</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-950 dark:text-rose-100">{overdueInvoices}</div>
                        <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 font-medium">Action required</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Revenue Channels (Customers)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="text-right">Total Paid</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedCustomers.map(([id, data]) => (
                                    <TableRow key={id}>
                                        <TableCell className="font-medium">{data.name}</TableCell>
                                        <TableCell className="text-right font-mono">{formatCurrency(data.total)}</TableCell>
                                    </TableRow>
                                ))}
                                {sortedCustomers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">No data yet</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Lifecycle Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Active Success Rate</span>
                                <span className="font-semibold">{((activeSubs / (activeSubs + closedSubs || 1)) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(activeSubs / (activeSubs + closedSubs || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center pt-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="text-xs text-muted-foreground">Total Created</div>
                                <div className="text-lg font-bold">{subData?.length || 0}</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="text-xs text-muted-foreground">Trials</div>
                                <div className="text-lg font-bold">{trialSubs}</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="text-xs text-muted-foreground">Churned</div>
                                <div className="text-lg font-bold">{closedSubs}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
