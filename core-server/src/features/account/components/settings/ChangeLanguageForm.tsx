"use client"

import { SupportedLanguage } from "@/features/i18n/languages"
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changeLanguageSchema, ChangeLanguageSchema } from "../../account-schemas";
import { useServerAction } from "@/lib/response-handling/useServerAction";
import UpdateCurrentUserLanguage from "../../actions/command/update-current-user-language";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";

interface Props {
    currentLanguage: SupportedLanguage;
}

export default function ChangeLanguageForm({ currentLanguage }: Props) {
    const { updateAccount, account } = useAuth();

    const form = useForm<ChangeLanguageSchema>({
      resolver: zodResolver(changeLanguageSchema),
      defaultValues: {
        language: currentLanguage
      }
    });

    const { execute: executeChangeLanguage, isLoading } = useServerAction(
        {
            successMessage: "Language updated",
            onSuccess: (data) => {
                onSuccessfullLanguageChange(data.language);
            }
        }
    );

    async function onSubmit(data: ChangeLanguageSchema) {
        await executeChangeLanguage(() => UpdateCurrentUserLanguage(data));
    }    

    function onSuccessfullLanguageChange(newLanguage: SupportedLanguage) {
        // Update in local storage
        if (account) {
            account.language = newLanguage;
            updateAccount(account);
        }
    }
    
    return (
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <SelectLanguageGrid
                name="language"
                control={form.control}
            />

            <Button className="w-full" type="submit" isLoadingExternal={isLoading}>
                Change language
            </Button>            
        </form>
    )
}