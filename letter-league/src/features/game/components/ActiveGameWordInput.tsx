import LoadingDots from "@/components/ui/animation/LoadingDots";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/form/TextInput";
import CustomKeyboard from "@/components/ui/keyboard/CustomKeyboard";
import KeyboardColorExplanation from "@/components/ui/keyboard/KeyboardColorExplanation";
import { useProfile } from "@/features/user/profile-context";

interface Props {
    currentGuess: string;
    disabled?: boolean;
    wordLength: number;
    onChange: (value: string) => void;
    onEnter: () => void;
}

export default function WordInput({ currentGuess, onEnter, onChange, wordLength, disabled = false }: Props) {
    const { settings } = useProfile();

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        debugger;
        onChange(event.target.value);
    }

    function onKeyPress(keyboardKey: string) {
        if (currentGuess.length >= wordLength) return;

        onChange(currentGuess + keyboardKey);
    }

    function onKeyDelete() {
        if (currentGuess.length == 0) return;

        onChange(currentGuess.slice(0, -1));
    }    

    if (disabled) {
        return (
            <div className="w-full flex justify-center">
                <LoadingDots />
            </div>
        )
    }

    // Return correct input option
    if (settings.keyboardInput == "html-input") {
        return (
            <div className="w-full flex flex-col items-center">
                <TextInput
                    className="text-center"
                    onChange={onInputChange}
                    maxLength={wordLength}
                    placeholder="Type here ..."
                    centerText={true}
                />
                <Button className="mt-2 w-full" variant="secondary" size="sm" onClick={onEnter}>
                    Guess
                </Button>
            </div>                      
        )
    } else if (settings.keyboardInput == "keystroke") {
        return (
        <div>
            keystrokess
        </div>            
        )
    } else {
        return (
            <CustomKeyboard
                onKeyPress={onKeyPress}
                onDelete={onKeyDelete}
                onEnter={onEnter}
                // correctKeys={currentRound.guessedLetters.filter(l => l.state == LetterState.Correct && l.letter !== undefined).map(l => l.letter as string)}
                // warningKeys={currentRound.guessedLetters.filter(l => l.state == LetterState.Misplaced && l.letter !== undefined).map(l => l.letter as string)}
                // errorKeys={currentRound.guessedLetters.filter(l => l.state == LetterState.Wrong && l.letter !== undefined).map(l => l.letter as string)}
            />                        
        )
    }
} 