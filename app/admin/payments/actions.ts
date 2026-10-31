'use server'

import { assertAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'

export async function createPayment(formData: FormData) {
    const { supabase } = await assertAdmin()

    const invoiceId = formData.get('invoice_id') as string
    const customerId = formData.get('customer_id') as string
    const amount = Number(formData.get('amount'))
    const method = formData.get('payment_method') as string
    const date = formData.get('payment_date') as string
    const transactionId = formData.get('transaction_id') as string

    if (isNaN(amount) || amount <= 0) {
        return { error: 'Please enter a valid payment amount.' }
    }

    // 1. Insert Payment
    const { error: paymentError } = await supabase.from('payments').insert({
        invoice_id: invoiceId || null,
        customer_id: customerId,
        amount,
        payment_method: method || 'bank_transfer',
        payment_date: date || new Date().toISOString().split('T')[0],
        transaction_id: transactionId || `MANUAL_${Date.now()}`,
        status: 'posted'
    })

    if (paymentError) {
        console.error('Payment creation error:', paymentError)
        return { error: paymentError.message }
    }

    // 2. If linked to an invoice, perform accurate reconciliation
    if (invoiceId) {
        const { data: invoice, error: invFetchError } = await supabase
            .from('invoices')
            .select('amount_due, paid_at')
            .eq('id', invoiceId)
            .single()

        if (!invFetchError && invoice) {
            // Aggregate all posted/reconciled payments for this invoice
            const { data: allPayments, error: sumError } = await supabase
                .from('payments')
                .select('amount, status')
                .eq('invoice_id', invoiceId)

            if (!sumError && allPayments) {
                const totalSettled = allPayments
                    .filter(p => p.status === 'posted' || p.status === 'reconciled')
                    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

                const targetDue = Number(invoice.amount_due || 0)
                const isFullyPaid = totalSettled >= targetDue
                const newStatus = isFullyPaid ? 'paid' : (totalSettled > 0 ? 'partial' : 'unpaid')

                const { error: invUpdateError } = await supabase.from('invoices').update({
                    amount_paid: totalSettled,
                    status: newStatus,
                    paid_at: isFullyPaid ? (invoice.paid_at || new Date().toISOString()) : null
                }).eq('id', invoiceId)

                if (invUpdateError) {
                    console.error('Invoice reconciliation error:', invUpdateError)
                }
            }
        }
    }

    revalidatePath('/admin/payments')
    revalidatePath('/admin/invoices')
    return { success: true }
}

export async function getPayments() {
    const { supabase } = await assertAdmin()
    const { data: payments, error } = await supabase
        .from('payments')
        .select(`
            *,
            customers (name),
            invoices (invoice_number)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching payments:', error)
        return []
    }

    return payments || []
}
