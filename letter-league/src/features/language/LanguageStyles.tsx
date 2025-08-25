import { NL, GB } from "country-flag-icons/react/3x2";
import { SupportedLanguage } from "../i18n/languages";

interface LanguageData {
    shortName: string;
    fullName: string;
    uniqueWords: string;
    flag: React.ReactNode;
}

export function GetLanguageStyle(language: SupportedLanguage): LanguageData {
    switch(language) {
        case "nl":
            return {
                shortName: "nl",
                fullName: "Netherlands",
                flag: <NL title="Netherlands" className="w-8 h-6" />,
                uniqueWords: "413.937"
            }
        case "en":
            return {
                shortName: "en",
                fullName: "English",
                flag: <GB title="English" className="w-8 h-6" />,
                uniqueWords: "671.023"
            }            
    }
}