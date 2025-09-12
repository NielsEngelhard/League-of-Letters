import { Target, Trophy, Star } from "lucide-react";
import {     
    LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS,
    LETTER_MISPLACED_POINTS,
    LETTER_CORRECT_AFTER_MISPLACED_POINTS,
    WORD_GUESSED_POINTS,
    WORD_GUESSED_FIRST_TRY_BONUS_POINTS,
    WORD_GUESSED_SECOND_TRY_BONUS_POINTS 
} from "./score-constants";
import ScoreTranslations from "../i18n/translation-file-interfaces/ScoreTranslations";

interface Props {
    t: ScoreTranslations;
}

export default function ScoreBlock({ t }: Props) {
    const scoringRules = [
        {
            icon: Target,
            category: t.letterScores.title,
            rules: [
                {
                    description: t.letterScores.allCorrect,
                    points: LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS,
                    color: "text-success"
                },
                {
                    description: t.letterScores.wrongPosition,
                    points: LETTER_MISPLACED_POINTS,
                    color: "text-warning"
                },
                {
                    description: t.letterScores.correctAfterMisplaced,
                    points: LETTER_CORRECT_AFTER_MISPLACED_POINTS,
                    color: "text-primary"
                }
            ]
        },
        {
            icon: Trophy,
            category: t.wordGuessedScores.title,
            rules: [
                {
                    description: t.wordGuessedScores.correctGuess,
                    points: WORD_GUESSED_POINTS,
                    color: "text-secondary"
                },
                {
                    description: t.wordGuessedScores.correctInFirstGuessBonus,
                    points: WORD_GUESSED_FIRST_TRY_BONUS_POINTS,
                    color: "text-success"
                },
                {
                    description: t.wordGuessedScores.correctInSecondGuessBonus,
                    points: WORD_GUESSED_SECOND_TRY_BONUS_POINTS,
                    color: "text-warning"
                }
            ]
        }
    ];

    return (
        <div className="bg-background/50 border border-border/50 rounded-2xl p-6 space-y-3">
            <div className="space-y-3">
                {scoringRules.map((category, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/30">
                            <category.icon className="w-4 h-4 text-foreground/60" />
                            <span className="font-medium text-foreground/90 text-sm">{category.category}</span>
                        </div>
                        
                        <div className="space-y-1">
                            {category.rules.map((rule, ruleIdx) => (
                                <div key={ruleIdx} className="flex items-start justify-between gap-4 py-2">
                                    <span className="text-sm text-foreground/70 leading-relaxed flex-1">
                                        {rule.description}
                                    </span>
                                    <span className={`font-semibold text-sm ${rule.color} whitespace-nowrap`}>
                                        +{rule.points}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {t.proTip && (
                <div className="pt-4 border-t border-border/30">
                    <p className="text-xs text-foreground/60 italic">
                        {t.proTip}
                    </p>
                </div>
            )}
        </div>
    );
}