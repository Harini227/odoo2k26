
import Sidebar from "@/components/sidebar"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

import { AdminMobileHeader } from "@/components/admin-mobile-header"

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/auth/login")
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[230px_1fr] lg:grid-cols-[280px_1fr] bg-slate-50/70 dark:bg-slate-950">
            <Sidebar role="customer" />
            <div className="flex flex-col min-w-0">
                <AdminMobileHeader>
                    <Sidebar role="customer" className="block w-full border-none" />
                </AdminMobileHeader>
                <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
