import React from 'react';
import { Settings, HelpCircle, Users } from 'lucide-react';
import { ActiveGameModel, GamePlayerModel } from '../../game-models';
import WebSocketStatusIndicator from '@/features/realtime/WebSocketStatusIndicator';
import InGameTranslations from '@/features/i18n/translation-file-interfaces/InGameTranslations';
import InGamePlayerCard from './InGamePlayerCard';

interface Props {
    players: GamePlayerModel[];
    game: ActiveGameModel;
    currentPlayerAccountId: string;
    t: InGameTranslations
}

const gameConfig: [{
  WIP
}]

export default function GameMetaData({ players, game, currentPlayerAccountId, t }: Props) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('nl-NL', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
      <div className="p-6 space-y-6 h-full flex flex-col">
        
        {/* Players Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users size={20} className="text-primary" />
              {t.board.players}
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <div className="w-2 h-2 bg-success rounded-full" />
              {players.filter(p => p.connectionStatus === 'connected').length}/{players.length}
            </div>
          </div>
          
          <div className="space-y-2">
            {players.map((player) => (
              <InGamePlayerCard
                key={player.accountId}                
                player={player}
                isCurrentPlayer={player.accountId == currentPlayerAccountId}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* Game Info Section */}
        <div className="space-y-4">

          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Created</span>
              <span className="text-sm text-gray-900 font-medium">{formatDate(game.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Game Mode</span>
              <span className="text-sm text-gray-900 font-medium">{game.gameMode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Language</span>
              <span className="text-sm text-gray-900 font-medium">{game.language}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700"
              >
                <Settings size={16} />
                Settings
              </button>
            </div>
            
            <div className="relative">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg transition-colors duration-200 text-sm font-medium text-blue-700"
              >
                <HelpCircle size={16} />
                Scoring
              </button>
            </div>
          </div>
          
          <button className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg transition-colors duration-200 text-sm font-medium text-red-700">
            Leave Game
          </button>
        </div>
      </div>
  );
}