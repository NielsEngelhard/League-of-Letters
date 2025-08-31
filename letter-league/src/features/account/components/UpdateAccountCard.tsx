"use client"

import LoadingDots from "@/components/ui/animation/LoadingDots";
import TextInput from "@/components/ui/form/TextInput"
import { useAuth } from "@/features/auth/AuthContext";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UpdateAccountSchema, updateAccountSchema } from "../account-schemas";
import Button from "@/components/ui/Button";
import { Save, User } from "lucide-react";
import ErrorText from "@/components/ui/text/ErrorText";
import Card from "@/components/ui/card/Card";
import ExpandableCardContent from "@/components/ui/card/ExpandableCardContent";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import ColorInput from "@/components/ui/form/ColorInput";
import { PrivateAccountModel } from "../account-models";
import UpdateCurrentAccountInfo from "../actions/command/update-current-account-info";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import { useState } from "react";

interface Props {
    account: PrivateAccountModel;
    generalTranslations: GeneralTranslations;
}

export default function UpdateAccountForm({ generalTranslations, account }: Props) {
    const { pushSuccessMsg, pushErrorMsg } = useMessageBar();
    const { updateAccount } = useAuth();
    const [loading, setLoading] = useState(false);

    const form = useForm<UpdateAccountSchema>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: {
            language: account.language,
            username: account.username,
            favouriteWord: account.favouriteWord,
            favouriteColor: account.colorHex,
        }
    })

    if (!account) {
        return <LoadingDots />
    }   

    async function onSubmit(data: UpdateAccountSchema) {
        setLoading(true);
        
        try {
        const response = await UpdateCurrentAccountInfo(data);

        if (response.ok && response.data) {
            updateAccount(response.data);
            pushSuccessMsg("success");
        } else {
            pushErrorMsg("error");
        }          
        } catch  {
            pushErrorMsg();
        } finally {
            setLoading(false);
        }        
    }

    return (
        <Card className="w-full">
            <ExpandableCardContent
                Icon={User}
                title={generalTranslations.account.accountSettings.title}
                description={generalTranslations.account.accountSettings.updateDescription}
                initiallyExpaned={false}
            >
                <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
                    <TextInput label="Username" placeholder="Your username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

                    <TextInput label="Favourite word" placeholder="Your username" {...form.register("favouriteWord")} errorMsg={form.formState.errors.favouriteWord?.message} />

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

                    <SelectLanguageGrid
                        name="language"
                        control={form.control}
                        value={account.language}
                    />
                    <Button type="submit" isLoadingExternal={loading}>
                        <Save className="w-6 h-6" />
                        Update account info
                    </Button>

                    <ErrorText>
                        <span>
                            {form.formState.errors.root?.message}
                        </span>
                    </ErrorText>
                </form>    
            </ExpandableCardContent>
        </Card> 
    )
}