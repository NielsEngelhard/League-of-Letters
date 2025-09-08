"use client"

import TextInput from "@/components/ui/form/TextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { loginSchema, LoginSchema } from "../../auth-schemas";
import FormBase from "@/components/general/form/FormBase";
import LoginCommand from "../../actions/command/login-command";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    t: GeneralTranslations;
}

export default function LoginForm({ t }: Props) {
    const authContext = useAuth();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    function onSuccessfullLogin() {
        authContext.setShowLoginModal(false);
    }

    return (
        <FormBase form={form} onSubmit={LoginCommand} onSuccess={onSuccessfullLogin} BtnIcon={LogInIcon} btnTxt={t.login.login.loginButton}>
            <TextInput label={t.login.login.usernameLabel} placeholder={t.login.login.usernamePlaceholder} {...form.register("username")} errorMsg={form.formState.errors.username?.message} required />

            <TextInput label={t.login.login.passwordLabel} placeholder={t.login.login.passwordPlaceholder} type="password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} required />
        </FormBase>
    )
}