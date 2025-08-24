"use client"

import { APP_NAME } from "@/app/global-constants";
import { HEALTH_CHECK_ROUTE, PICK_GAME_MODE_ROUTE, PRIVACY_POLICY_ROUTE, TERMS_OF_SERVICE_ROUTE } from "@/app/routes";
import Link from "next/link";

export default function Footer() {

    return (
        <footer className="w-full bg-background-secondary border-t-2 border-border mt-auto">
            <div className="max-w-4xl mx-auto px-2 md:px-0 py-6">
                {/* Main Footer Content */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left - Logo & Branding */}
                    <div className="flex items-center gap-3">
                        <Link 
                            href={PICK_GAME_MODE_ROUTE}
                            className="group flex items-center transition-all duration-200"
                        >
                            <div className="relative">
                                <img
                                    src="/logo.png"
                                    className="h-[28px] w-auto object-contain transition-all duration-200 group-hover:brightness-110"
                                    alt="Logo"
                                />
                                {/* Subtle glow effect on hover */}
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300 blur-sm" />
                            </div>
                        </Link>
                        <div className="text-sm text-foreground font-medium">
                            {APP_NAME}
                        </div>
                    </div>

                    {/* Right - Social & Status */}
                    <div className="flex items-center gap-3">
                        {/* Social Links */}
                        <div className="flex items-center gap-2">
                            <a 
                                href="https://github.com/NielsEngelhard/Letter-League" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/50 hover:bg-white transition-all duration-200 border border-gray-200 hover:border-gray-300 group"
                                aria-label="GitHub"
                            >
                                <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom - Copyright & Legal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 mt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        by Niels Engelhard
                    </div>
                    <div className="flex items-center gap-4">
                        <Link 
                            href={HEALTH_CHECK_ROUTE} 
                            className="text-xs text-foreground-muted transition-colors duration-200"
                        >
                            Health Check
                        </Link>                        
                        <Link 
                            href={PRIVACY_POLICY_ROUTE} 
                            className="text-xs text-foreground-muted transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <Link 
                            href={TERMS_OF_SERVICE_ROUTE}
                            className="text-xs text-foreground-muted transition-colors duration-200"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}