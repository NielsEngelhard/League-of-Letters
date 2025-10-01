"use client";

import Link from "next/link";
import { HeaderNavigationItem } from "./Header";

interface Props {
    mainNavItems: HeaderNavigationItem[];
    subNavItems: HeaderNavigationItem[];
}

export default function DesktopSubHeader({mainNavItems, subNavItems}: Props) {
    return (
        <>
            <div className="w-full flex flex-row justify-between my-2">
                {/* Left (main) - Hidden on mobile */}
                <div className="hidden md:flex flex-row gap-6">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group relative flex items-center gap-1 text-sm font-medium text-foreground-muted hover:text-foreground tracking-tight"
                        >
                            <span className="text-sm opacity-80 group-hover:opacity-80 transition-opacity">
                                {item.icon}
                            </span>
                            {item.label}

                            {/* Active/hover indicator */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300 ease-out" />                        
                        </Link>
                    ))}
                </div>

                {/* Right (secondary) - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-3">
                    {subNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group relative rounded-md text-xs font-medium text-foreground/50 hover:text-foreground/80 transition-all duration-200 hover:bg-background-secondary/30 tracking-tight"
                        >
                            {item.label}
                            
                            {/* Active/hover indicator */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300 ease-out" />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}