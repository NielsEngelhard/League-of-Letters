import { NL, GB } from "country-flag-icons/react/3x2";
import { SupportedLanguage } from "../i18n/languages";

interface LanguageData {
    shortName: string;
    fullName: string;
    uniqueWords: string;
    flag: React.ReactNode;
}

const flagClasses: string = "w-6 h-6 rounded-lg";

export function GetLanguageStyle(language?: SupportedLanguage): LanguageData | null {    
    if (!language) return null;

    switch(language) {
        case "nl":
            return {
                shortName: "nl",
                fullName: "Netherlands",
                flag: <NL title="Netherlands" className={flagClasses} />,
                uniqueWords: "413.937"
            }
        case "en":
            return {
                shortName: "en",
                fullName: "English",
                flag: <GB title="English" className={flagClasses} />,
                uniqueWords: "671.023"
            }            
    }
}