"use server"

import { LANGUAGE_ROUTE, PROFILE_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import BackButton from "@/components/ui/BackButton";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SettingsForm from "@/features/account/components/SettingsForm";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { Settings } from "lucide-react";

export default async function AccountSettingsPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["settings"]);

    return (
        <PageBase lang={lang} requiresAuh={true} size="lg">
            <>
                <BackButton href={LANGUAGE_ROUTE(lang, PROFILE_ROUTE)} />

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex flex-row gap-1">
                            <Settings />
                            {t.settings.settings.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SettingsForm t={t.settings} />
                    </CardContent>
                </Card>                
            </>            
        </PageBase>
    )
}
