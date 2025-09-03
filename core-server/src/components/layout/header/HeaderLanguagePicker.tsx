"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { GetLanguageStyle } from "@/features/language/LanguageStyles"
import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages"


export default function HeaderLanguagePicker() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en")
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()
    
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

    // Extract current language from pathname on mount
    useEffect(() => {
        const pathSegments = pathname.split('/')
        const langFromPath = pathSegments[1] as SupportedLanguage
        if (supportedLanguages.includes(langFromPath)) {
            setCurrentLanguage(langFromPath)
        }
    }, [pathname])

    function getLanguageSection(language: SupportedLanguage, isCurrentLanguage = false) {
        const languageStyles = GetLanguageStyle(language)
        return (
            <button 
                className={`flex flex-row items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 w-full text-left ${
                    isCurrentLanguage ? 'bg-gray-50 font-medium' : ''
                }`}
                onClick={() => onLanguageChange(language)}
            >
                <span className="text-lg">{languageStyles?.flag}</span>
                <span>{languageStyles?.shortName}</span>
            </button>
        )
    } 

    function onLanguageChange(newLanguage: SupportedLanguage) {
        setCurrentLanguage(newLanguage)
        setIsOpen(false)
        
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
                className="flex flex-row items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-lg">{currentLanguageStyles?.flag}</span>
                <span>{currentLanguageStyles?.shortName}</span>
                <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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