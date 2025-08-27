"use server"

import { loadTranslations } from "@/features/i18n/utils";
import { SupportedLanguage } from "@/features/i18n/languages";
import ClientHome from "@/components/individual-pages/ClientHome";

export default async function HomePage({
  params,
}: {
  params: { lang: SupportedLanguage };
}) {
  const { lang } = params;
  const t = await loadTranslations(lang, ["home"]);

  return (
    <ClientHome lang={lang} t={t.home} />
  );
}
