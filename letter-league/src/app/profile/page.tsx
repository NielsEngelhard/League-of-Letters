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

    const profileData = [
        { label: "User ID", value: authSession?.id || "—", icon: "🆔" },
        { label: "Username", value: authSession?.username || "—", icon: "👤" },
        { label: "Member Since", value: authSession?.createdAt ? new Date(authSession.createdAt).toLocaleDateString() : "—", icon: "📅" }
    ];

    const getInitials = (name: string) => {
        return name?.charAt(0).toUpperCase() || "?";
    };

    return (
        <PageBase>
            <ProfileCard>

            </ProfileCard>

            <SettingsCard>
                
            </SettingsCard>
        </PageBase>
    )
}