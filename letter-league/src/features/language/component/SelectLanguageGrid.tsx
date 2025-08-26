import Card from "@/components/ui/card/Card";
import { supportedLanguages } from "@/features/i18n/languages";

const languageOptions = supportedLanguages.map((language) => {
    return {
        value: language,
        label: language
    }
});

export default function SelectLanguageGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3">
            {languageOptions.map((languageOption) => {
                return (
                    <Card className="">
                        <div>{languageOption.label}</div>
                    </Card>                    
                )
            })}
        </div>
    )
}