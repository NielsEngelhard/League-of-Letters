"use client"

import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext"
import { useRouter } from "next/navigation";
import { PICK_GAME_MODE_ROUTE } from "../routes";
import ProfileCard from "@/features/user/components/ProfileCard";
import SettingsCard from "@/features/user/components/SettingsCard";

export default function ProfilePage() {
    const { authSession, logout } = useAuth();
    const router = useRouter();

    function onLogout() {
        logout();
        router.push(PICK_GAME_MODE_ROUTE);
    }

    return (
        <PageBase>
            <ProfileCard>
                
            </ProfileCard>

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