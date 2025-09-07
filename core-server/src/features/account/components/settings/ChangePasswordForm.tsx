"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangePasswordSchema, changePasswordSchema } from "../../account-schemas"
import TextInput from "@/components/ui/form/TextInput";
import ChangePasswordCommand from "../../actions/command/change-password-command";
import FormBase from "@/components/general/form/FormBase";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";

export default function ChangePasswordForm({ t }: { t: SettingsTranslations }) {
    const form = useForm<ChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema)    
    });

    return (
        <FormBase
            form={form}
            onSubmit={ChangePasswordCommand}
            btnTxt={t.profile.updatePassword.button}
        >
            <TextInput label={t.profile.updatePassword.oldLabel} {...form.register("oldPassword")} errorMsg={form.formState.errors.oldPassword?.message} type="password" />

            <TextInput label={t.profile.updatePassword.newLabel} {...form.register("newPassword")} errorMsg={form.formState.errors.newPassword?.message} type="password" />
        </FormBase>        
    )
}