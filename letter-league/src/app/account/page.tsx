"use client"

import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext"
import { useRouter } from "next/navigation";
import { PICK_GAME_MODE_ROUTE } from "../routes";
import AccountCard from "@/features/account/components/AccountCard";
import SettingsCard from "@/features/account/components/SettingsCard";

export default function AccountPage() {
    const { logout } = useAuth();
    const router = useRouter();

    function onLogout() {
        logout();
        router.push(PICK_GAME_MODE_ROUTE);
    }

    return (
        <PageBase>
            <AccountCard>
                
            </AccountCard>

            <SettingsCard>

            </SettingsCard>

            <Button 
                variant="error" 
                className="w-full"
                onClick={onLogout}
            >
                <span>Sign Out</span>
            </Button>            
        </PageBase>
    )
}