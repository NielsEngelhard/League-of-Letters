import { Delete, Send } from "lucide-react";
import KeyboardKey from "./KeyboardKey";
import KeyboardColorExplanation from "./KeyboardColorExplanation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useActiveGame } from "@/features/game/components/active-game-context";
import { LetterState } from "@/features/word/word-models";

const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

interface Props {
    onKeyPress: (key: string) => void;
    onDelete?: () => void;
    onEnter?: () => void;
}

export default function CustomKeyboard({ onKeyPress, onDelete, onEnter }: Props) {
    const { settings } = useAuth();
    const { currentRound } = useActiveGame();

    function determineKeyVariant(keyboardKey: string): "neutral" | "success" | "warning" | "error" | null | undefined {
        if (!settings.showKeyboardHints) return "neutral";

        const keyboardKeyLetterStates = currentRound?.guessedLetters.filter(l => l.letter == keyboardKey);

        if (!keyboardKeyLetterStates || keyboardKeyLetterStates.length == 0) return "neutral";

        // Completely wrong
        const isCompletelyWrong = keyboardKeyLetterStates.some(ls => ls.state != LetterState.Wrong) == false;
        if (isCompletelyWrong) return "error";

        // Completely correct
        const isCompletelyCorrect = keyboardKeyLetterStates.some(ls => ls.state != LetterState.Correct) == false;
        if (isCompletelyCorrect) return "success";

        // First misplaced, then wrong -> means success (Sounds weird at first, but it is true) - scenario means that it does not occur anymore
        const wasMisplacedButNotOccurAnymore = keyboardKeyLetterStates.some(ls => ls.state == LetterState.Misplaced) && keyboardKeyLetterStates.some(ls => ls.state == LetterState.Wrong);
        if (wasMisplacedButNotOccurAnymore) {
            return "success";
        }
        
        // Still misplaced
        return "warning";
    }

    return (
    <>
        <div className="flex flex-col gap-1.5 lg:gap-2.5 items-center w-full">
            {keyboardRows.map((keyboardRow, rowIndex) => (
                <div className="flex flex-row gap-1.5 lg:gap-2.5" key={`kb-row-${rowIndex}`}>

                    {/* ENTER Key - positioned at the beginning of the bottom row */}
                    {onEnter && rowIndex === keyboardRows.length - 1 && (
                        <KeyboardKey
                        
                            key="kb-key-enter"
                            variant="primary"
                            fixedWidth={false}
                            onClick={onEnter}
                        >
                            <div className="px-2 text-xs font-bold">ENTER</div>
                        </KeyboardKey>
                    )}

                    {/* Letters */}
                    {keyboardRow.map((keyboardKey, index) => (
                        <KeyboardKey
                            key={`kb-key-${index}`}
                            onClick={() => onKeyPress(keyboardKey)}
                            variant={determineKeyVariant(keyboardKey)}>           
                            <>{keyboardKey}</>
                        </KeyboardKey>             
                    ))}     

                    {/* Delete Key - positioned at the end of the bottom row */}
                    {onDelete && rowIndex === keyboardRows.length - 1 && (
                        <KeyboardKey
                            key="kb-key-delete"
                            variant="neutral"
                            fixedWidth={false}
                            onClick={onDelete}
                        >
                            <div className="px-2">
                                <Delete size={18} />
                            </div>
                        </KeyboardKey>
                    )}                     
                </div>
            ))}
        </div>
        {settings.showKeyboardHints == true && <KeyboardColorExplanation />}
    </>
    )
}