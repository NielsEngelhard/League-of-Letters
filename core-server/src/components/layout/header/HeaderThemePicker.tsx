"use client"

import { useToaster } from "@/components/general/toaster/ToasterContext";
import { ThemeOption } from "@/features/account/account-models";
import UpdateCurrentUserTheme from "@/features/account/actions/command/update-current-user-theme";
import { useAuth } from "@/features/auth/AuthContext";
import { useState, useEffect, useRef } from "react"

const themes = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "ultradark", label: "Ultra Dark", icon: "🖤" },
    { value: "candy", label: "Candy", icon: "🍭" },
    { value: "hackerman", label: "Hacker", icon: "💚" },
];

export default function HeaderThemePicker() {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, setSettingsOnClient } = useAuth();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [pendingTheme, setPendingTheme] = useState<ThemeOption | null>(null);
    const toaster = useToaster();

    const waitingTimeForServerUpdate = 6000;

    const selectedTheme = themes.find(theme => theme.value === settings.theme)

    // Debounced server update effect, when user is spamming themes, send a request when they are done instead of everytime they switch
    useEffect(() => {
        if (pendingTheme === null) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for server update
        timeoutRef.current = setTimeout(async () => {
            try {
                // Replace this with your actual server update logic
                await updateThemeOnServer(pendingTheme);
            } catch {
                toaster.errorToast("Theme update error");
            } finally {
                setPendingTheme(null);
            }
        }, waitingTimeForServerUpdate);

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [pendingTheme]);

    async function updateThemeOnServer(newTheme: ThemeOption) {
        await UpdateCurrentUserTheme(newTheme);        
    }

    async function onThemeChange(newTheme: ThemeOption) {
        // Update client immediately
        settings.theme = newTheme;
        setSettingsOnClient(settings);
        
        // Set pending theme for debounced server update
        setPendingTheme(newTheme);
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground bg-muted/30 hover:bg-muted/50 rounded-md transition-all duration-200 border border-border/30 hover:border-border/50"
            >
                <span>{selectedTheme?.icon}</span>
                <span className="tracking-wide hidden md:flex">{selectedTheme?.label}</span>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-background border border-border/50 rounded-md shadow-lg backdrop-blur-sm z-50">
                    <div className="py-1">
                        {themes.map((theme) => (
                            <button
                                key={theme.value}
                                onClick={() => {
                                    onThemeChange(theme.value as ThemeOption)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-left transition-all duration-150 hover:bg-muted/50 ${
                                    settings.theme === theme.value
                                        ? 'text-foreground bg-muted/30'
                                        : 'text-foreground/70 hover:text-foreground'
                                }`}
                            >
                                <span className="text-xs opacity-70">{theme.icon}</span>
                                <div className="items-center gap-2 flex-1 flex">
                                    <span className="tracking-wide">{theme.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}