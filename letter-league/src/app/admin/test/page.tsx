"use client"

import PageBase from "@/components/layout/PageBase";
import Avatar from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import Seperator from "@/components/ui/Seperator";
import PlayersList from "@/features/game/components/PlayersList";
import { GamePlayerModel } from "@/features/game/game-models";
import { Clock, Crown, User } from "lucide-react";

// Mock data for joined lobby
const mockPlayers: GamePlayerModel[] = [
  { id: '1', username: 'Alice', isHost: true, connectionStatus: "connected", score: 0 },
  { id: '2', username: 'Bob', isHost: false, connectionStatus: "connected", score: 0 },
  { id: '3', username: 'You', isHost: false, connectionStatus: "connected", score: 0 },
  { id: '4', username: 'Charlie', isHost: false, connectionStatus: "connected", score: 0 },
];

const mockGameSettings = {
  gameId: 'WORD-2024',
  maxPlayers: 4,
  timeLimit: 180,
  isPrivate: false
};

const JoinedLobby = () => {
  const hostName = mockPlayers.find(p => p.isHost)?.username || 'Host';

  const handleLeave = () => {
    // navigate('/multiplayer');
  };

  return (
    <PageBase>
        <div className="min-h-screen bg-background">
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-2xl mx-auto">
            
            {/* Game Status Card */}
            <Card className="border-success/20 bg-success/5">
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-success">
                <Clock className="w-5 h-5" />
                Successfully Joined!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <p className="text-sm sm:text-base">
                    You've joined <span className="font-semibold">{hostName}'s</span> game
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Game ID: <span className="font-mono">{mockGameSettings.gameId}</span>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Waiting for {hostName} to start the game...
                </p>
                </div>
            </CardContent>
            </Card>

            {/* Players List */}
            <Card>
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                Players ({mockPlayers.length}/{mockGameSettings.maxPlayers})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
                <PlayersList players={mockPlayers} />
            </CardContent>
            </Card>

            {/* Game Settings Info */}
            <Card>
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Game Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                    <span className="text-muted-foreground">Max Players:</span>
                    <div className="font-medium">{mockGameSettings.maxPlayers}</div>
                </div>
                <div>
                    <span className="text-muted-foreground">Time Limit:</span>
                    <div className="font-medium">{mockGameSettings.timeLimit}s</div>
                </div>
                <div>
                    <span className="text-muted-foreground">Game Type:</span>
                    <div className="font-medium">
                    {mockGameSettings.isPrivate ? "Private" : "Public"}
                    </div>
                </div>
                <div>
                    <span className="text-muted-foreground">Ready Players:</span>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Status Message */}
            <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm sm:text-base font-medium">
                Ready and waiting...
                </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                You're all set! The game will start automatically when {hostName} begins the match.
            </p>
            </div>

            {/* Leave Game Button */}
            <Button
            variant="skeleton"
            onClick={handleLeave}
            className="w-full h-10 sm:h-12 text-sm sm:text-base"
            >
            Leave Game
            </Button>
        </div>
        </div>
    </PageBase>
  );
};

export default JoinedLobby;