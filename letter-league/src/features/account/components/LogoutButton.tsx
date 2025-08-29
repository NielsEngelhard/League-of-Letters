"use client"

import { HOME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { SupportedLanguage } from "@/features/i18n/languages";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    label: string;
    lang: SupportedLanguage;
}

export default function LogoutButton({ lang, label }: Props) {
    const { logout } = useAuth();
    const router = useRouter();

    function onLogout() {
        logout();
        router.push(LANGUAGE_ROUTE(lang, HOME_ROUTE));
    }

    return (
    <Button
        variant="error"
        className="w-full sm:w-auto px-8 flex items-center gap-2 justify-center"
        onClick={onLogout}
    >
        <LogOut className="w-4 h-4" />
        <span>{label}</span>
    </Button>
    )
}