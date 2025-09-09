"use client"

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Card from '@/components/ui/card/Card';
import { CardContent } from '@/components/ui/card/card-children';
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
            setJoinUrl(`${window.location.origin}${LANGUAGE_ROUTE(lang, JOIN_GAME_ROUTE(joinCode))}asdadasdasdad`);
        }
    }, [lang, joinCode]);  

  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-2">
      {/* Join code */}
      <div className='col-span-1'>
        <CopyTextCard text={splitStringInMiddle(joinCode)} label='Join Code' txt="primary" bg="primary">

        </CopyTextCard>
      </div>

      {/* Join Url */}
      <div className='flex items-center'>
        <CopyTextCard text={joinUrl} label='Join URL'>

        </CopyTextCard>          
      </div>      
    </div>
  );
}