"use server"

import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import InfoBanner from "@/components/ui/InfoBanner";
import Seperator from "@/components/ui/Seperator";
import StatisticHighlight from "@/components/ui/StatisticHighlight";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GetLanguageStyle } from "@/features/language/LanguageStyles";
import { Calendar1, User, Crown, UserCheck, BarChart3, Clock, Settings } from "lucide-react";
import { PrivateAccountModel } from "../account-models";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import LogoutButton from "@/features/auth/components/LogoutButton";

interface Props {
    t: SettingsTranslations;
    lang: SupportedLanguage;
    account: PrivateAccountModel;
}

export default async function AccountCard({ t, lang, account }: Props) {
    const getInitials = (name: string) => {
        return name?.charAt(0).toUpperCase() || "?";
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const languageStyles = GetLanguageStyle(lang);

    return (
        account && (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t.account.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
                                <span className="font-bold text-2xl text-background">
                                    {getInitials(account.username)}                                    
                                </span>
                            </div>
                            
                            {/* User Info */}
                            <div className="flex flex-col space-y-1">
                                <h3 className="font-bold text-lg text-foreground">
                                    {account.username}
                                </h3>
                                
                                <div className="flex items-center gap-2">
                                    {languageStyles?.flag}

                                    {(account.isGuest == true) ? (
                                        <>
                                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground font-medium">
                                                {t.account.accountType.guest}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-primary font-medium">
                                                {t.account.accountType.member}
                                            </span>
                                        </>
                                    )}                                    
                                </div>
                                
                                {(account.isGuest == false) && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar1 className="w-3 h-3" />
                                        <span>{t.account.memberSince} {formatDate(account.createdAt.toString())}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Seperator />

                    {/* Statistics Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                            <span>{t.account.statistics.title}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                                <StatisticHighlight
                                    title={account.isGuest ? 'n/a' : account.nGamesPlayed.toString()}
                                    text={t.account.statistics.played}
                                />
                            </div>
                            
                            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                                <StatisticHighlight
                                    title={account.isGuest ? 'n/a' : account.highestScoreAchieved.toString()}
                                    text={t.account.statistics.highestScore}
                                />
                            </div>
                            
                            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                                <StatisticHighlight
                                    title={account.isGuest ? 'n/a' : account.favouriteWord || "None"}
                                    text={t.account.statistics.favouriteWord}
                                />
                            </div>
                        </div>

                        <InfoBanner icon={Clock} colorVariant="secondary" text={t.account.statistics.updateDisclaimer} />

                        <Seperator />

                        <LogoutButton lang={lang} label={t.account.logoutButton} />
                    </div>
                </CardContent>
            </Card>
        )
    )
}