"use client"

import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext"
import { useRouter } from "next/navigation";
import { HOME_ROUTE } from "../../routes";
import AccountCard from "@/features/account/components/AccountCard";
import SettingsCard from "@/features/account/components/SettingsCard";
import { LogOut } from "lucide-react";
import { useRouteToPage } from "@/app/useRouteToPage";

export default function AccountPage() {
    const { logout } = useAuth();
    const router = useRouter();
    const route = useRouteToPage();

    function onLogout() {
        logout();
        router.push(route(HOME_ROUTE));
    }

    return (
        <PageBase>
            <div className="space-y-6 max-w-4xl mx-auto">
                <AccountCard />
                
                <SettingsCard />
                
                <div className="pt-4 border-t border-border/50">
                    <Button
                        variant="error"
                        className="w-full sm:w-auto px-8 flex items-center gap-2 justify-center"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </div>
        </PageBase>
    )
}