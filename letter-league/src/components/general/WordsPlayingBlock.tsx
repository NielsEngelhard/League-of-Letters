import LetterRow from "@/features/word/components/LetterRow";
import { EvaluatedLetter, LetterState } from "@/features/word/word-models";

export default function WordsPlayingBlock() {
    const teaserWord = "skills";

    return (
        <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl">
            <LetterRow
                letters={teaserWord.split('').map((letter, i) => ({ 
                    letter: letter, 
                    state: LetterState.Correct, 
                    position: i 
                })) as EvaluatedLetter[]}
                animate={true}
            />
        </div>   
    )
}