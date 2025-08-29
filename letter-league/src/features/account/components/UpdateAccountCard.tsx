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

interface Props {
    account: PrivateAccountModel;
    generalTranslations: GeneralTranslations;
}

export default function UpdateAccountForm({ generalTranslations, account }: Props) {
    if (!account) {
        return <LoadingDots />
    }    

    const form = useForm<UpdateAccountSchema>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: {
            language: account.language,
            username: account.username,
            favouriteWord: account.favouriteWord,
            favouriteColor: account.colorHex,
            email: account.email,            
        }
    })

    async function onSubmit(data: UpdateAccountSchema) {
        if (account?.isGuest == true) {
            // Convert guest account to normal account
        } else {
            // Just update the account
        }
        // const error = await CreateAccountCommand(data);
        // if (!error) {
        //     await authContext.login({ username: data.email, password: data.password });
        // } 

        // form.setError("root", {
        //     type: "manual",
        //     message: error
        // });
    }

    return (
        <Card className="w-full">
            <ExpandableCardContent
                Icon={User}
                title={generalTranslations.account.accountSettings.title}
                t={generalTranslations}
                description={generalTranslations.account.accountSettings.updateDescription}
                initiallyExpaned={true}
            >
                <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
                    <TextInput label="Email" placeholder="Your email" {...form.register("email")} errorMsg={form.formState.errors.email?.message} />

                    <TextInput label="Username" placeholder="Your username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

                    <TextInput label="Favourite word" placeholder="Your username" {...form.register("favouriteWord")} errorMsg={form.formState.errors.favouriteWord?.message} />

                    {(account.isGuest == true) && (
                        <TextInput label="Password" placeholder="Your password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} />
                    )}

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
                        />
                        )}
                    />

                    <SelectLanguageGrid
                        name="language"
                        control={form.control}
                    />
                    <Button type="submit">
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