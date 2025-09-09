"use client"

import { useEffect, useState } from 'react';
import CopyTextCard from '@/components/ui/card/CopyTextCard';
import { SupportedLanguage } from '@/features/i18n/languages';
import { JOIN_GAME_ROUTE, LANGUAGE_ROUTE } from '@/app/routes';
import { splitStringInMiddle } from '@/lib/string-util';

interface Props {
  joinCode: string;
  lang: SupportedLanguage;
}

export default function JoinCodeCard({ joinCode, lang }: Props) {
    const [joinUrl, setJoinUrl] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setJoinUrl(`${window.location.origin}${LANGUAGE_ROUTE(lang, JOIN_GAME_ROUTE(joinCode))}sasdadasdasdasdasdassad`);
        }
    }, [lang, joinCode]);

    return (
      <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
          {/* Join code */}
          <CopyTextCard text={splitStringInMiddle(joinCode)} label='Join Code' txt="primary" bg="primary" />
          
          {/* Join Url */}
          <CopyTextCard text={joinUrl} label='Join URL' />     
      </div>
    );
}