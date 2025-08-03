"use client"

import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext"
import { useRouter } from "next/navigation";
import { PICK_GAME_MODE_ROUTE } from "../routes";

export default function ProfilePage() {
    const { authSession, logout } = useAuth();
    const router = useRouter();

    function onLogout() {
        logout();
        router.push(PICK_GAME_MODE_ROUTE);
    }

    const profileData = [
        { label: "ID", value: authSession?.id || "—" },
        { label: "Name", value: authSession?.username || "—" },
        { label: "Created", value: authSession?.createdAt ? new Date(authSession.createdAt).toLocaleDateString() : "—" }
    ];

    return (
        <PageBase>
            <div className="max-w-md mx-auto space-y-8">
                {/* Profile Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                        {profileData.map((item, index) => (
                            <div key={index} className="px-6 py-4 flex justify-between items-center gap-2">
                                <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                                <dd className="text-sm text-gray-900 font-mono">{item.value}</dd>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                    <Button variant="error" size="sm" onClick={onLogout}>
                        Logout
                    </Button>                
                </div>
            </div>
        </PageBase>
    )
}