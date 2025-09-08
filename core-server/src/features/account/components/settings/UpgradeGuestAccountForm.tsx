"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpgradeGuestAccountSchema, upgradeGuestAccountSchema } from "../../account-schemas";
import FormBase from "@/components/general/form/FormBase";
import UpgradeGuestAccountCommand from "../../actions/command/upgrade-guest-account";
import TextInput from "@/components/ui/form/TextInput";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import { SupportedLanguage } from "@/features/i18n/languages";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import { PublicAccountModel } from "../../account-models";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from "next/navigation";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

export default function UpgradeGuestAccountForm({ currentLanguage, settingsTranslations, generalTranslations }: { currentLanguage: SupportedLanguage, settingsTranslations: SettingsTranslations, generalTranslations: GeneralTranslations }) {
   const router = useRouter();
   const { updateAccount } = useAuth();

    const form = useForm<UpgradeGuestAccountSchema>({
      resolver: zodResolver(upgradeGuestAccountSchema) ,
      defaultValues: {
        language: currentLanguage
      }   
    });

    function onSuccessfullAccountUpgrade(account: PublicAccountModel) {
        // Update in local storage
        updateAccount(account);       
    }    

    return (
        <FormBase form={form}  onSubmit={UpgradeGuestAccountCommand} btnTxt={settingsTranslations.upgradeGuestAccount.buttonText} onSuccess={onSuccessfullAccountUpgrade}>
            <TextInput label={generalTranslations.login.signUp.usernameLabel} {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

            <TextInput label={generalTranslations.login.signUp.emailLabel} {...form.register("email")} errorMsg={form.formState.errors.email?.message} />

            <TextInput label={generalTranslations.login.signUp.passwordLabel} {...form.register("password")} errorMsg={form.formState.errors.password?.message} type="password" />

            <SelectLanguageGrid
                name="language"
                control={form.control}
            />
        </FormBase>   
    )
}