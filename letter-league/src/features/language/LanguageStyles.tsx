import { NL, GB, DE, FR } from "country-flag-icons/react/3x2";
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
        case "de":
            return {
                shortName: "de",
                fullName: "Deutsch",
                flag: <DE title="Deutsch" className={flagClasses} />,
                uniqueWords: "671.023"
            }     
        case "fr":
            return {
                shortName: "fr",
                fullName: "Français",
                flag: <FR title="Français" className={flagClasses} />,
                uniqueWords: "671.023"
            }                                    
    }
}