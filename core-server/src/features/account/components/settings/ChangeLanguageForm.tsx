"use client"

import { SupportedLanguage } from "@/features/i18n/languages"
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changeLanguageSchema, ChangeLanguageSchema } from "../../account-schemas";
import UpdateCurrentUserLanguage from "../../actions/command/update-current-user-language";
import { useAuth } from "@/features/auth/AuthContext";
import { changePathLanguagePrefix } from "@/features/language/language-util";
import { usePathname, useRouter } from "next/navigation";
import FormBase from "@/components/general/form/FormBase";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";

interface Props {
    currentLanguage: SupportedLanguage;
    t: SettingsTranslations;
}

export default function ChangeLanguageForm({ currentLanguage, t }: Props) {
    const { updateAccount, account } = useAuth();
    const currentPath = usePathname();
    const router = useRouter();

    const form = useForm<ChangeLanguageSchema>({
      resolver: zodResolver(changeLanguageSchema),
      defaultValues: {
        language: currentLanguage
      }
    });

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
        <FormBase 
            form={form} 
            onSubmit={UpdateCurrentUserLanguage}
            onSuccess={onSuccessfullLanguageChange}
            btnTxt={t.profile.updateLanguage.button}
        >
            <SelectLanguageGrid
                name={t.profile.updateLanguage.title}
                control={form.control}
            />        
        </FormBase>
    )
}