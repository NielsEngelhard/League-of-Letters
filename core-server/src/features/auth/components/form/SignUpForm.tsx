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

interface Props {
    t: GeneralTranslations;
    defaultLanguage: SupportedLanguage;
}

export default function SignUpForm({ t, defaultLanguage }: Props) {
    const authContext = useAuth();

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
        authContext.setShowLoginModal(false);
    }

    return (
        <FormBase form={form} onSubmit={CreateAccountCommand} btnTxt={t.login.signUp.signUpButton} BtnIcon={Signature} onSuccess={onSuccessfullSignup} successMsg="">
            <TextInput label={t.login.signUp.emailLabel} placeholder={t.login.signUp.emailPlaceholder} {...form.register("email")} errorMsg={form.formState.errors.email?.message} required />

            <TextInput label={t.login.signUp.passwordLabel} placeholder={t.login.signUp.passwordPlaceholder} type="password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} required />

            <TextInput label={t.login.signUp.usernameLabel} placeholder={t.login.signUp.usernamePlaceholder} {...form.register("username")} errorMsg={form.formState.errors.username?.message} />            
            
            <SelectLanguageGrid name="language" control={form.control} />
        </FormBase>        
        // <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        //     <TextInput label="Email" placeholder="Your Email address" {...form.register("email")} errorMsg={form.formState.errors.email?.message} required />

        //     <TextInput label="Password" placeholder="Enter your password" type="password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} required />

        //     <TextInput label="Username" placeholder="Your username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

        //     <div className="flex flex-col gap-0.5">
        //         <SelectLanguageGrid name="language" control={form.control} />
        //         <p className="text-xs font-bold text-foreground-muted text-center">The language you choose is the language your words will be in!</p>
        //     </div>

        //     <Button type="submit">
        //         <IdCard className="w-6 h-6" />
        //         Create Account
        //     </Button>

        //     <ErrorText>
        //         <span>
        //             {form.formState.errors.root?.message}
        //         </span>
        //     </ErrorText>
        // </form>     
    )
}