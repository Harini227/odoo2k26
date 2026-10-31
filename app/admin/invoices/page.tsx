import { createClient } from "@/utils/supabase/server"
export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { sendInvoiceManually, cancelInvoice, confirmInvoice, markInvoicePaid } from "./actions"
import SendInvoiceButton from "./send-button"
import PrintInvoiceButton from "./print-button"
import Link from "next/link"
import { XCircle, Eye, Search, Receipt, ShieldCheck, CheckCircle2, Clock } from "lucide-react"

export default async function InvoicesPage() {
    const supabase = await createClient()

    const { data: invoices } = await supabase
        .from('invoices')
        .select(`
      *,
      customers (name, email),
      subscriptions (plan_id, quantity, plans(name))
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

    const totalPaid = invoices?.filter((inv: any) => inv.status === 'paid').length || 0

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            {/* Header Telemetry Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            Accounts Receivable
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            {totalPaid} Settled Invoices
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Invoices & Billing Ledger</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Automated recurring billing events, payment reconciliations, and customer receipts.</p>
                </div>
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
                                placeholder="Search by invoice ID or customer..."
                                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                        <span className="px-2.5 py-1 rounded-lg font-semibold bg-indigo-600 text-white shadow-sm">All ({invoices?.length || 0})</span>
                        <span className="px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Paid</span>
                        <span className="px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Pending</span>
                        <span className="px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Draft</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-3.5">Invoice ID</th>
                                <th className="px-5 py-3.5">Customer & Entitlement</th>
                                <th className="px-5 py-3.5">Amount Due</th>
                                <th className="px-5 py-3.5">Due Date</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Workflow & Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                            {!invoices || invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-32 text-center text-slate-500 py-12">
                                        No invoices generated yet. Activate a subscription to record an invoice.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv: any) => {
                                    const isPaid = inv.status === 'paid' || inv.status === 'sent'
                                    const isDraft = inv.status === 'draft' || inv.status === 'confirmed'
                                    const isOverdue = inv.status === 'overdue' || inv.status === 'cancelled'

                                    return (
                                        <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-white uppercase">
                                                INV-{inv.id?.slice(0, 8) || 'N/A'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{inv.customers?.name || 'Unknown Customer'}</div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    {inv.subscriptions?.plans?.name || 'Direct Billing Charge'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(Number(inv.amount_due || 0))}
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                                                {formatDate(inv.due_date)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                                    inv.status === 'paid'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                        : inv.status === 'sent' || inv.status === 'confirmed'
                                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                                            : inv.status === 'draft'
                                                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                                        inv.status === 'paid' ? 'bg-emerald-500' : inv.status === 'draft' ? 'bg-amber-500' : 'bg-indigo-500'
                                                    }`}></span>
                                                    {inv.status ? inv.status.toUpperCase() : 'DRAFT'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {inv.status === 'draft' && (
                                                        <form action={confirmInvoice.bind(null, inv.id)}>
                                                            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-300 dark:border-slate-700 font-semibold">
                                                                Confirm
                                                            </Button>
                                                        </form>
                                                    )}
                                                    {(inv.status === 'confirmed' || inv.status === 'sent') && (
                                                        <form action={markInvoicePaid.bind(null, inv.id)}>
                                                            <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                                                                Mark Paid
                                                            </Button>
                                                        </form>
                                                    )}
                                                    <Link href={`/admin/invoices/${inv.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:text-slate-400" title="View Details">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <SendInvoiceButton invoiceId={inv.id} customerEmail={inv.customers?.email} />
                                                    {inv.status !== 'cancelled' && inv.status !== 'paid' && (
                                                        <form action={async () => {
                                                            'use server'
                                                            await cancelInvoice(inv.id)
                                                        }}>
                                                            <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50 h-7 w-7 dark:hover:bg-rose-950/40" title="Cancel Invoice">
                                                                <XCircle className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </form>
                                                    )}
                                                    <PrintInvoiceButton invoiceId={inv.id} />
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
