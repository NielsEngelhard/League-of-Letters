import { LetterState } from "@/features/word/word-models";
import { cva, VariantProps } from "class-variance-authority";

interface Props extends VariantProps<typeof KeyboardKeyVariants> {
    children: React.ReactElement;
    onClick: () => void;
    fixedWidth?: boolean;
    disabled?: boolean;
    letterState?: LetterState | undefined;
}

export const KeyboardKeyVariants = cva(
    "px-1.5 py-2 rounded-md flex items-center justify-center cursor-pointer font-semibold text-sm transition-all duration-200 border touch-manipulation active:scale-95",
    {
        variants: {
            variant: {
                neutral: "",
                primary: "bg-primary border-primary hover:opacity-90 text-white",
            }
        }
    }
)

export default function KeyboardKey({
    children, 
    onClick, 
    fixedWidth = true, 
    variant = "neutral",
    disabled = false,
    letterState = LetterState.Unguessed,
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
                return "bg-background-secondary border-gray-200 hover:bg-background-secondary/50";                                                
        }
    }

    return (
        <button
            className={`
                ${determineKeyClasses(letterState)}
                ${KeyboardKeyVariants({ variant })} 
                ${fixedWidth ? 'lg:w-7 lg:h-12 lg:min-w-[2.5rem] px-2 lg:px-0' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}