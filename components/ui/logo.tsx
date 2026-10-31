import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface LogoProps {
    /**
     * Size variant of the logo mark and typography
     * @default "md"
     */
    size?: "sm" | "md" | "lg" | "xl"
    /**
     * Render only the 'S' monogram icon badge without the wordmark
     * @default false
     */
    iconOnly?: boolean
    /**
     * Optional custom subtitle below the wordmark
     */
    subtitle?: string | null
    /**
     * Optional destination URL if wrapped in a link. Pass null or empty string to disable link wrapping.
     * @default "/"
     */
    href?: string | null
    /**
     * Additional CSS classes applied to root container
     */
    className?: string
    /**
     * Invert colors for dark background panels (e.g. auth side banners)
     */
    inverted?: boolean
}

const sizeConfig = {
    sm: {
        badge: "h-7 w-7 rounded-lg",
        icon: "h-3.5 w-3.5",
        text: "text-sm",
        subtitle: "text-[9px]",
        gap: "gap-2",
    },
    md: {
        badge: "h-9 w-9 rounded-xl",
        icon: "h-4.5 w-4.5",
        text: "text-base",
        subtitle: "text-[10px]",
        gap: "gap-2.5",
    },
    lg: {
        badge: "h-11 w-11 rounded-2xl",
        icon: "h-5.5 w-5.5",
        text: "text-xl",
        subtitle: "text-xs",
        gap: "gap-3",
    },
    xl: {
        badge: "h-14 w-14 rounded-2xl",
        icon: "h-7 w-7",
        text: "text-2xl",
        subtitle: "text-xs",
        gap: "gap-3.5",
    },
}

export function Logo({
    size = "md",
    iconOnly = false,
    subtitle,
    href = "/",
    className,
    inverted = false,
}: LogoProps) {
    const config = sizeConfig[size] || sizeConfig.md

    const logoContent = (
        <div className={cn("inline-flex items-center group select-none", config.gap, className)}>
            {/* 'S' Monogram Badge */}
            <div
                className={cn(
                    "relative flex items-center justify-center shrink-0",
                    "bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900",
                    "border border-emerald-500/25 shadow-md shadow-indigo-500/10",
                    "transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/50 group-hover:shadow-indigo-500/20",
                    config.badge
                )}
            >
                {/* Subtle top-left highlight */}
                <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                {/* Geometric Interlocking 'S' SVG Mark */}
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(config.icon, "relative z-10 transition-transform duration-300 group-hover:scale-105")}
                    aria-hidden="true"
                >
                    <defs>
                        {/* Upper Loop Gradient */}
                        <linearGradient id="subscale-upper-grad" x1="8" y1="6" x2="26" y2="18" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#818CF8" />
                        </linearGradient>

                        {/* Lower Loop Gradient with Emerald Flare */}
                        <linearGradient id="subscale-lower-grad" x1="10" y1="14" x2="26" y2="28" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="60%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>

                        {/* Center Connection Glow */}
                        <linearGradient id="subscale-node-glow" x1="12" y1="12" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>

                    {/* Upper Interlocking Ribbon Loop */}
                    <path
                        d="M24 9.5C24 7.57 22.43 6 20.5 6H13C9.69 6 7 8.69 7 12C7 15.31 9.69 18 13 18H19C20.66 18 22 19.34 22 21"
                        stroke="url(#subscale-upper-grad)"
                        strokeWidth="3.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Lower Interlocking Ribbon Loop */}
                    <path
                        d="M10 11C10 12.66 11.34 14 13 14H19C22.31 14 25 16.69 25 20C25 23.31 22.31 26 19 26H11.5C9.57 26 8 24.43 8 22.5"
                        stroke="url(#subscale-lower-grad)"
                        strokeWidth="3.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Central Energy Spark Node */}
                    <circle cx="16" cy="16" r="1.5" fill="#34D399" className="animate-pulse" />
                </svg>
            </div>

            {/* Wordmark Typography */}
            {!iconOnly && (
                <div className="flex flex-col leading-none">
                    <div className={cn("font-bold tracking-tight flex items-baseline", config.text)}>
                        <span className={cn(inverted ? "text-white" : "text-slate-900 dark:text-white")}>
                            Sub
                        </span>
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent font-extrabold">
                            scale
                        </span>
                    </div>
                    {subtitle !== null && (
                        <span
                            className={cn(
                                "font-semibold uppercase tracking-wider mt-0.5",
                                config.subtitle,
                                inverted ? "text-indigo-200/90" : "text-indigo-600 dark:text-indigo-400"
                            )}
                        >
                            {subtitle || "Revenue Engine"}
                        </span>
                    )}
                </div>
            )}
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
                {logoContent}
            </Link>
        )
    }

    return logoContent
}

export default Logo
