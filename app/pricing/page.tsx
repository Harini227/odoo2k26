import { createClient } from "@/utils/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PricingView } from "./pricing-view"

export const dynamic = 'force-dynamic'

export default async function PricingPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const { upgrade } = await searchParams

    // Fetch public plans
    let { data: plans } = await supabase
        .from('plans')
        .select('*, products(name, description)')
        .eq('active', true)
        .eq('visibility', 'public')
        .order('amount', { ascending: true })

    // If upgrading, filter out trial plans (plans with 'trial' in name or 0 amount or specific logic)
    if (upgrade === 'true' && plans) {
        plans = plans.filter((p: any) =>
            !p.name.toLowerCase().includes('trial') &&
            p.amount > 0 &&
            p.trial_period_days === 0 // Ensure no trial period
        )
    }

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 py-16 md:py-24 bg-slate-50 dark:bg-slate-950">
                <div className="container px-4 md:px-6 mx-auto">
                    <PricingView plans={plans || []} user={user} />
                </div>
            </main>
            <Footer />
        </div>
    )
}
