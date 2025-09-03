import { SupportedLanguage } from "@/features/i18n/languages";
import { GetLanguageStyle } from "../LanguageStyles";
import { Check } from "lucide-react";

interface Props {
    language: SupportedLanguage;
    onClick: () => void;
    isSelected?: boolean;
    disabled?: boolean;
}

export default function LanguageCard({ onClick, language, isSelected = false, disabled = false }: Props) {
    const languageStyle = GetLanguageStyle(language);
        
    return (
        <button 
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                group relative p-4 rounded-2xl border-2 transition-all duration-200
                ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' 
                    : 'border-border/30 hover:border-primary/50 hover:bg-background/50'
                }
                ${disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-md hover:-translate-y-0.5'
                }
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
            `}
        >
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-background" />
                </div>
            )}
            
            <div className="flex flex-col items-center gap-3">
                {/* Flag with subtle hover effect */}
                <div className={`
                    text-4xl transition-transform duration-200
                    ${!disabled && 'group-hover:scale-110'}
                `}>
                    {languageStyle?.flag}
                </div>
                
                {/* Language Name */}
                <div className="text-center">
                    <span className={`
                        font-semibold text-sm transition-colors duration-200
                        ${isSelected 
                            ? 'text-primary' 
                            : 'text-foreground/80 group-hover:text-foreground'
                        }
                    `}>
                        {languageStyle?.shortName}
                    </span>
                </div>
            </div>
        </button>
    );
}