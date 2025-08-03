import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/form/TextInput";
import { useActiveGame } from "./active-game-context";
import CustomKeyboard from "@/components/ui/keyboard/CustomKeyboard";
import KeyboardColorExplanation from "@/components/ui/keyboard/KeyboardColorExplanation";

interface Props {
    currentGuess: string;
    theWord?: string | undefined | null;
    disabled?: boolean;
    maxLength: number;
    onChange: (value: string) => void;
    onEnter: () => void;
}

export default function WordInput({ theWord, currentGuess, onEnter, onChange, maxLength, disabled = false }: Props) {
    const { activeGame } = useActiveGame();

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value);
    }

    function onKeyPress(keyboardKey: string) {
        if (currentGuess.length >= activeGame.wordLength) return;

        onChange(currentGuess + keyboardKey);
    }

    function onKeyDelete() {
        if (currentGuess.length == 0) return;

        onChange(currentGuess.slice(0, -1));
    }    

    return (
        theWord
        ?
        <div>{theWord}</div>
        :
        true
        ?
            <div>
                <CustomKeyboard
                    onKeyPress={onKeyPress}
                    onDelete={onKeyDelete}
                    onEnter={onEnter}
                    // correctKeys={currentRound.guessedLetters.filter(l => l.state == LetterState.Correct && l.letter !== undefined).map(l => l.letter as string)}
                    // warningKeys={currentRound.guessedLetters.filter(l => l.state == LetterState.Misplaced && l.letter !== undefined).map(l => l.letter as string)}
                    // errorKeys={currentRound.guessedLetters.filter(l => l.state == LetterState.Wrong && l.letter !== undefined).map(l => l.letter as string)}
                />
                <KeyboardColorExplanation />
            </div>
        :
        <div className="w-full lg:px-10 gap-2 flex flex-col">
            <TextInput
                disabled={disabled}
                value={currentGuess}
                maxLength={maxLength}
                centerText={true}
                className="!font-monos flex items-center"
                placeholder="Enter your guess ..."
                supportedSymbols={/^[a-zA-Z]$/}
                onChange={onInputChange}
            />

            <Button className="w-full" onClick={onEnter} disabled={disabled} variant="primary">Guess</Button>
        </div>   
    )
} 