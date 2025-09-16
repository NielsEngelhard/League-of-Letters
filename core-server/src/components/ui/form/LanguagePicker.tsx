"use client"

import { useState, useRef, useEffect } from "react"
import { GetLanguageStyle } from "@/features/language/LanguageStyles"
import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages"

interface LanguagePickerProps {
    currentLanguage: SupportedLanguage
    onLanguageChange: (language: SupportedLanguage) => void
    showLabel?: boolean
    className?: string
}

export default function LanguagePicker({ 
    currentLanguage, 
    onLanguageChange, 
    showLabel = true,
    className = "" 
}: LanguagePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
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
                type="button"
                className={`flex flex-row items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-primary/10 w-full text-left ${
                    isCurrentLanguage ? 'bg-primary/20 font-bold' : ''
                }`}
                onClick={() => handleLanguageSelect(language)}
            >
                <span className="text-lg">{languageStyles?.flag}</span>
                <span>{languageStyles?.shortName}</span>
            </button>
        )
    } 

    function handleLanguageSelect(language: SupportedLanguage) {
        setIsOpen(false);
        onLanguageChange(language);
    }

    const currentLanguageStyles = GetLanguageStyle(currentLanguage)

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Current Language Button */}
            <button
                type="button"
                className="flex flex-row items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-primary/10 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-lg">{currentLanguageStyles?.flag}</span>
                {showLabel && (
                    <span className="hidden md:flex">{currentLanguageStyles?.shortName}</span>
                )}
                <svg 
                    className={`w-4 h-4 transition-transform ${showLabel ? 'hidden md:flex' : 'flex'} ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-background border-border rounded-md shadow-lg z-50 py-1">
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