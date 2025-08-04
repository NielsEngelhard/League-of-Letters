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
        { label: "User ID", value: authSession?.id || "—", icon: "🆔" },
        { label: "Username", value: authSession?.username || "—", icon: "👤" },
        { label: "Member Since", value: authSession?.createdAt ? new Date(authSession.createdAt).toLocaleDateString() : "—", icon: "📅" }
    ];

    const getInitials = (name: string) => {
        return name?.charAt(0).toUpperCase() || "?";
    };

    return (
        <PageBase>
            <div className="max-w-md mx-auto space-y-8">
                {/* Profile Header */}
                <div className="text-center space-y-4">
                    {/* Avatar */}
                    <div className="relative inline-block">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-2xl font-bold">
                                {getInitials(authSession?.username || "")}
                            </span>
                        </div>
                        {/* Online status */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-4 border-white shadow-sm">
                            <div className="w-full h-full bg-success rounded-full animate-pulse" />
                        </div>
                        {/* Decorative ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-20" />
                    </div>

                    {/* Welcome text */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back!
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage your profile and game settings
                        </p>
                    </div>
                </div>

                {/* Profile Information Card */}
                <div className="relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl" />
                    
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                            </div>
                        </div>
                        
                        {/* Profile data */}
                        <div className="divide-y divide-gray-100">
                            {profileData.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                                            {item.icon}
                                        </span>
                                        <dt className="text-sm font-medium text-gray-600">
                                            {item.label}
                                        </dt>
                                    </div>
                                    <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded-lg border group-hover:bg-gray-100 transition-colors duration-200">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </div>

                        {/* Session info banner */}
                        <div className="px-6 py-3 bg-orange-50 border-t border-orange-100">
                            <div className="flex items-center justify-center gap-2 text-orange-700">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                                <span className="text-xs font-medium">Guest Session Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <span>📊</span>
                        Quick Stats
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">n/a</div>
                            <div className="text-xs text-blue-500">Games Played</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-green-600">n/a</div>
                            <div className="text-xs text-green-500">Games Won</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">n/a</div>
                            <div className="text-xs text-purple-500">Best Score</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Logout Button */}
                    <Button 
                        variant="error" 
                        className="w-full"
                        onClick={onLogout}
                    >
                        <span>Sign Out</span>
                    </Button>
                </div>

                {/* Footer note */}
                <div className="text-center text-xs text-gray-400 pb-4">
                    Your session data is stored locally and will be cleared when you log out.
                </div>
            </div>
        </PageBase>
    )
}