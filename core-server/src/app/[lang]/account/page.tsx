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
import { Settings, User } from "lucide-react";

export default async function AccountPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["general", "account"]);

    const privateAccount = await GetCurrentPrivateAccount();
    if (!privateAccount) redirect(HOME_ROUTE);

    return (
        <PageBase lang={lang} requiresAuh={true}>
            <div className="flex flex-row justify-between">
                <BackButton href={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)} />

                <div className="flex flex-row gap-2">
                    <Button size="sm" corners="square" variant="skeleton" href={LANGUAGE_ROUTE(lang, PROFILE_SETTINGS_ROUTE)}>
                        <User size={16} />
                        {/* {t.general.profileSettings.title} */}
                        PROFIEL
                    </Button>                      
                    <Button size="sm" corners="square" variant="skeleton" href={LANGUAGE_ROUTE(lang, ACCOUNT_SETTINGS_ROUTE)}>
                        <Settings size={16} />
                        {t.general.settings.title}
                    </Button>                  
                </div>
            </div>
            <AccountCard t={t.general} lang={lang} account={privateAccount} />
            {/* {privateAccount && (
                <div className="space-y-6 mx-auto">
                    {(privateAccount.isGuest == true) && (
                        <UpgradeGuestAccount account={privateAccount} accountTranslations={t.account} />
                    )}

                    <AccountCard t={t.general} lang={lang} account={privateAccount} />
                    
                    {(privateAccount.isGuest == false) && (
                        <UpdateAccountForm generalTranslations={t.general} account={privateAccount} />
                    )}

                    <SettingsCard t={t.general} />
                    
                    <div className="pt-4 border-t border-border/50">
                        <LogoutButton lang={lang} label={t.general.logoutButton} />
                    </div>
                </div>                
            )} */}
        </PageBase>
    )
}
