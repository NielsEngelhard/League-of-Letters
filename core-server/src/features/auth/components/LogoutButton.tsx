"use client"

import Button from "@/components/ui/Button";
import { LogoutCommand } from "@/features/auth/actions/command/logout-command";
import { useAuth } from "@/features/auth/AuthContext";
import { LogOut } from "lucide-react";

interface Props {
    label: string;
}

export default function LogoutButton({ label }: Props) {
    const { clearAccountData } = useAuth();

    async function onLogout() {
        await LogoutCommand();
        clearAccountData();
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