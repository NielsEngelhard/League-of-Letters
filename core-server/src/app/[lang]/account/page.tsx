"use server"

import PageBase from "@/components/layout/PageBase";
import AccountCard from "@/features/account/components/AccountCard";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import GetCurrentPrivateAccount from "@/features/account/actions/request/get-current-private-account";
import { redirect } from "next/navigation";
import { ACCOUNT_SETTINGS_ROUTE, HOME_ROUTE, LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE, PROFILE_SETTINGS_ROUTE } from "@/app/routes";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { Flame, Settings, User } from "lucide-react";
import UpgradeGuestAccountForm from "@/features/account/components/settings/UpgradeGuestAccountForm";
import DefaultCard from "@/components/ui/card/DefaultCard";

export default async function AccountPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["settings", "general"]);

    const privateAccount = await GetCurrentPrivateAccount();
    if (!privateAccount) redirect(HOME_ROUTE);

    return (
        <PageBase lang={lang} requiresAuh={true}>
            <div className="flex flex-row justify-between">
                <BackButton href={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)} />

                {!privateAccount.isGuest && (
                    <div className="flex flex-row gap-2">
                        <Button size="sm" corners="square" variant="skeleton" href={LANGUAGE_ROUTE(lang, PROFILE_SETTINGS_ROUTE)}>
                            <User size={16} />
                            {t.settings.account.profileTab}
                        </Button>                      
                        <Button size="sm" corners="square" variant="skeleton" href={LANGUAGE_ROUTE(lang, ACCOUNT_SETTINGS_ROUTE)}>
                            <Settings size={16} />
                            {t.settings.account.settingsTab}
                        </Button>                  
                    </div>                    
                )}
            </div>
            
            {!privateAccount.isGuest ? (
                <AccountCard t={t.settings} lang={lang} account={privateAccount} />
            ) : (
                <DefaultCard title={t.settings.upgradeGuestAccount.title} description={t.settings.upgradeGuestAccount.description} Icon={Flame}>
                    <UpgradeGuestAccountForm
                        generalTranslations={t.general}
                        settingsTranslations={t.settings}
                        currentLanguage={privateAccount.language}
                    />
                </DefaultCard>
            )}
        </PageBase>
    )
}
