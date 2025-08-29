import { Target, Trophy, Star } from "lucide-react";
import {     LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS,
    LETTER_MISPLACED_POINTS,
    LETTER_CORRECT_AFTER_MISPLACED_POINTS,
    WORD_GUESSED_POINTS,
    WORD_GUESSED_FIRST_TRY_BONUS_POINTS,
    WORD_GUESSED_SECOND_TRY_BONUS_POINTS } from "./score-constants";
import ScoreTranslations from "../i18n/translation-file-interfaces/ScoreTranslations";

interface Props {
    t: ScoreTranslations;
    variant?: 'default' | 'compact';
}

export default function ScoreBlock({ variant = 'default', t }: Props) {
    const scoringRules = [
        {
            icon: Target,
            category: t.letterScores.title,
            rules: [
                {
                    description: t.letterScores.allCorrect,
                    points: LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS,
                    color: "text-green-500"
                },
                {
                    description: t.letterScores.wrongPosition,
                    points: LETTER_MISPLACED_POINTS,
                    color: "text-amber-500"
                },
                {
                    description: t.letterScores.correctAfterMisplaced,
                    points: LETTER_CORRECT_AFTER_MISPLACED_POINTS,
                    color: "text-blue-500"
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
                    color: "text-primary"
                },
                {
                    description: t.wordGuessedScores.correctInFirstGuessBonus,
                    points: WORD_GUESSED_FIRST_TRY_BONUS_POINTS,
                    color: "text-yellow-500"
                },
                {
                    description: t.wordGuessedScores.correctInSecondGuessBonus,
                    points: WORD_GUESSED_SECOND_TRY_BONUS_POINTS,
                    color: "text-orange-500"
                }
            ]
        }
    ];

    if (variant === 'compact') {
        return (
            <div className="bg-background/50 border border-border/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Scoring System
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {scoringRules.map((category, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4 text-foreground-muted" />
                                <span className="font-semibold text-foreground/90">{category.category}</span>
                            </div>
                            <div className="space-y-1 ml-6">
                                {category.rules.map((rule, ruleIdx) => (
                                    <div key={ruleIdx} className="flex justify-between items-center">
                                        <span className="text-foreground-muted">{rule.description}</span>
                                        <span className={`font-bold ${rule.color}`}>+{rule.points}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background/30 border border-border/30 rounded-3xl p-8 space-y-6 backdrop-blur-sm">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {t.title}
                    </h2>
                </div>
                <p className="text-lg text-foreground-muted font-medium">
                    {t.description} 
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scoringRules.map((category, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <category.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground/90">
                                {category.category}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {category.rules.map((rule, ruleIdx) => (
                                <div key={ruleIdx} className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/20 hover:bg-background/60 transition-colors duration-200">
                                    <span className="text-foreground-muted font-medium">
                                        {rule.description}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xl font-bold ${rule.color}`}>
                                            +{rule.points}
                                        </span>
                                        <span className="text-xs text-foreground-muted/60">
                                            pts
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-4 border-t border-border/30">
                <p className="text-sm text-foreground-muted">
                    {t.proTip}
                </p>
            </div>
        </div>
    );
}