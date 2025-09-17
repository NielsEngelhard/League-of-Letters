"use client"

import { useEffect, useState } from 'react';
import CopyTextCard from '@/components/ui/card/CopyTextCard';
import { SupportedLanguage } from '@/features/i18n/languages';
import { JOIN_GAME_ROUTE, LANGUAGE_ROUTE } from '@/app/routes';
import { splitStringInMiddle } from '@/lib/string-util';
import BeforeGameTranslations from '@/features/i18n/translation-file-interfaces/BeforeGameTranslations';
import Card from '@/components/ui/card/Card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card/card-children';
import SubText from '@/components/ui/text/SubText';
import { Share2 } from 'lucide-react';

interface Props {
  joinCode: string;
  lang: SupportedLanguage;
  t: BeforeGameTranslations;
}

export default function ShareGameCard({ joinCode, lang, t }: Props) {
    const [joinUrl, setJoinUrl] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setJoinUrl(`${window.location.origin}${LANGUAGE_ROUTE(lang, JOIN_GAME_ROUTE(joinCode))}`);
        }
    }, [lang, joinCode]);

    return (
    <Card className="w-full" variant="fade">
        <CardHeader>
        <CardTitle>
            <Share2 />
            {t.lobby.join.share.title}
        </CardTitle>
        <SubText text={t.lobby.join.share.description} />    
        </CardHeader>
        <CardContent className='gap-4 flex flex-col'>
            {/* Join code */}
            <CopyTextCard
                text={splitStringInMiddle(joinCode)}
                label={t.lobby.join.joinCode.label}
                description={t.lobby.join.joinCode.description}
                txt="primary"
                bg="primary"
            />
            
            {/* Join Url */}
            <CopyTextCard
                text={joinUrl}
                label={t.lobby.join.joinUrl.label}
                description={t.lobby.join.joinUrl.description}
            />
        </CardContent>
    </Card>
    );
}