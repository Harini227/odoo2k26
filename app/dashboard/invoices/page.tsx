import { createClient } from "@/utils/supabase/server"
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, Printer, ShieldCheck, Receipt } from "lucide-react"

export default async function CustomerInvoicesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div className="p-8 text-center text-slate-500">Please sign in to view invoices.</div>

    const { data: customer } = await supabase.from('customers').select('id').eq('email', user.email || '').single()

    if (!customer) return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Receipt className="h-8 w-8 text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No invoicing profile found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">Contact support or subscribe to an enterprise plan to initialize your ledger.</p>
        </div>
    )

    const { data: invoices } = await supabase
        .from('invoices')
        .select(`
      *,
      subscriptions (plans(name))
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
                            Corporate Statements
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tax Invoices & Receipts</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Download GST-compliant tax invoices and monitor real-time payment reconciliation.</p>
                </div>
            </div>

            {/* High-Density Ledger Table */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-3.5">Invoice #</th>
                                <th className="px-5 py-3.5">Description & Service Tier</th>
                                <th className="px-5 py-3.5">Settlement Amount</th>
                                <th className="px-5 py-3.5">Issued Date</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                            {!invoices || invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-32 text-center text-slate-500 py-12">
                                        No billing statements found for this account.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv: any) => {
                                    const isPaid = inv.status === 'paid' || inv.status === 'sent' || inv.status === 'confirmed'

                                    return (
                                        <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-white uppercase">
                                                INV-{inv.id.slice(0, 8)}
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                                                {inv.subscriptions?.plans?.name || 'Direct Enterprise Billing'}
                                            </td>
                                            <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                                ₹{Number(inv.amount_due).toFixed(2)}
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                                {new Date(inv.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                                    isPaid
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                    {inv.status ? inv.status.toUpperCase() : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex gap-1.5 justify-end">
                                                    <Link href={`/dashboard/invoices/${inv.id}`} title="View Details">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:text-slate-400">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/dashboard/invoices/${inv.id}`} title="Print Invoice">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:text-slate-400">
                                                            <Printer className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
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
