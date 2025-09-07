"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpgradeGuestAccountSchema, upgradeGuestAccountSchema } from "../../account-schemas";
import FormBase from "@/components/general/form/FormBase";
import UpgradeGuestAccountCommand from "../../actions/command/upgrade-guest-account";
import TextInput from "@/components/ui/form/TextInput";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import { SupportedLanguage } from "@/features/i18n/languages";

export default function UpgradeGuestAccountForm({ currentLanguage }: { currentLanguage: SupportedLanguage }) {
    const form = useForm<UpgradeGuestAccountSchema>({
      resolver: zodResolver(upgradeGuestAccountSchema) ,
      defaultValues: {
        language: currentLanguage
      }   
    });

    return (
        <FormBase form={form}  onSubmit={UpgradeGuestAccountCommand}>
            <TextInput label="Username" placeholder="Username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

            <TextInput label="Email" placeholder="Email" {...form.register("email")} errorMsg={form.formState.errors.email?.message} />

            <TextInput label="Password" placeholder="Password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} type="password" />

            <SelectLanguageGrid
                name="language"
                control={form.control}
            />
        </FormBase>   
    )
}