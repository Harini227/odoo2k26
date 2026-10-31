
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/auth/actions"
import {
    Home,
    Package,
    ShoppingCart,
    Users,

    Settings,
    Wallet,
    LogOut,
    Zap,
    Briefcase,
    IndianRupee,
    FileText,
    Percent,
    Tag,
    BarChart3,
    Landmark,
    Receipt
} from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { NotificationButton } from "@/components/notification-button"

import { cn } from "@/lib/utils"

interface SidebarProps {
    role: 'admin' | 'customer'
    className?: string
}

export default async function Sidebar({ role, className }: SidebarProps) {
    const supabase = await createClient()
    let subCount = 0

    if (role === 'customer') {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
            const { data: customer } = await supabase.from('customers').select('id').eq('email', user.email).single()
            if (customer) {
                const { count } = await supabase
                    .from('subscriptions')
                    .select('*', { count: 'exact', head: true })
                    .eq('customer_id', customer.id)
                    .in('status', ['active', 'trialing', 'confirmed'])
                subCount = count || 0
            }
        }
    }

    return (
        <div className={cn("hidden border-r border-slate-200/80 bg-slate-50/60 backdrop-blur-md md:block w-[230px] lg:w-[280px] dark:border-slate-800/80 dark:bg-slate-950/70", className)}>
            <div className="flex h-full max-h-screen flex-col">
                <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-4 lg:px-6 dark:border-slate-800/80">
                    <Logo size="md" subtitle="Enterprise" />
                    <NotificationButton />
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="grid items-start gap-1 px-3 text-sm font-medium lg:px-4">
                        {role === 'admin' ? (
                            <>
                                <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Core Operations
                                </div>
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Home className="h-4 w-4 text-slate-500" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/subscriptions"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <ShoppingCart className="h-4 w-4 text-slate-500" />
                                    Subscriptions
                                </Link>
                                <Link
                                    href="/admin/products"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Package className="h-4 w-4 text-slate-500" />
                                    Products
                                </Link>
                                <Link
                                    href="/admin/plans"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Briefcase className="h-4 w-4 text-slate-500" />
                                    Plans
                                </Link>
                                <Link
                                    href="/admin/customers"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Users className="h-4 w-4 text-slate-500" />
                                    Customers
                                </Link>

                                <div className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Billing & Finance
                                </div>
                                <Link
                                    href="/admin/payments"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <IndianRupee className="h-4 w-4 text-slate-500" />
                                    Payments
                                </Link>
                                <Link
                                    href="/admin/quotations"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <FileText className="h-4 w-4 text-slate-500" />
                                    Quotations
                                </Link>
                                <Link
                                    href="/admin/invoices"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Receipt className="h-4 w-4 text-slate-500" />
                                    Invoices
                                </Link>
                                <Link
                                    href="/admin/taxes"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Percent className="h-4 w-4 text-slate-500" />
                                    Taxes
                                </Link>
                                <Link
                                    href="/admin/discounts"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Tag className="h-4 w-4 text-slate-500" />
                                    Discounts
                                </Link>

                                <div className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Analytics & System
                                </div>
                                <Link
                                    href="/admin/reports"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <BarChart3 className="h-4 w-4 text-slate-500" />
                                    Reports
                                </Link>
                                <Link
                                    href="/admin/users"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Users className="h-4 w-4 text-slate-500" />
                                    Internal Users
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Settings className="h-4 w-4 text-slate-500" />
                                    Settings
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Home className="h-4 w-4 text-slate-500" />
                                    Overview
                                </Link>
                                <Link
                                    href="/dashboard/subscriptions"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <ShoppingCart className="h-4 w-4 text-slate-500" />
                                    My Subscriptions
                                    {subCount > 0 && (
                                        <Badge variant="active" className="ml-auto flex h-5 min-w-5 px-1.5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
                                            {subCount}
                                        </Badge>
                                    )}
                                </Link>
                                <Link
                                    href="/dashboard/payments"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Landmark className="h-4 w-4 text-slate-500" />
                                    Payments
                                </Link>
                                <Link
                                    href="/dashboard/invoices"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                                >
                                    <Wallet className="h-4 w-4 text-slate-500" />
                                    Invoices
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
                    <form action={logout}>
                        <Button variant="outline" className="w-full justify-start gap-2 border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 transition-colors">
                            <LogOut className="h-4 w-4" /> Sign Out
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
