"use client"

import TextInput from "@/components/ui/form/TextInput"
import { useAuth } from "@/features/auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UpdateAccountSchema, updateAccountSchema } from "../../account-schemas";
import Button from "@/components/ui/Button";
import { Save, User } from "lucide-react";
import ErrorText from "@/components/ui/text/ErrorText";
import Card from "@/components/ui/card/Card";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import ColorInput from "@/components/ui/form/ColorInput";
import { PrivateAccountModel } from "../../account-models";
import UpdateCurrentAccountInfo from "../../actions/command/update-current-account-info";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { useMessageBar } from "@/components/layout/MessageBarContext";

interface Props {
    account: PrivateAccountModel;
    generalTranslations: GeneralTranslations;
}

export default function ChangeAccountForm({ generalTranslations, account }: Props) {
    const { updateAccount } = useAuth();
    const msgBar = useMessageBar();

    const form = useForm<UpdateAccountSchema>({
        resolver: zodResolver(updateAccountSchema),
        defaultValues: {
            username: account.username,
            favouriteWord: account.favouriteWord,
            favouriteColor: account.colorHex,
        }
    })

    async function onSubmit(data: UpdateAccountSchema) {
        UpdateCurrentAccountInfo(data)
        .then((resp) => {
            if (resp.ok && resp.data) {
                updateAccount(resp.data);
            } else {
                throw Error();
            }
        })
        .catch(() => {
            msgBar.pushServerError();
        });
    }    

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {generalTranslations.account.accountSettings.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
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

                    <Button type="submit" isLoadingExternal={form.formState.isSubmitting}>
                        <Save className="w-6 h-6" />
                        Update account info
                    </Button>

                    <ErrorText>
                        <span>
                            {form.formState.errors.root?.message}
                        </span>
                    </ErrorText>
                </form>    
            </CardContent>
        </Card> 
    )
}