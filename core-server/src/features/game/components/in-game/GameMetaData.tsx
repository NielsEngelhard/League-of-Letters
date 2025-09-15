import React from 'react';
import { Settings, HelpCircle, Users } from 'lucide-react';
import { ActiveGameModel, GamePlayerModel } from '../../game-models';
import InGameTranslations from '@/features/i18n/translation-file-interfaces/InGameTranslations';
import InGamePlayerCard from './InGamePlayerCard';
import Card from '@/components/ui/card/Card';
import { ConnectionStatus } from '@/features/realtime/realtime-models';
import WebSocketStatusIndicator from '@/features/realtime/WebSocketStatusIndicator';
import Button from '@/components/ui/Button';

interface Props {
    players: GamePlayerModel[];
    game: ActiveGameModel;
    currentPlayerAccountId: string;
    t: InGameTranslations
    hostUsername?: string;
}

const formatDate = (date: Date) => {
  return date.toLocaleString('nl-NL', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function GameMetaData({ players, game, currentPlayerAccountId, t, hostUsername }: Props) {
  const gameInfoOverview: {key: string, value: string}[] = [
    { key: t.metaData.languageLabel, value: game.language},
    { key: t.metaData.modeLabel, value: game.gameMode},
    { key: t.metaData.createdLabel, value: formatDate(game.createdAt)},
    { key: t.metaData.hostLabel, value: hostUsername ?? "-"},
  ]  

  const gamePlayersCombinedConnectionStatus: ConnectionStatus = game.players.some(p => p.connectionStatus != "connected") ? "disconnected" : "connected";
  const playerCardHeight = determinePlayerCardHeight();
  
  function determinePlayerCardHeight(): "sm" | "md" | "lg" {
    if (players.length <= 2) {
      return "lg";
    }

    if (players.length <= 4) {
      "md"
    }

    return "sm";
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Players Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {players.length >= 2 && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users size={20} className="text-primary" />
              {t.board.players}
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <WebSocketStatusIndicator connectionStatus={gamePlayersCombinedConnectionStatus} showText={false} />
              {players.filter(p => p.connectionStatus === 'connected').length}/{players.length}
            </div>
          </div>            
        )}
        
        {/* Scrollable Players List */}
        <div className="overflow-y-auto flex-1 space-y-2 min-h-0">
          {players.map((player) => (
            <InGamePlayerCard
              key={player.accountId}                
              player={player}
              isCurrentTurn={player.accountId == currentPlayerAccountId}
              t={t}
              height={playerCardHeight}
            />
          ))}
        </div>
      </div>

      {/* Bottom Fixed Section */}
      <div className="mt-6 space-y-3 flex-shrink-0">
        {/* Game Info Section */}
        <Card className="p-3 rounded-lg border space-y-2 bg-background-secondary">
          {gameInfoOverview.map(item => {
            return (
            <div className="flex items-center justify-between text-sm font-medium text-foreground font-monos gap-2" key={item.key}>
              <span className="uppercase font-bold">{item.key}:</span>
              <span className="truncate uppercase">{item.value}</span>
            </div>
            )
          })}
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="muted" corners="square" className='col-span-1' size="sm">
            <Settings size={16} />
            {t.metaData.settingsBtn}
          </Button>
          <Button variant="primary" corners="square" className='col-span-1' size="sm">
            <HelpCircle size={16} />
            {t.metaData.scoringExplainedBtn}
          </Button>

          <Button size="sm" variant="error" className='col-span-2' corners="square">
            {t.metaData.leaveGameBtn}
          </Button>                        
        </div>
      </div>
    </div>
  );
}