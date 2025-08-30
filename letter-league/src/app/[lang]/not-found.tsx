import PageBase from '@/components/layout/PageBase';
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from '../routes';
import Button from '@/components/ui/Button';
import { SupportedLanguage } from '@/features/i18n/languages';
import { loadTranslations } from '@/features/i18n/utils';

export default async function NotFound({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {  
  const { lang } = await params;
  const t = await loadTranslations(lang, ["home"]);

  return (
    <PageBase requiresAuh={false} lang={lang}>
      <div className="text-center space-y-8 flex flex-col items-center justify-center w-full">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-8xl font-bold text-gray-200 select-none">404</h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{t.home.notFound.title}</h2>
          <p className="text-gray-500 leading-relaxed">
            {t.home.notFound.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" href={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)}>
                {t.home.notFound.btnText}
            </Button>          
        </div>
      </div>
    </PageBase>
  );
}