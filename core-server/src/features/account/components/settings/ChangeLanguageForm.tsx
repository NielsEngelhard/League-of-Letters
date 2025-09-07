"use client"

import { SupportedLanguage } from "@/features/i18n/languages"
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changeLanguageSchema, ChangeLanguageSchema } from "../../account-schemas";
import UpdateCurrentUserLanguage from "../../actions/command/update-current-user-language";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { changePathLanguagePrefix } from "@/features/language/language-util";
import { usePathname, useRouter } from "next/navigation";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import { waitDelay } from "@/lib/debug-util";
import FormBase from "@/components/general/form/FormBase";

interface Props {
    currentLanguage: SupportedLanguage;
}

export default function ChangeLanguageForm({ currentLanguage }: Props) {
    const { updateAccount, account } = useAuth();
    const currentPath = usePathname();
    const router = useRouter();
    const msgBar = useMessageBar();

    const form = useForm<ChangeLanguageSchema>({
      resolver: zodResolver(changeLanguageSchema),
      defaultValues: {
        language: currentLanguage
      }
    });

    async function onSubmit(data: ChangeLanguageSchema) {
        UpdateCurrentUserLanguage(data)
        .then((resp) => {
            if (resp.ok && resp.data) {
                onSuccessfullLanguageChange(resp.data);
            } else {
                throw Error();
            }
        })
        .catch(() => {
            msgBar.pushServerError();
        });
    }

    function onSuccessfullLanguageChange(newLanguage: SupportedLanguage) {
        // Update in local storage
        if (account) {
            account.language = newLanguage;
            updateAccount(account);
        }        

        // Update url with new language
        const newPath = changePathLanguagePrefix(currentPath, newLanguage);
        router.push(newPath);
    }
    
    return (
        <FormBase form={form} onSubmit={onSubmit}>
            <SelectLanguageGrid
                name="language"
                control={form.control}
            />            
        </FormBase>
    )
}