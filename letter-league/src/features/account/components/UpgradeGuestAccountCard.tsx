"use client"

import LoadingDots from "@/components/ui/animation/LoadingDots";
import TextInput from "@/components/ui/form/TextInput"
import { useAuth } from "@/features/auth/AuthContext";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upgradeGuestAccountSchema, UpgradeGuestAccountSchema } from "../account-schemas";
import Button from "@/components/ui/Button";
import { PartyPopper, User } from "lucide-react";
import ErrorText from "@/components/ui/text/ErrorText";
import Card from "@/components/ui/card/Card";
import ExpandableCardContent from "@/components/ui/card/ExpandableCardContent";
import { PrivateAccountModel } from "../account-models";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import { GUEST_ACCOUNT_POSTFIX } from "../actions/command/generate-random-username";
import AccountTranslations from "@/features/i18n/translation-file-interfaces/AccountTranslations";
import SubText from "@/components/ui/text/SubText";
import UpgradeGuestAccountCommand from "../actions/command/upgrade-guest-account";
import { useState } from "react";

interface Props {
    account: PrivateAccountModel;
    accountTranslations: AccountTranslations;
}

export default function UpgradeGuestAccount({ accountTranslations, account }: Props) {
    const { pushSuccessMsg, pushErrorMsg } = useMessageBar();
    const { updateAccount } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!account) {
        return <LoadingDots />
    }    

    const form = useForm<UpgradeGuestAccountSchema>({
        resolver: zodResolver(upgradeGuestAccountSchema),
        defaultValues: {
            language: account.language,
            username: account.username.replaceAll(GUEST_ACCOUNT_POSTFIX, ""),
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: UpgradeGuestAccountSchema) {
        setLoading(true);
        
        try {
            const response = await UpgradeGuestAccountCommand(data);

            if (response.ok && response.data) {
                updateAccount(response.data);
                pushSuccessMsg(accountTranslations.upgradeGuestAccount.success); 
            } else {
                pushErrorMsg(response.errorMsg);
            }            

            location.reload();
        } catch (err) {
            pushErrorMsg();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full">
            <ExpandableCardContent
                Icon={User}
                title={accountTranslations.upgradeGuestAccount.title}
                description={accountTranslations.upgradeGuestAccount.description}
                initiallyExpaned={true}
            >
                <SubText text={accountTranslations.upgradeGuestAccount.description} className="text-sm" />
                <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
                    <TextInput label="Username" placeholder="Username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

                    <TextInput label="Email" placeholder="Email" {...form.register("email")} errorMsg={form.formState.errors.email?.message} />

                    <TextInput label="Password" placeholder="Password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} type="password" />

                    <SelectLanguageGrid
                        name="language"
                        control={form.control}
                        value={account.language}
                    />
                    <Button type="submit" isLoadingExternal={loading}>
                        <PartyPopper className="w-6 h-6" />
                        {accountTranslations.upgradeGuestAccount.btn}
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