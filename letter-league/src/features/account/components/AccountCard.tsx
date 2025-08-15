import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import Seperator from "@/components/ui/Seperator";
import StatisticHighlight from "@/components/ui/StatisticHighlight";
import { useAuth } from "@/features/auth/AuthContext";
import { Calendar1, User, Crown, UserCheck, BarChart3 } from "lucide-react";

interface Props {

}

export default function AccountCard({
}: Props) {
    const { account } = useAuth();

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

    return (
        account && (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account Information
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
                                    {(account.isGuest == true) ? (
                                        <>
                                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground font-medium">
                                                Guest Account
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-primary font-medium">
                                                Registered User
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                {(account.isGuest == false) && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar1 className="w-3 h-3" />
                                        <span>Member since {formatDate(account.createdAt.toString())}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {account.isGuest && (
                            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                                <p className="text-xs text-muted-foreground">
                                    <strong>Guest Account:</strong> Your progress is saved locally but won't sync across devices. 
                                    Consider creating a full account to preserve your statistics!
                                </p>
                            </div>
                        )}
                    </div>

                    <Seperator />

                    {/* Statistics Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                            <span>Game Statistics</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                                <StatisticHighlight
                                    title={account.nGamesPlayed.toString()}
                                    text="Games Played"
                                />
                            </div>
                            
                            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                                <StatisticHighlight
                                    title={account.highestScoreAchieved.toString()}
                                    text="Best Score"
                                />
                            </div>
                            
                            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                                <StatisticHighlight
                                    title={account.favouriteWord || "None"}
                                    text="Favorite Word"
                                />
                            </div>
                        </div>
                        
                        {account.nGamesPlayed === 0 && (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">
                                    No games played yet. Start your first game to see your statistics!
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    )
}