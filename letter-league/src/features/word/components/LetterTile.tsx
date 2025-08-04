import { cva, VariantProps } from "class-variance-authority";
import { LetterState } from "../word-models";

interface Props extends VariantProps<typeof variants> {
    state?: LetterState;
    letter?: string;
    animate?: boolean;
}

const variants = cva(
    "rounded-full items-center justify-center text-center",
    {
        variants: {
            variant: {
                default: "w-12 h-12 border-2 border-border text-lg",
                small: "w-8 h-8 text-sm"
            }
        }
    }
)

export default function LetterTile({ state, letter, animate = false, variant = "default" }: Props) {
    return (
        <div className={`${variants({ variant })} rounded-md flex items-center justify-center
             ${animate ? "animate-tile-entrance" : ""}         
             ${state == LetterState.Correct ? 'bg-success text-white' : ''}
             ${state == LetterState.Wrong ? 'bg-error text-white' : ''}
             ${state == LetterState.Misplaced ? 'bg-warning text-white' : ''}
             ${!state && !letter ? 'bg-border/30' : ''}
             ${!state && letter ? 'bg-primary/20 border-primary/40' : ''}`}>
            <span className="font-bold uppercase">{letter}</span>
        </div>
    )
}