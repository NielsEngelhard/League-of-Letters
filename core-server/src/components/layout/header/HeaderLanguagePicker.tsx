"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { GetLanguageStyle } from "@/features/language/LanguageStyles"
import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages"
import UpdateCurrentUserLanguage from "@/features/account/actions/command/update-current-user-language"
import { useToaster } from "@/components/general/toaster/ToasterContext"

interface Props {
    currentLanguage: SupportedLanguage
}

export default function HeaderLanguagePicker({ currentLanguage }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const toaster = useToaster();
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])


    function getLanguageSection(language: SupportedLanguage, isCurrentLanguage = false) {
        const languageStyles = GetLanguageStyle(language)
        return (
            <button 
                className={`flex flex-row items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-primary/10 w-full text-left ${
                    isCurrentLanguage ? 'bg-primary/20 font-bold' : ''
                }`}
                onClick={() => onLanguageChange(language)}
            >
                <span className="text-lg">{languageStyles?.flag}</span>
                <span>{languageStyles?.shortName}</span>
            </button>
        )
    } 

    async function onLanguageChange(newLanguage: SupportedLanguage) {
        setIsOpen(false);
        changeLanguageInUrl(newLanguage);
        await changeLanguageForAccountOnServer(newLanguage);
    }

    async function changeLanguageForAccountOnServer(newLanguage: SupportedLanguage) {
        try {
            await UpdateCurrentUserLanguage({ language: newLanguage });
        } catch {
            toaster.errorToast("Error updating language");
        }
    }

    function changeLanguageInUrl(newLanguage: SupportedLanguage) {
        // Get current pathname and replace language segment
        const pathSegments = pathname.split('/')
        
        // If first segment after domain is a language, replace it
        if (supportedLanguages.includes(pathSegments[1] as SupportedLanguage)) {
            pathSegments[1] = newLanguage
        } else {
            // If no language in path, add it
            pathSegments.splice(1, 0, newLanguage)
        }
        
        const newPath = pathSegments.join('/')
        router.push(newPath)
    }

    const currentLanguageStyles = GetLanguageStyle(currentLanguage)

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Current Language Button */}
            <button
                className="flex flex-row items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-primary/10 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-lg">{currentLanguageStyles?.flag}</span>
                <span className="hidden md:flex">{currentLanguageStyles?.shortName}</span>
                <svg 
                    className={`w-4 h-4 transition-transform hidden md:flex ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                    {supportedLanguages.map((language) => (
                        <div key={language}>
                            {getLanguageSection(language, language === currentLanguage)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}