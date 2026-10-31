
'use client'

import { motion } from "framer-motion"
import { BarChart3, ShieldCheck, RefreshCw, Zap, Users, Globe } from "lucide-react"

const features = [
    {
        icon: RefreshCw,
        title: "Automated Recurring Billing",
        desc: "Schedule and execute multi-frequency invoicing and automated collections with zero manual intervention.",
        badge: "Core Engine"
    },
    {
        icon: BarChart3,
        title: "Real-time Financial Analytics",
        desc: "Track MRR, ARR, churn cohorts, and cash settlement rates with live accounting dashboards.",
        badge: "Intelligence"
    },
    {
        icon: ShieldCheck,
        title: "Enterprise Role Security",
        desc: "Segment customer access from operational staff and finance controllers with strict role-based controls.",
        badge: "Compliance"
    },
    {
        icon: Zap,
        title: "Rapid Quote-to-Cash",
        desc: "Convert accepted sales quotations into active subscriptions and live billing cycles in one click.",
        badge: "Speed"
    },
    {
        icon: Users,
        title: "Customer Self-Service",
        desc: "Provide customers a dedicated portal to view invoices, download receipts, and manage active plans.",
        badge: "Portal"
    },
    {
        icon: Globe,
        title: "Multi-Currency & Tax Engine",
        desc: "Automate dynamic tax rates, regional percentages, and localized currency invoicing seamlessly.",
        badge: "Global"
    }
]

export function FeaturesGrid() {
    return (
        <section id="features" className="container mx-auto max-w-6xl space-y-12 py-16 md:py-24 px-4 sm:px-6">
            <div className="mx-auto flex max-w-2xl flex-col items-center space-y-3 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                    Comprehensive Capabilities
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Built for Scale. Engineered for Trust.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                    Everything finance, sales, and operations teams require to orchestrate modern recurring revenue.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{
                            y: -4,
                            transition: { duration: 0.15 }
                        }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-500/40 group"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 ring-1 ring-slate-200/60 dark:ring-slate-700/60 group-hover:ring-emerald-500/30">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100/70 dark:bg-slate-800/70 px-2 py-0.5 rounded-md">
                                    {feature.badge}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-200">
                            Enterprise feature &rarr;
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
