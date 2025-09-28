import { DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers, DbActiveGame, DbOnlineLobby } from "@/drizzle/schema";
import { ActiveGameModel, ActiveGameTeaserModel, GamePlayerModel, GameRoundModel } from "./game-models";
import { WordState } from "../word/word-models";
import { GameTimeOffsetTracker } from "./util/algorithm/time-offset/game-time-offset-tracker";

export class GameMapper {
    static ActiveGameToModel(game: DbActiveGameWithRoundsAndPlayers): ActiveGameModel {
        
        // Calculate time offset when it is a game with seconds per guess 
        if (game.nSecondsPerGuess) {
            const offset = GameTimeOffsetTracker.calculateForGame(game);
            if (offset != null) {
                game.currentRoundIndex = offset.actualRound;
                game.rounds.find(r => r.roundNumber = offset!.actualRound)!.currentGuessIndex = offset.actualGuess;
            }
        }

        return {
            id: game.id,
            currentRoundIndex: game.currentRoundIndex,
            totalRounds: game.nRounds,
            nGuessesPerRound: game.nGuessesPerRound,
            gameMode: game.gameMode,
            createdAt: game.createdAt,
            gameIsOver: game.gameIsOver,
            hostAccountId: game.hostAccountId,
            nSecondsPerGuess: game.nSecondsPerGuess,
            language: game.language,
            rounds: game.rounds.map((round) => {
                return GameMapper.GameRoundToModel(round, game.withStartingLetter, round.roundNumber < game.currentRoundIndex);
            }),
            players: game.players.map((player) => {
                return GameMapper.GamePlayerToModel(player, game.hostAccountId);
            }),
        }
    }

    static ActiveGameToTeaserModel(game: DbActiveGame): ActiveGameTeaserModel {
        return {
            id: game.id,
            currentRoundIndex: game.currentRoundIndex,
            totalRounds: game.nRounds,
            gameMode: game.gameMode,
            createdAt: game.createdAt,
            language: game.language,
            hostAccountId: game.hostAccountId,
            isLobby: false
        }        
    }

    static GamePlayerToModel(player: DbGamePlayer, hostUserId?: string): GamePlayerModel {
        return {
            accountId: player.accountId,
            score: player.score,
            username: player.username ?? "anonymous",            
            isHost: player.accountId == hostUserId,
            position: player.position,
            connectionStatus: player.connectionStatus,
            colorHex: player.colorHex
        }
    }

    static GameRoundToModel(round: DbGameRound, showFirstLetter: boolean = true, roundIsOver: boolean = false): GameRoundModel {
        return {
            id: round.id,
            roundNumber: round.roundNumber,
            currentGuessIndex: round.currentGuessIndex,            
            guesses: round.guesses,
            wordLength: round.wordLength,
            lastGuessUtcDate: round.lastGuessUtcDate ?? undefined,
            startingLetter: showFirstLetter ? round.word.strippedWord[0] : undefined,
            unguessedMisplacedLetters: this.FilterMisplacedLettersForCurrentWord(round.previouslyMisplacedLetters, round.word),
            word: roundIsOver ? round.word.originalWord : undefined
        }
    }

    static FilterMisplacedLettersForCurrentWord(allMisplacedLettersForThisRound: string[], currentWordState: WordState): string[] {
        const currentWordUngussedLetters = currentWordState.letterStates.filter(c => c.guessed == false).map(c => c.letter.toUpperCase());
        return allMisplacedLettersForThisRound.filter(letter => currentWordUngussedLetters.includes(letter.toUpperCase()));
    }

    static LobbyToActiveGameTeaserModel(lobby: DbOnlineLobby): ActiveGameTeaserModel {
        return {
            id: lobby.id,
            createdAt: lobby.createdAt,
            currentRoundIndex: 0,
            gameMode: "online",
            language: lobby.language,
            totalRounds: 0,
            isLobby: true,
            hostAccountId: lobby.hostAccountId
        }
    }
}
