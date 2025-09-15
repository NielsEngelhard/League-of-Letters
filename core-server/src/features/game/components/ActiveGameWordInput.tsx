import LoadingDots from "@/components/ui/animation/LoadingDots";
import CustomKeyboard from "@/components/ui/keyboard/CustomKeyboard";
import KeyboardKeyLogger from "@/components/ui/keyboard/KeyboardKeyLogger";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { useActiveGame } from "./active-game-context";
import { LetterState } from "@/features/word/word-models";
import { preFillWordFinder } from "@/features/word/util/prefill-word-finder";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { mapLetterColors } from "@/features/word/util/letter-color-map";

interface Props {
    disabled?: boolean;
    t: GeneralTranslations;
    onSubmitFailed?: () => void;
}

export default function WordInput({ t, onSubmitFailed, disabled = false }: Props) {
    const [keyStates, setKeyStates] = useState<Map<string, LetterState>>(new Map());
    const [currentAnimatedKey, setCurrentAnimatedKey] = useState<string>("");
    
    const { settings } = useAuth();
    const { currentRound, setCurrentGuess, submitGuess } = useActiveGame();
    const [prefilledGuess, setPrefilledGuess] = useState<string>("");

    // Prefill guess
    useEffect(() => {
        if (settings.preFillGuess && settings.preFillGuess == true) {
            preFillGuess();
        } else {
            setCurrentGuess("");
            setPrefilledGuess("");
        }
    }, [settings.preFillGuess, currentRound?.currentGuessIndex]);

    // Update key states on keyboard
    useEffect(() => {
        if (!currentRound) return;

        if (settings.showKeyboardHints == false) {
            setKeyStates(new Map());
            return;
        }

        const keyStates = mapLetterColors(currentRound.guesses, currentRound.unguessedMisplacedLetters, currentRound.startingLetter, !settings.showCompleteCorrect);
        setKeyStates(keyStates);
        
    }, [settings.showCompleteCorrect, settings.showKeyboardHints, currentRound]);

    function onKeyPress(keyboardKey: string) {
        if (isValidInput(keyboardKey) == false) {
            return;
        }

        setCurrentGuess(prev => {
            if (prev.length >= (currentRound?.wordLength ?? 1)) return prev;

            return prev + keyboardKey;
        });        
    }

    function onKeyDelete() {
        setCurrentGuess(prev => {
            if (prev.length <= 0) return "";

            return  prev.slice(0, -1);
        });
    }

    function onKeyboardLog(event: KeyboardEvent) {
        setCurrentAnimatedKey(event.key);

        if (event.key == 'Backspace') {
            onKeyDelete();
            return;
        }

        if (event.key == 'Enter') {
            onSubmit();
            return;
        }

        if (event.key.length == 1) {
            onKeyPress(event.key);
            return;
        }
    }

    async function onSubmit() {
        const successfullSubmit = await submitGuess();

        if (!successfullSubmit && onSubmitFailed) {
            onSubmitFailed();
        }
    }

    function preFillGuess() {
        if (!currentRound) return;

        let prefilledWord = preFillWordFinder(currentRound?.guesses);

        if (!prefilledWord || prefilledWord.length <= 0) {
            prefilledWord = currentRound?.startingLetter ?? "";
        }

        setCurrentGuess(prefilledWord);
        setPrefilledGuess(prefilledWord);
    }

    function isValidInput(input: string): boolean {
        return /^[A-Za-z]$/.test(input);
    }

    if (disabled) {
        return (
            <div className="w-full flex justify-center">
                <LoadingDots />
            </div>
        )
    } else {
        return (
            <>
                <CustomKeyboard
                    onKeyPress={onKeyPress}
                    onDelete={onKeyDelete}
                    onEnter={onSubmit}
                    keyStates={keyStates}
                    currentlyAnimatedKey={currentAnimatedKey}
                    t={t}
                />
                
                {/* Also log keyboard keys as input */}
                <KeyboardKeyLogger onKeyboardEvent={onKeyboardLog} />
            </>
        )
    }
} 