"use client"

import TextInput from "@/components/ui/form/TextInput"
import { useAuth } from "@/features/auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UpdateAccountSchema, updateAccountSchema } from "../../account-schemas";
import ColorInput from "@/components/ui/form/ColorInput";
import { PrivateAccountModel, PublicAccountModel } from "../../account-models";
import UpdateCurrentAccountInfo from "../../actions/command/update-current-account-info";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import FormBase from "@/components/general/form/FormBase";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";

interface Props {
    account: PrivateAccountModel;
    t: SettingsTranslations;
}

export default function ChangeAccountForm({ t, account }: Props) {
    const { updateAccount } = useAuth();
    const msgBar = useMessageBar();

    const form = useForm<UpdateAccountSchema>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: {
            username: account.username,
            favouriteWord: account.favouriteWord,
            favouriteColor: account.colorHex,
        }
    });

    function onSuccess(account: PublicAccountModel) {
        updateAccount(account);
        msgBar.pushSuccessMsg("Success");
    }

    return (
        <FormBase form={form}  onSubmit={UpdateCurrentAccountInfo} onSuccess={onSuccess}>
            <TextInput label="Username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

            <TextInput label={t.profile.updateAccount.favWordLabel} {...form.register("favouriteWord")} errorMsg={form.formState.errors.favouriteWord?.message} />

            <Controller
                name="favouriteColor"
                control={form.control}
                rules={{ 
                required: 'Primary color is required',
                pattern: {
                    value: /^#[0-9A-F]{6}$/i,
                    message: 'Please enter a valid hex color'
                }
                }}
                render={({ field, fieldState }) => (
                <ColorInput
                    label="Color"
                    errorMsg={fieldState.error?.message}
                    success={!fieldState.error && fieldState.isDirty}
                    required
                    {...field}
                    disableHexInput={true}
                    initialValue={account.colorHex}
                />
                )}
            />    
        </FormBase>
    )
}