"use client"

import { EvaluatedLetter, LetterState } from "../word-models";
import LetterTile from "./LetterTile";
import { useEffect, useState } from "react";

interface Props {
    letters: EvaluatedLetter[];
    animate?: boolean;
}

export default function LetterRow({ letters, animate = false }: Props) {
    const [visibleTiles, setVisibleTiles] = useState<number[]>([]);
    const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
    const allCorrect = letters.find(l => l.state != LetterState.Correct) == undefined;
    
    useEffect(() => {
        if (!animate) {
            // If not animating, show all tiles immediately
            setVisibleTiles(Array.from({ length: letters.length }, (_, i) => i));
            return;
        }
        
        // Reset visible tiles when animation starts
        setVisibleTiles([]);
        
        // Reveal tiles one by one with 300ms delay
        letters.forEach((_, index) => {
            setTimeout(() => {
                setVisibleTiles(prev => [...prev, index]);

                if (allCorrect && index == letters.length-1) {
                    triggerAllCorrectAnimation();
                }
            }, index * 300);
        });
    }, [animate, letters.length]);

    function triggerAllCorrectAnimation() {
        setTimeout(() => {
            setShowCorrectAnimation(true);
        }, 200);
    }

    return (
        <div className="flex flex-row gap-2">
            {letters.map((item, index) => (
                visibleTiles.includes(index)
                ?
                <LetterTile 
                    key={index} 
                    letter={item.letter} 
                    state={item.state}
                    correctAnimation={showCorrectAnimation}
                />
                :
                <LetterTile 
                    key={index} 
                />               
            ))}
        </div>
    );
}