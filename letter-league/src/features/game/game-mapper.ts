import { DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers, DbActiveGame } from "@/drizzle/schema";
import { ActiveGameModel, ActiveGameTeaserModel, GamePlayerModel, GameRoundModel } from "./game-models";
import { WordState } from "../word/word-models";

export class GameMapper {
    static ActiveGameToModel(game: DbActiveGameWithRoundsAndPlayers): ActiveGameModel {
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
            rounds: game.rounds.map((round) => {
                return GameMapper.GameRoundToModel(round, game.withStartingLetter);
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
        }
    }

    static GameRoundToModel(round: DbGameRound, showFirstLetter: boolean = true): GameRoundModel {
        return {
            id: round.id,
            roundNumber: round.roundNumber,
            currentGuessIndex: round.currentGuessIndex,            
            guesses: round.guesses,
            wordLength: round.wordLength,
            lastGuessUnixUtcTimestamp_InSeconds: round.lastGuessUnixUtcTimestamp_InSeconds ?? undefined,
            startingLetter: showFirstLetter ? round.word.strippedWord[0] : undefined,
            unguessedMisplacedLetters: this.FilterMisplacedLettersForCurrentWord(round.previouslyMisplacedLetters, round.word)
        }
    }

    static FilterMisplacedLettersForCurrentWord(allMisplacedLettersForThisRound: string[], currentWordState: WordState): string[] {
        const currentWordUngussedLetters = currentWordState.letterStates.filter(c => c.guessed == false).map(c => c.letter.toUpperCase());
        return allMisplacedLettersForThisRound.filter(letter => currentWordUngussedLetters.includes(letter.toUpperCase()));
    }
}
