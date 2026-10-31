'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export function AdminMobileHeader({ children }: { children: React.ReactNode }) {
    return (
        <header className="flex h-16 items-center gap-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 lg:px-6 md:hidden sticky top-0 z-50 dark:border-slate-800/80 dark:bg-slate-950/80">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-[280px] bg-slate-50 dark:bg-slate-950">
                    {children}
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex items-center">
                <Logo size="sm" subtitle="Workspace" />
            </div>
        </header>
    )
}
