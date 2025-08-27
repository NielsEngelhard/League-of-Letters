import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages";
import Card from "../ui/card/Card";
import { CardContent } from "../ui/card/card-children";
import { GetLanguageStyle } from "@/features/language/LanguageStyles";

export default function WordCountPerLanguageBlock() {
    function LanguageCard(language: SupportedLanguage) {
        const languageData = GetLanguageStyle(language);
        
        return (
            <Card 
                key={language}
                className=""
            >
                <CardContent>
                    <div className="pt-4 space-y-4 text-center">
                        <div className="flex items-center gap-3 w-full text-center justify-center">
                            {languageData?.flag}
                        </div>

                        <div className="space-y-2 text-center">
                            <div className="text-2xl text-primary font-bold">
                                {languageData?.uniqueWords}
                            </div>
                            <div className="text-sm font-semibold text-foreground-muted tracking-wide uppercase">
                                Unique Words
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>            
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="space-y-12">
                <div className="text-center space-y-4">
                    {/* <h2 className="text-4xl font-bold text-primary">
                        Word Arsenal
                    </h2> */}
                    <p className="text-xl text-foreground-muted font-medium">
                        Hundreds of thousands of words across 
                        <span className="text-success font-bold"> multiple languages</span>
                    </p>
                </div>

                {/* Card grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {supportedLanguages.map((language) => (                        
                        LanguageCard(language)
                    ))}                        
                </div>
            </div>
        </div>        
    )
}