import React from 'react';
import { Lock } from 'lucide-react';
import { SupportedLanguage } from '@/features/i18n/languages';
import { loadTranslations } from '@/features/i18n/utils';
import AuthProceedButton from './AuthProceedButton';
import PageBase from './PageBase';

export default async function AuthenticationRequiredBlock({ lang }: { lang: SupportedLanguage }) {
  const t = await loadTranslations(lang, ["general"]);
  
  return (
    <PageBase lang={lang} requiresAuh={false}>
      <div className='flex flex-col gap-2 items-center text-center mt-[20px]'>
        {/* Icon */}
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            {t.general.authRequired.title}
          </h2>
          <p className="text-foreground-muted leading-relaxed">
            {t.general.authRequired.description}
          </p>
        </div>
        
        <AuthProceedButton btnText={t.general.continueButton} />          
      </div>
    </PageBase>
  );
}