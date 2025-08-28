"use server"

import { loadTranslations } from "@/features/i18n/utils";
import { SupportedLanguage } from "@/features/i18n/languages";
import ClientHome from "@/components/individual-pages/ClientHome";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  const t = await loadTranslations(lang, ["home"]);

  return (
    <ClientHome lang={lang} t={t.home} />
  );
}
