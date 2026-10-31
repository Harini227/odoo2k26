'use client'

import * as React from "react"
import Link from "next/link"
import { Zap, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/ui/logo"

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 transition-all duration-200">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-6 justify-between max-w-7xl">
                <div className="flex items-center gap-3">
                    <Logo size="md" subtitle="Enterprise Engine" />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors" href="/#features">
                        Platform Features
                    </Link>
                    <Link className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors" href="/pricing">
                        Pricing Plans
                    </Link>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        v3.0 Live
                    </span>
                </nav>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center space-x-3">
                    <Link href="/auth/login">
                        <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all duration-200">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Trigger */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="px-0 text-base text-slate-700 dark:text-slate-300 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
                        <div className="flex flex-col gap-6 py-6">
                            <div className="pb-2 border-b border-slate-100 dark:border-slate-800" onClick={() => setIsOpen(false)}>
                                <Logo size="md" subtitle="Enterprise Engine" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link href="#features" className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" onClick={() => setIsOpen(false)}>
                                    Platform Features
                                </Link>
                                <Link href="/pricing" className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" onClick={() => setIsOpen(false)}>
                                    Pricing Plans
                                </Link>
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />
                            <div className="flex flex-col gap-3">
                                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
