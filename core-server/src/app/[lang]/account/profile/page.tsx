"use server"

import { HOME_ROUTE, LANGUAGE_ROUTE, PROFILE_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import BackButton from "@/components/ui/BackButton";
import DefaultCard from "@/components/ui/card/DefaultCard";
import GetCurrentPrivateAccount from "@/features/account/actions/request/get-current-private-account";
import ChangeAccountForm from "@/features/account/components/settings/ChangeAccountForm";
import ChangePasswordForm from "@/features/account/components/settings/ChangePasswordForm";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { Lock } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfileSettingsPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["settings"]);

    const privateAccount = await GetCurrentPrivateAccount();
    if (!privateAccount) redirect(HOME_ROUTE);

    return (
        <PageBase lang={lang} requiresAuh={true} size="lg">
            <>
                <BackButton href={LANGUAGE_ROUTE(lang, PROFILE_ROUTE)} />                 
                 
                 {/* Change Language */}
                {/* <DefaultCard Icon={Languages} title={t.settings.profile.updateLanguage.title}>
                    <ChangeLanguageForm currentLanguage={privateAccount.language} t={t.settings} />
                </DefaultCard> */}
                 
                {/* Change profile info */}
                <DefaultCard Icon={Lock} title={t.settings.profile.updateAccount.title}>
                    <ChangeAccountForm t={t.settings} account={privateAccount} />     
                </DefaultCard>                                           

                {/* Change Password */}
                <DefaultCard Icon={Lock} title={t.settings.profile.updatePassword.title}>
                    <ChangePasswordForm t={t.settings}/>
                </DefaultCard>
            </>            
        </PageBase>
    )
}
