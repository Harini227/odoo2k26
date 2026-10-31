
'use server'

import { assertAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import { sendInvoiceEmail } from '@/lib/email'

export async function markInvoicePaid(id: string) {
    const { supabase } = await assertAdmin()

    // 1. Fetch the invoice to determine outstanding balance and customer
    const { data: inv, error: invFetchError } = await supabase
        .from('invoices')
        .select('id, customer_id, amount_due, amount_paid, status')
        .eq('id', id)
        .single()

    if (invFetchError || !inv) {
        throw new Error('Invoice not found: ' + (invFetchError?.message || id))
    }

    const totalDue = Number(inv.amount_due || 0)
    const currentPaid = Number(inv.amount_paid || 0)
    const outstandingBalance = Math.max(0, totalDue - currentPaid)

    // 2. If there is an outstanding balance, atomically insert a settled payment record
    if (outstandingBalance > 0) {
        const { error: pError } = await supabase.from('payments').insert({
            invoice_id: id,
            customer_id: inv.customer_id,
            amount: outstandingBalance,
            payment_method: 'bank_transfer',
            payment_date: new Date().toISOString().split('T')[0],
            transaction_id: `ADMIN_SETTLED_${Date.now()}`,
            status: 'posted'
        })

        if (pError) {
            console.error('Failed to create payment record in markInvoicePaid:', pError)
            throw new Error('Payment settlement record creation failed: ' + pError.message)
        }
    }

    // 3. Mark invoice as paid with full amount_paid
    const { error: updateError } = await supabase.from('invoices').update({
        status: 'paid',
        amount_paid: totalDue,
        paid_at: new Date().toISOString()
    }).eq('id', id)

    if (updateError) {
        console.error('Failed to update invoice in markInvoicePaid:', updateError)
        throw new Error('Invoice update failed: ' + updateError.message)
    }

    revalidatePath(`/admin/invoices/${id}`)
    revalidatePath('/admin/invoices')
}

export async function confirmInvoice(id: string) {
    const { supabase } = await assertAdmin()
    const { error } = await supabase.from('invoices').update({ status: 'confirmed' }).eq('id', id)
    if (error) {
        console.error('Error confirming invoice:', error)
        throw new Error('Could not confirm invoice: ' + error.message)
    }
    revalidatePath('/admin/invoices')
}

export async function sendInvoiceManually(invoiceId: string) {
    const { supabase } = await assertAdmin()

    // Fetch complete invoice data with customer and subscription details
    const { data: invoice } = await supabase
        .from('invoices')
        .select(`
            *,
            customers (name, email),
            subscriptions (
                quantity,
                plans (name, amount)
            )
        `)
        .eq('id', invoiceId)
        .single()

    if (!invoice || !invoice.customers?.email) {
        return { success: false, error: 'Invoice or customer email not found' }
    }

    // Calculate breakdown
    const quantity = invoice.subscriptions?.quantity || 1
    const planAmount = Number(invoice.subscriptions?.plans?.amount || 0)
    const subtotal = planAmount * quantity
    const total = Number(invoice.amount_due)
    const tax = total - subtotal

    try {
        const result = await sendInvoiceEmail({
            customerName: invoice.customers.name,
            customerEmail: invoice.customers.email,
            invoiceId: invoice.id,
            invoiceNumber: invoice.id.slice(0, 8).toUpperCase(),
            amount: total,
            dueDate: invoice.due_date,
            planName: invoice.subscriptions?.plans?.name || 'Service',
            quantity: quantity,
            subtotal: subtotal,
            tax: tax,
            total: total,
        })

        if (result.success) {
            // Update invoice status to 'sent' if it was 'draft'
            if (invoice.status === 'draft') {
                await supabase
                    .from('invoices')
                    .update({ status: 'sent' })
                    .eq('id', invoiceId)
            }

            revalidatePath(`/admin/invoices/${invoiceId}`)
            revalidatePath('/admin/invoices')
        }

        return result
    } catch (error) {
        console.error('Error sending invoice email:', error)
        return { success: false, error: String(error) }
    }
}

export async function cancelInvoice(id: string) {
    const { supabase } = await assertAdmin()
    const { error } = await supabase.from('invoices').update({ status: 'cancelled' }).eq('id', id)
    if (error) {
        console.error('Cancel invoice error:', error)
        return { error: error.message }
    }
    revalidatePath(`/admin/invoices/${id}`)
    revalidatePath('/admin/invoices')
    return { success: true }
}

export async function recordPayment(invoiceId: string, formData: FormData) {
    const { supabase } = await assertAdmin()
    const method = formData.get('method') as string
    const amount = Number(formData.get('amount'))
    const transactionId = formData.get('transaction_id') as string

    if (isNaN(amount) || amount <= 0) {
        return { error: 'A positive payment amount is required.' }
    }

    // 1. Get current invoice
    const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

    if (invError || !invoice) {
        return { error: 'Invoice not found: ' + (invError?.message || invoiceId) }
    }

    // 2. Insert payment record
    const { error: pError } = await supabase.from('payments').insert({
        invoice_id: invoiceId,
        customer_id: invoice.customer_id,
        amount: amount,
        payment_method: method || 'bank_transfer',
        transaction_id: transactionId || `TXN_${Date.now()}`,
        status: 'posted',
        payment_date: new Date().toISOString().split('T')[0]
    })

    if (pError) {
        console.error('Record payment error:', pError)
        return { error: pError.message }
    }

    // 3. Re-calculate total settled payments for this invoice
    const { data: allPayments, error: sumError } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('invoice_id', invoiceId)

    if (sumError) {
        console.error('Error fetching payments for reconciliation:', sumError)
        return { error: sumError.message }
    }

    const settledPayments = (allPayments || [])
        .filter(p => p.status === 'posted' || p.status === 'reconciled')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0)

    const targetAmount = Number(invoice.amount_due || 0)
    const isFullyPaid = settledPayments >= targetAmount

    // 4. Set status to 'paid' ONLY when settled payments >= target invoice amount
    const newStatus = isFullyPaid ? 'paid' : (settledPayments > 0 ? 'partial' : 'unpaid')

    const { error: updateError } = await supabase.from('invoices').update({
        amount_paid: settledPayments,
        status: newStatus,
        paid_at: isFullyPaid ? (invoice.paid_at || new Date().toISOString()) : null
    }).eq('id', invoiceId)

    if (updateError) {
        console.error('Error updating invoice status after payment:', updateError)
        return { error: updateError.message }
    }

    revalidatePath(`/admin/invoices/${invoiceId}`)
    revalidatePath('/admin/invoices')
    return { success: true }
}
