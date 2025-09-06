"use server"

import PageBase from "@/components/layout/PageBase";
import AccountCard from "@/features/account/components/AccountCard";
import SettingsCard from "@/features/account/components/SettingsCard";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import LogoutButton from "@/features/account/components/LogoutButton";
import UpdateAccountForm from "@/features/account/components/UpdateAccountCard";
import GetCurrentPrivateAccount from "@/features/account/actions/request/get-current-private-account";
import UpgradeGuestAccount from "@/features/account/components/UpgradeGuestAccountCard";

export default async function AccountPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["general", "account"]);

    const privateAccount = await GetCurrentPrivateAccount();

    return (
        <PageBase lang={lang} requiresAuh={true}>
            {privateAccount && (
                <div className="space-y-6 max-w-4xl mx-auto">
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
            )}
        </PageBase>
    )
}
