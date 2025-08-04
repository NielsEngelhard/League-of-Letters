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
        <div className={`flex flex-row gap-2`}>
            {letters.map((item, index) => (
                <div 
                    key={index}
                    className={showCorrectAnimation ? 'animate-tile-celebration' : ''}
                    style={{
                        animationDelay: showCorrectAnimation ? `${index * 100}ms` : '0ms'
                    }}
                >
                    {visibleTiles.includes(index)
                    ?
                    <LetterTile 
                        letter={item.letter} 
                        state={item.state}
                        animate={animate}
                    />
                    :
                    <LetterTile />               
                    }
                </div>
            ))}
            
            <style jsx>{`
                @keyframes tile-celebration {
                    0%, 100% {
                        transform: translateY(0) scale(1) rotateZ(0deg);
                    }
                    25% {
                        transform: translateY(-12px) scale(1.1) rotateZ(-2deg);
                    }
                    50% {
                        transform: translateY(-8px) scale(1.05) rotateZ(1deg);
                    }
                    75% {
                        transform: translateY(-4px) scale(1.02) rotateZ(-1deg);
                    }
                }
                
                .animate-tile-celebration {
                    animation: tile-celebration 0.8s ease-out;
                }
            `}</style>
        </div>
    );
}