import { Delete } from "lucide-react";
import KeyboardKey from "./KeyboardKey";
import KeyboardColorExplanation from "./KeyboardColorExplanation";
import { useAuth } from "@/features/auth/AuthContext";
import { LetterState } from "@/features/word/word-models";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

interface Props {
    onKeyPress: (key: string) => void;
    onDelete?: () => void;
    onEnter?: () => void;
    keyStates?: Map<string, LetterState>;
    t: GeneralTranslations;
    currentlyAnimatedKey?: string;
    disabled?: boolean;
}

export default function CustomKeyboard({ onKeyPress, onDelete, onEnter, keyStates, t, currentlyAnimatedKey, disabled = false }: Props) {
    const { settings } = useAuth();

    return (
    <>
        <div className="flex flex-col gap-1 sm:gap-2 items-center w-full max-w-2xl mx-auto">
            {keyboardRows.map((keyboardRow, rowIndex) => (
                <div className="flex flex-row gap-1 sm:gap-2 w-full justify-center" key={`kb-row-${rowIndex}`}>
                    
                    {/* ENTER Key - positioned at the beginning of the bottom row */}
                    {onEnter && rowIndex === keyboardRows.length - 1 && (
                        <KeyboardKey
                            key="kb-key-enter"
                            variant="primary"
                            onClick={onEnter}
                            triggerAnimation={currentlyAnimatedKey == "Enter"}
                            isSpecialKey={true}
                            disabled={disabled}
                        >
                            <div className="text-xs font-bold whitespace-nowrap">ENTER</div>
                        </KeyboardKey>
                    )}
                    
                    {/* Letters */}
                    {keyboardRow.map((keyboardKey, index) => (
                        <KeyboardKey
                            key={`kb-key-${index}`}
                            onClick={() => onKeyPress(keyboardKey)}
                            triggerAnimation={currentlyAnimatedKey?.toUpperCase() == keyboardKey}
                            letterState={keyStates?.get(keyboardKey.toUpperCase())}
                            disabled={disabled}
                        >
                            <>{keyboardKey}</>
                        </KeyboardKey>
                    ))}
                        
                    {/* Delete Key - positioned at the end of the bottom row */}
                    {onDelete && rowIndex === keyboardRows.length - 1 && (
                        <KeyboardKey
                            key="kb-key-delete"
                            variant="neutral"
                            onClick={onDelete}
                            triggerAnimation={currentlyAnimatedKey == "Backspace"}
                            isSpecialKey={true}
                            disabled={disabled}
                        >
                            <div className="flex items-center justify-center">
                                <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        </KeyboardKey>
                    )}
                    
                </div>
            ))}
        </div>
        {settings.showKeyboardHints == true && <KeyboardColorExplanation t={t} />}
    </>
    )
}