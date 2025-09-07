"use server"

import { LANGUAGE_ROUTE, PROFILE_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import BackButton from "@/components/ui/BackButton";
import SettingsCard from "@/features/account/components/SettingsCard";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";

export default async function AccountSettingsPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["general", "account"]);

    return (
        <PageBase lang={lang} requiresAuh={true} size="lg">
            <>
                <BackButton href={LANGUAGE_ROUTE(lang, PROFILE_ROUTE)} />
                <SettingsCard t={t.general} />
            </>            
        </PageBase>
    )
}
