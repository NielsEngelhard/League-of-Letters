import PageBase from '@/components/layout/PageBase';
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from './routes';
import { DefaultLanguage } from '@/features/i18n/languages';
import { loadTranslations } from '@/features/i18n/utils';
import { Authenticate_Server } from '@/features/auth/current-user';
import Link from 'next/link';

export default async function NotFound() {  
  const authenticatedUser = await Authenticate_Server(true);  
  
  const lang = authenticatedUser?.language ?? DefaultLanguage;
  const t = await loadTranslations(lang, ["home"]);

  return (
    <PageBase requiresAuh={false} lang={lang}>
      <div className='mt-10'>
        <div className="text-center space-y-8 flex flex-col items-center justify-center w-full">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-8xl font-bold text-foreground select-none">404</h1>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground-muted">{t.home.notFound.title}</h2>
            <p className="text-gray-500 leading-relaxed">
              {t.home.notFound.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Sounds not available here so custom button */}
              <Link href={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)}>
                <button className='text-lg font-bold bg-primary rounded-md text-background px-4 py-2'>
                  {t.home.notFound.btnText}
                </button>
              </Link>
          </div>
        </div>        
      </div>
    </PageBase>
  );
}