"use client"

import { useRouter, usePathname } from "next/navigation"
import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages"
import UpdateCurrentUserLanguage from "@/features/account/actions/command/update-current-user-language"
import { useToaster } from "@/components/general/toaster/ToasterContext"
import LanguagePicker from "@/components/ui/form/LanguagePicker"

interface Props {
    currentLanguage: SupportedLanguage
}

export default function HeaderLanguagePicker({ currentLanguage }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const toaster = useToaster();

    async function onLanguageChange(newLanguage: SupportedLanguage) {
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

    return (
        <LanguagePicker
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
        />
    )
}