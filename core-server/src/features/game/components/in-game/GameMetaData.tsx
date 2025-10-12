import React, { useState } from 'react';
import { Settings, HelpCircle, Users, MoveLeft } from 'lucide-react';
import { ActiveGameModel, GamePlayerModel } from '../../game-models';
import InGameTranslations from '@/features/i18n/translation-file-interfaces/InGameTranslations';
import Card from '@/components/ui/card/Card';
import { ConnectionStatus } from '@/features/realtime/realtime-models';
import WebSocketStatusIndicator from '@/features/realtime/WebSocketStatusIndicator';
import Button from '@/components/ui/Button';
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from '@/app/routes';
import { SupportedLanguage } from '@/features/i18n/languages';
import Link from 'next/link';
import ScoreBlock from '@/features/score/ScoreBlock';
import ScoreTranslations from '@/features/i18n/translation-file-interfaces/ScoreTranslations';
import SidePopup from '@/components/ui/SidePopup';
import SettingsForm from '@/features/account/components/SettingsForm';
import { SettingsTranslations } from '@/features/i18n/translation-file-interfaces/SettingsTranslations';
import PlayerGrid from './PlayersGrid';
import PreviousRoundWords from './PreviousRoundWords';

interface Props {
    sortedPlayers: GamePlayerModel[];
    game: ActiveGameModel;
    hostUsername?: string;
    lang: SupportedLanguage;
    currentPlayerAccountId?: string;

    inGameTranslations: InGameTranslations
    scoreTranslations: ScoreTranslations;
    settingsTranslations: SettingsTranslations;
}

const formatDate = (date: Date) => {
  return date.toLocaleString('nl-NL', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function GameMetaData({ sortedPlayers, game, inGameTranslations, hostUsername, lang, scoreTranslations, settingsTranslations, currentPlayerAccountId }: Props) {
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const gameInfoOverview: {key: string, value: string}[] = [
    { key: inGameTranslations.metaData.languageLabel, value: game.language},
    { key: inGameTranslations.metaData.modeLabel, value: game.gameMode},
    { key: inGameTranslations.metaData.createdLabel, value: formatDate(game.createdAt)},
    { key: inGameTranslations.metaData.hostLabel, value: hostUsername ?? "-"},
  ]  

  const gamePlayersCombinedConnectionStatus: ConnectionStatus = game.players.some(p => p.connectionStatus != "connected") ? "disconnected" : "connected";
  
  return (
    <div className="p-2 md:p-6 h-full flex flex-col w-full">
      {/* Players Section */}
      <div className="flex-col flex-1 min-h-0 flex">
        {sortedPlayers.length >= 2 && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users size={20} className="text-primary" />
              {inGameTranslations.board.players}
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <WebSocketStatusIndicator connectionStatus={gamePlayersCombinedConnectionStatus} showText={false} />
              {sortedPlayers.filter(p => p.connectionStatus === 'connected').length}/{sortedPlayers.length}
            </div>
          </div>            
        )}
        
        {/* Scrollable Players List */}
        <div className="overflow-y-auto flex-1 space-y-2 min-h-0">
          <PlayerGrid
            players={sortedPlayers}
            hostAccountId={game.hostAccountId}
            includeKickOption={false}
            gameId={game.id}
            t={inGameTranslations}
            accountIdCurrentPlayer={currentPlayerAccountId}
          />
        </div>
      </div>

      {/* Bottom Fixed Section */}
      <div className="mt-6 space-y-3 flex-shrink-0">
        {/* Previous words */}
        <PreviousRoundWords />

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
          <Button variant="muted" corners="square" className='col-span-1' size="sm" onClick={() => setShowSettings(prev => !prev)}>
            <Settings size={16} />
            {inGameTranslations.metaData.settingsBtn}
          </Button>
          
          <Button variant="primaryLight" corners="square" className='col-span-1' size="sm" onClick={() => setShowScoreExplanation(prev => !prev)}>
            <HelpCircle size={16} />
            {inGameTranslations.metaData.scoringExplainedBtn}
          </Button>

          <Link className='col-span-2' href={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)}>
            <Button size="sm" variant="errorLight" className='w-full' corners="square" >
              <MoveLeft size={16} />
              {inGameTranslations.metaData.leaveGameBtn}
            </Button>          
          </Link>
        </div>
      </div>

      {showScoreExplanation && (
        <SidePopup title={scoreTranslations.title} onClose={() => setShowScoreExplanation(false)}>
          <ScoreBlock t={scoreTranslations} />
        </SidePopup>
      )}

      {showSettings && (
        <SidePopup title={settingsTranslations.settings.title} onClose={() => setShowSettings(false)}>
          <SettingsForm t={settingsTranslations} />
        </SidePopup>
      )}      
    </div>
  );
}