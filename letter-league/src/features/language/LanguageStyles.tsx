import { NL } from "country-flag-icons/react/3x2";
import { SupportedLanguage } from "../i18n/languages";

interface LanguageData {
    shortName: string;
    fullName: string;
    flag: React.ReactNode;
}

export function GetLanguageStyle(language: SupportedLanguage): LanguageData {
    switch(language) {
        case "nl":
            return {
                shortName: "nl",
                fullName: "Netherlands",
                flag: <NL title="Netherlands" className="w-8 h-6" />
            }
    }
}