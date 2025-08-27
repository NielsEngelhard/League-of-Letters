import { LETTER_ANIMATION_TIME_MS } from "@/features/game/game-constants";
import LetterRow from "@/features/word/components/LetterRow";
import { EvaluatedLetter, LetterState } from "@/features/word/word-models";
import { useEffect, useState } from "react";

export default function WordsPlayingBlock({ words }: { words: string[] }) {
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [key, setKey] = useState(0); // Force re-render for animation

    useEffect(() => {
        const duration = (LETTER_ANIMATION_TIME_MS * currentWord.length) + 2000; // AnimationDuration + ShowWordALittleLonger
        
        const timeout = setTimeout(() => {
            nextWord();
        }, duration);

        return () => clearTimeout(timeout);
    }, [currentWord]);

    function nextWord() {
        const nextIndex = (currentWordIndex + 1) % words.length;
        setCurrentWordIndex(nextIndex);
        setCurrentWord(words[nextIndex]);
        setKey(prev => prev + 1);
    }

    return (
        <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl">
            <LetterRow
                key={key} // Forces component to re-mount and re-animate
                letters={currentWord.split('').map((letter, i) => ({ 
                    letter: letter, 
                    state: LetterState.Correct, 
                    position: i 
                })) as EvaluatedLetter[]}
                animate={true}
            />
        </div>   
    )
}