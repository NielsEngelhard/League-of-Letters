import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "./card-children";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    Icon: React.ElementType;
    title: string;
    description?: string;
    children: React.ReactNode;
    t: GeneralTranslations;
}

export default function ExpandableCardContent({ Icon, title, children, description, t}: Props) {
    const [expand, setExpand] = useState<boolean>(false);

    return (
        <>
            <CardHeader>
                <CardTitle className="text-base sm:text-lg flex justify-between cursor-pointer" onClick={() => setExpand(prev => !prev)}>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {title}                        
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-foreground-muted">
                        {expand ? t.settings.minimize : t.settings.maximize}
                        {expand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>                    
                </CardTitle>
                {expand == false && <span className="text-sm text-foreground-muted">{description}</span>}
            </CardHeader>
            {expand == true && (
                <CardContent className="space-y-8">
                    {children}
                </CardContent>                
            )}
        </>
    )
}