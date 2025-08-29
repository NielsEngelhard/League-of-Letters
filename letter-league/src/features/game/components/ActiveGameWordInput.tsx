import LoadingDots from "@/components/ui/animation/LoadingDots";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/form/TextInput";
import CustomKeyboard from "@/components/ui/keyboard/CustomKeyboard";
import InvisibleKeyLogger from "@/components/ui/keyboard/InvisibleKeyLogger";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { useActiveGame } from "./active-game-context";
import { LetterState } from "@/features/word/word-models";
import { mapLetterColors } from "@/features/word/util/letter-color-map";
import { preFillWordFinder } from "@/features/word/util/prefill-word-finder";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    disabled?: boolean;
    onChange: (value: string) => void;
    onEnter: () => void;
    t: GeneralTranslations;
}

export default function WordInput({ onEnter, onChange, t, disabled = false }: Props) {
    const [keyStates, setKeyStates] = useState<Map<string, LetterState>>(new Map());
    
    const { settings } = useAuth();
    const { currentRound, currentGuess, setCurrentGuess } = useActiveGame();
    const [prefilledGuess, setPrefilledGuess] = useState<string>("");

    // Reset when keyboard input methods changes
    useEffect(() => {
        onChange("");
    }, [settings.keyboardInput]);

    useEffect(() => {
        if (settings.preFillGuess && settings.preFillGuess == true) {
            preFillGuess();
        } else {
            setCurrentGuess("");
            setPrefilledGuess("");
        }
    }, [settings.preFillGuess, currentRound?.currentGuessIndex]);

    useEffect(() => {
        if (settings.keyboardInput != "on-screen-keyboard" || !currentRound) return;

        const keyStates = mapLetterColors(currentRound.guesses, currentRound.unguessedMisplacedLetters, currentRound.startingLetter, !settings.showCompleteCorrect);
        setKeyStates(keyStates);
        
    }, [settings.keyboardInput, settings.showCompleteCorrect, currentRound]);    

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value);
    }

    function onKeyPress(keyboardKey: string) {
        if (currentGuess.length >= (currentRound?.wordLength ?? 1)) return;

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

    function preFillGuess() {
        if (!currentRound) return;

        var prefilledWord = preFillWordFinder(currentRound?.guesses);

        if (!prefilledWord || prefilledWord.length <= 0) {
            prefilledWord = currentRound?.startingLetter ?? "";
        }

        setCurrentGuess(prefilledWord);
        setPrefilledGuess(prefilledWord);
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
                    key={`ti-${settings.preFillGuess}`}
                    className="text-center"
                    onChange={onInputChange}
                    maxLength={currentRound?.wordLength ?? 0}
                    placeholder="Type here ..."
                    centerText={true}
                    initialValue={settings.preFillGuess ? prefilledGuess : ""}
                    autoFocus={true}
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
                t={t}
            />                        
        )
    }
} 