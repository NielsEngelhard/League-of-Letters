"use client";

import Link from "next/link";
import { HeaderNavigationItem } from "./Header";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    mainNavItems: HeaderNavigationItem[];
    subNavItems: HeaderNavigationItem[];
}

export default function MobileSubHeader({mainNavItems, subNavItems}: Props) {
    const [show, setShow] = useState(false);
    const router = useRouter();

    function onNavItemClicked(href: string) {
        setShow(false);
        router.push(href);
    }

    return (
        <>
            <div className="flex md:hidden">
                <button className="flex items-center text-foreground" type="button" onClick={() => setShow(prev => !prev)}>
                    <Menu size={26} />
                </button>
            </div>          
        
            <div 
                className={`fixed left-0 top-[52px] w-full flex flex-col py-4 px-6 bg-background-secondary border-t border-border shadow-sm border-b-2 transition-all duration-300 ease-in-out ${
                    show 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                {/* mainNavItems */}
                <ul className="flex flex-col">
                    {mainNavItems.map((navItem, index) => (
                        <li key={index}>
                            <button
                                onClick={() => onNavItemClicked(navItem.href)}
                                className="flex items-center gap-3 py-3 text-foreground"
                            >
                                <span className="text-lg">{navItem.icon}</span>
                                <span className="font-medium">{navItem.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Subtle divider */}
                <div className="h-px bg-background my-2"></div>

                {/* subNavItems */}
                <ul className="flex flex-col">
                    {subNavItems.map((navItem, index) => (
                        <li key={index}>
                            <button 
                                onClick={() => onNavItemClicked(navItem.href)}
                                className="flex items-center gap-3 py-3 text-sm text-foreground-muted"
                            >
                                <span className="text-base">{navItem.icon}</span>
                                <span>{navItem.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>            
            </div>

        </>
    )
}