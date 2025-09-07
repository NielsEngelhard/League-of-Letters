"use server"

import { HOME_ROUTE, LANGUAGE_ROUTE, PROFILE_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import BackButton from "@/components/ui/BackButton";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import GetCurrentPrivateAccount from "@/features/account/actions/request/get-current-private-account";
import ChangePasswordForm from "@/features/account/components/settings/ChangePasswordForm";
import UpdateAccountForm from "@/features/account/components/UpdateAccountCard";
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
    const t = await loadTranslations(lang, ["general", "account"]);

    const privateAccount = await GetCurrentPrivateAccount();
    if (!privateAccount) redirect(HOME_ROUTE);

    return (
        <PageBase lang={lang} requiresAuh={true} size="lg">
            <>
                <BackButton href={LANGUAGE_ROUTE(lang, PROFILE_ROUTE)} />                 
                 
                 {/* Change Language */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Change language
                        </CardTitle>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>                 
                 
                {/* Change profile info */}
                <UpdateAccountForm generalTranslations={t.general} account={privateAccount} />                

                 {/* Change Password */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Change password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChangePasswordForm />
                    </CardContent>
                </Card>                 
            </>            
        </PageBase>
    )
}
