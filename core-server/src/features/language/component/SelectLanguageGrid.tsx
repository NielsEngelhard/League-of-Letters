/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages";
import LanguageCard from "./LanguageCard";
import { Controller, Control } from "react-hook-form";

interface Props {
    control?: Control<any>;
    name: string;
    value?: SupportedLanguage;
    onChange?: (language: SupportedLanguage) => void;
    disabled?: boolean;
}

export default function SelectLanguageGrid({ 
    control, 
    name, 
    value, 
    onChange, 
    disabled = false,
}: Props) {
    const languageOptions = supportedLanguages.map((language) => ({
        value: language,
        label: language
    }));

    const handleSelect = (language: SupportedLanguage, fieldOnChange?: (value: any) => void) => {
        if (disabled) return;
        
        if (fieldOnChange) {
            fieldOnChange(language);
        }
        if (onChange) {
            onChange(language);
        }
    };

    const GridContent = ({ selectedValue, onSelect }: { 
        selectedValue?: SupportedLanguage; 
        onSelect: (language: SupportedLanguage) => void;
    }) => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
            {languageOptions.map((languageOption) => (
                <LanguageCard 
                    key={languageOption.value}
                    language={languageOption.value} 
                    onClick={() => onSelect(languageOption.value)}
                    isSelected={selectedValue === languageOption.value}
                    disabled={disabled}
                />
            ))}
        </div>
    );

    // If using React Hook Form
    if (control) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <GridContent 
                        selectedValue={field.value}
                        onSelect={(language) => handleSelect(language, field.onChange)}
                    />
                )}
            />
        );
    }

    // Standalone usage
    return (
        <GridContent 
            selectedValue={value}
            onSelect={(language) => handleSelect(language)}
        />
    );
}