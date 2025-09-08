"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/AuthContext";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import { useRouter } from "next/navigation";
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { guestLoginSchema, GuestLoginSchema } from "../../auth-schemas";
import FormBase from "@/components/general/form/FormBase";
import CreateGuestSessionCommand from "../../actions/command/create-guest-session-command";
import { PublicAccountModel } from "@/features/account/account-models";
import { HatGlasses } from "lucide-react";

export default function GuestLoginForm({ lang, t }: { lang: SupportedLanguage, t: GeneralTranslations }) {
    const { updateAccount } = useAuth();
    const router = useRouter();

    const form = useForm<GuestLoginSchema>({
        resolver: zodResolver(guestLoginSchema),
        defaultValues: {
            language: lang
        }
    })

    function onSuccessfullGuestLogin(account: PublicAccountModel) {
        updateAccount(account);      
        router.push(LANGUAGE_ROUTE(form.getValues("language"), PICK_GAME_MODE_ROUTE));  
    }

    return (
        <FormBase form={form} onSubmit={CreateGuestSessionCommand} onSuccess={onSuccessfullGuestLogin} btnTxt={t.login.guest.createGuestSessionButton} BtnIcon={HatGlasses}>
            <SelectLanguageGrid name="language" control={form.control} />
        </FormBase>
    )
}