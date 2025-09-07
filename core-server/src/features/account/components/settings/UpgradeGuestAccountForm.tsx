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

export default function UpgradeGuestAccountForm({ currentLanguage, t }: { currentLanguage: SupportedLanguage, t: SettingsTranslations }) {
    const form = useForm<UpgradeGuestAccountSchema>({
      resolver: zodResolver(upgradeGuestAccountSchema) ,
      defaultValues: {
        language: currentLanguage
      }   
    });

    return (
        <FormBase form={form}  onSubmit={UpgradeGuestAccountCommand} btnTxt={t.upgradeGuestAccount.buttonText}>
            <TextInput label="Username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

            <TextInput label="Email" {...form.register("email")} errorMsg={form.formState.errors.email?.message} />

            <TextInput label={t.upgradeGuestAccount.passwordLabel} {...form.register("password")} errorMsg={form.formState.errors.password?.message} type="password" />

            <SelectLanguageGrid
                name="language"
                control={form.control}
            />
        </FormBase>   
    )
}