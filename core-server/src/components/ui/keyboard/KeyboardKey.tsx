import { LetterState } from "@/features/word/word-models";
import { cva, VariantProps } from "class-variance-authority";

interface Props extends VariantProps<typeof KeyboardKeyVariants> {
    children: React.ReactElement;
    onClick: () => void;
    disabled?: boolean;
    letterState?: LetterState | undefined;
    triggerAnimation?: boolean;
    isSpecialKey?: boolean;
}

export const KeyboardKeyVariants = cva(
    "rounded-md flex items-center justify-center cursor-pointer font-semibold transition-all duration-200 border touch-manipulation active:scale-95",
    {
        variants: {
            variant: {
                neutral: "",
                primary: "bg-primary border-primary hover:bg-primary/90 text-white",
            }
        }
    }
)

export default function KeyboardKey({
    children, 
    onClick, 
    variant = "neutral",
    disabled = false,
    triggerAnimation = false,
    letterState = LetterState.Unguessed,
    isSpecialKey = false,
}: Props) {
    function determineKeyClasses(letterState: LetterState): string {
        switch (letterState) {
            case LetterState.Correct:
                return "!bg-success border-success hover:opacity-90 text-white";
            case LetterState.CompleteCorrect:
                return "!bg-gradient-to-r from-success via-emerald-300 via-green-400 to-success hover:opacity-90 text-white border-emerald-300 shadow-lg";
            case LetterState.Misplaced:
                return "bg-warning border-warning hover:opacity-90 text-white";
            case LetterState.Wrong:
                return "bg-error border-error hover:opacity-90 text-white";
            default:
                return "bg-background-secondary border-gray-200 hover:bg-background-secondary/90";                                                        
        }
    }

    // Dynamic sizing based on screen size and key type
    const getSizeClasses = () => {
        if (isSpecialKey) {
            // Special keys (ENTER, DELETE) get more space
            return "flex-grow-0 flex-shrink-0 basis-auto min-w-[3.5rem] sm:min-w-[4rem] md:min-w-[4.5rem] h-10 sm:h-12 md:h-14 px-2 text-xs sm:text-sm";
        } else {
            // Regular letter keys scale with available space
            return "flex-1 h-10 sm:h-12 md:h-13 min-w-0 text-sm sm:text-base md:text-lg";
        }
    };

    return (
        <button
            className={`
                ${determineKeyClasses(letterState)}
                ${KeyboardKeyVariants({ variant })} 
                ${getSizeClasses()}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg duration-100'}
                ${triggerAnimation ? '-translate-y-1 shadow-lg': ''}
            `}
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}