"use client"

import { useAuth } from "@/features/auth/AuthContext";
import { Clock } from "lucide-react";

export default function GuestSessionTimeRemaining() {
    const { guestSessionTimeRemaining } = useAuth();

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
                {guestSessionTimeRemaining}
            </span>
        </div>        
    )
}