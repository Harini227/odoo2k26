'use server'

import { assertAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'

export async function createTax(formData: FormData) {
    const { supabase } = await assertAdmin()
    const name = formData.get('name') as string
    const rate = Number(formData.get('rate'))
    const active = formData.get('active') === 'on'

    // Map 'rate' from form to 'percentage' column as well to satisfy DB constraints
    const { error } = await supabase.from('taxes').insert({
        name,
        rate,
        percentage: rate,
        active
    })
    if (error) return { error: error.message }
    revalidatePath('/admin/taxes')
    return { success: true }
}

export async function getTaxes() {
    const { supabase } = await assertAdmin()
    const { data, error } = await supabase.from('taxes').select('*').order('created_at', { ascending: false })
    if (error) {
        console.error('Error fetching taxes:', error)
        return []
    }
    return data || []
}

export async function toggleTaxStatus(id: string, active: boolean) {
    const { supabase } = await assertAdmin()
    await supabase.from('taxes').update({ active }).eq('id', id)
    revalidatePath('/admin/taxes')
}
