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
}

export default function CustomKeyboard({ onKeyPress, onDelete, onEnter, keyStates, t }: Props) {
    const { settings } = useAuth();

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
                            letterState={keyStates?.get(keyboardKey.toUpperCase())}>
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
        {settings.showKeyboardHints == true && <KeyboardColorExplanation t={t} />}
    </>
    )
}