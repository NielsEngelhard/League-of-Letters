import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import Seperator from "@/components/ui/Seperator";
import StatisticHighlight from "@/components/ui/StatisticHighlight";
import { useAuth } from "@/features/auth/AuthContext";
import { Calendar1, User } from "lucide-react";

interface Props {

}

export default function AccountCard({  }: Props) {
    const { account } = useAuth();

    const getInitials = (name: string) => {
        return name?.charAt(0).toUpperCase() || "?";
    };

    return (
        account && (
            <Card>
                <CardHeader className="pb-3 sm:pb-4 justify-between flex flex-row">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex flex-row items-center gap-2">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                            <span className="font-bold text-xl text-background">{getInitials(account.username)}</span>
                        </div>

                        {/* info */}
                        <div className="flex flex-col">
                            <span className="font-bold">{account.username}</span>
                            {account.isGuest == true ? (
                                <span className="text-sm text-secondary">Guest account</span>
                            ): (
                                <>
                                <span className="text-sm text-primary">User account</span>
                                    <span className="text-xs text-foreground-muted flex gap-0.5 items-center font-medium">
                                        <Calendar1 className="w-3 h-3 font-medium" />
                                        {account.createdAt.toString()}
                                    </span>                                    
                                </>
                            )}
                        </div>                    
                    </div>

                    <Seperator />

                    {/* Stats */}
                    <div className="w-full flex justify-between">
                        <StatisticHighlight
                            title={account.nGamesPlayed.toString()}
                            text="Games Played"
                        />
                        <StatisticHighlight
                            title={account.highestScoreAchieved.toString()}
                            text="Best Score"
                        />
                        <StatisticHighlight
                            title={account.favouriteWord}
                            text="Favourite word"
                        />                                        
                    </div>
                </CardContent>
            </Card>
        )
    )
}