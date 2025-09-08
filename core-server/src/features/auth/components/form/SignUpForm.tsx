"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/AuthContext";
import CreateAccountCommand from "../../actions/command/create-account-command";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import FormBase from "@/components/general/form/FormBase";
import { signUpSchema, SignUpSchema } from "../../auth-schemas";
import TextInput from "@/components/ui/form/TextInput";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { SupportedLanguage } from "@/features/i18n/languages";
import { Signature } from "lucide-react";
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "@/app/routes";
import { useRouter } from "next/navigation";
import { LoginModalState } from "../LoginModal";

interface Props {
    t: GeneralTranslations;
    defaultLanguage: SupportedLanguage;
}

export default function SignUpForm({ t, defaultLanguage }: Props) {
    const authContext = useAuth();
    const router = useRouter();

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            language: defaultLanguage
        }
    })

    function onSuccessfullSignup() {
        authContext.setLoginModalState(LoginModalState.Hidden);
        router.push(LANGUAGE_ROUTE(form.getValues("language"), PICK_GAME_MODE_ROUTE));  
    }

    return (
        <FormBase form={form} onSubmit={CreateAccountCommand} btnTxt={t.login.signUp.signUpButton} BtnIcon={Signature} onSuccess={onSuccessfullSignup} successMsg="">
            <TextInput label={t.login.signUp.emailLabel} placeholder={t.login.signUp.emailPlaceholder} {...form.register("email")} errorMsg={form.formState.errors.email?.message} required />

            <TextInput label={t.login.signUp.passwordLabel} placeholder={t.login.signUp.passwordPlaceholder} type="password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} required />

            <TextInput label={t.login.signUp.usernameLabel} placeholder={t.login.signUp.usernamePlaceholder} {...form.register("username")} errorMsg={form.formState.errors.username?.message} />            
            
            <SelectLanguageGrid name="language" control={form.control} />
        </FormBase>        
    )
}