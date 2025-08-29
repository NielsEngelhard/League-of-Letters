"use server"

import PageBase from "@/components/layout/PageBase";
import AccountCard from "@/features/account/components/AccountCard";
import SettingsCard from "@/features/account/components/SettingsCard";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import LogoutButton from "@/features/account/components/LogoutButton";

export default async function AccountPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["general"]);

    return (
        <PageBase lang={lang}>
            <div className="space-y-6 max-w-4xl mx-auto">
                <AccountCard />
                
                <SettingsCard />
                
                <div className="pt-4 border-t border-border/50">
                    <LogoutButton lang={lang} label={t.general.logoutButton} />
                </div>
            </div>
        </PageBase>
    )
}