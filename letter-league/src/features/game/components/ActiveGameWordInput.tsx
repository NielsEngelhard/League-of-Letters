import LoadingDots from "@/components/ui/animation/LoadingDots";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/form/TextInput";
import CustomKeyboard from "@/components/ui/keyboard/CustomKeyboard";
import InvisibleKeyLogger from "@/components/ui/keyboard/InvisibleKeyLogger";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { useActiveGame } from "./active-game-context";
import { LetterState } from "@/features/word/word-models";

interface Props {
    currentGuess: string;
    disabled?: boolean;
    wordLength: number;
    onChange: (value: string) => void;
    onEnter: () => void;
}

export default function WordInput({ currentGuess, onEnter, onChange, wordLength, disabled = false }: Props) {
    const [keyStates, setKeyStates] = useState<Map<string, LetterState>>(new Map());
    
    const { settings } = useAuth();
    const { currentRound } = useActiveGame();

    // Reset when keyboard input methods changes
    useEffect(() => {
        onChange("");
    }, [settings.keyboardInput]);

    useEffect(() => {
        if (settings.keyboardInput != "on-screen-keyboard" || !currentRound) return;

        const keyStates = createKeyboardLetterStatesMapBasedOnPreviousGuesses();
        setKeyStates(keyStates);
        
    }, [settings.keyboardInput, currentRound?.guesses]);    

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
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

    function onKeyboardLog(event: KeyboardEvent) {
        if (event.key == 'Backspace') {
            onKeyDelete();
            return;
        }

        if (event.key == 'Enter') {
            onEnter();
            return;
        }

        if (event.key.length == 1) {
            onKeyPress(event.key);
        }
    }

    if (disabled) {
        return (
            <div className="w-full flex justify-center">
                <LoadingDots />
            </div>
        )
    }

    function createKeyboardLetterStatesMapBasedOnPreviousGuesses(): Map<string, LetterState> {
        const previousGuess = currentRound?.guesses;
        const startingLetter = currentRound?.startingLetter?.toUpperCase();

        const letterStateMap = new Map<string, LetterState>();

        if (startingLetter) {
            letterStateMap.set(startingLetter, LetterState.Correct);
        }

        previousGuess?.forEach((previousGuess) => {
            previousGuess.evaluatedLetters.forEach((evaluatedLetter => {
                const currentLetter = evaluatedLetter.letter.toUpperCase();
                
                if (evaluatedLetter.state == LetterState.Correct) {                    
                    if (letterStateMap.get(currentLetter)) return; // If already exists go on
                    letterStateMap.set(currentLetter, LetterState.Correct);
                } else if (evaluatedLetter.state == LetterState.Wrong) {
                    if (letterStateMap.get(currentLetter)) return; // If already exists go on
                    letterStateMap.set(currentLetter, LetterState.Wrong);
                } else if (evaluatedLetter.state == LetterState.Misplaced) {
                    // Replace as misplaced
                }
            }));
        });

        return letterStateMap;
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
            <div className="p-4 text-foreground/80 bg-background-secondary rounded border-2 border-dashed border-border font-semibold text-center">
                Type with your keyboard
            </div>            
            <InvisibleKeyLogger onKeyboardEvent={onKeyboardLog} />
        </div>            
        )
    } else {
        return (
            <CustomKeyboard
                onKeyPress={onKeyPress}
                onDelete={onKeyDelete}
                onEnter={onEnter}
                keyStates={keyStates}
            />                        
        )
    }
} 