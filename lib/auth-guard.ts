import { createClient } from '@/utils/supabase/server'

export interface AuthUser {
    id: string
    email?: string
    role: 'admin' | 'internal' | 'customer'
}

/**
 * Validates that the current request has an active session and the user has 'admin' privileges.
 * Throws an explicit Error if unauthenticated or role !== 'admin'.
 * Returns the authenticated user record and supabase client for convenience.
 */
export async function assertAdmin(): Promise<{ user: AuthUser; supabase: Awaited<ReturnType<typeof createClient>> }> {
    const supabase = await createClient()

    const {
        data: { user: authUser },
        error: authError
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
        throw new Error('Unauthorized: Authentication required.')
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', authUser.id)
        .single()

    if (profileError || !profile || profile.role !== 'admin') {
        throw new Error('Forbidden: Admin privileges required.')
    }

    return {
        user: {
            id: authUser.id,
            email: authUser.email,
            role: profile.role as 'admin'
        },
        supabase
    }
}

/**
 * Validates that the current request has an active session and the user has either 'admin' or 'internal' privileges.
 * Throws an explicit Error if unauthenticated or unauthorized.
 */
export async function assertInternalOrAdmin(): Promise<{ user: AuthUser; supabase: Awaited<ReturnType<typeof createClient>> }> {
    const supabase = await createClient()

    const {
        data: { user: authUser },
        error: authError
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
        throw new Error('Unauthorized: Authentication required.')
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', authUser.id)
        .single()

    if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'internal')) {
        throw new Error('Forbidden: Internal or Admin privileges required.')
    }

    return {
        user: {
            id: authUser.id,
            email: authUser.email,
            role: profile.role as 'admin' | 'internal'
        },
        supabase
    }
}
