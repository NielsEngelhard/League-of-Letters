"use client"

import PageBase from "@/components/layout/PageBase"
import { APP_NAME } from "../global-constants"
import LetterRow from "@/features/word/components/LetterRow"
import { EvaluatedLetter, LetterState } from "@/features/word/word-models";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import Button from "@/components/ui/Button";
import { PICK_GAME_MODE_ROUTE } from "../routes";
import { supportedLanguages } from "@/features/i18n/languages";

export default function AboutPage() {
    const teaserWord = "skills";
    
    return (
        <PageBase requiresAuh={false}>
            <div className="flex flex-col gap-10 items-center">
                {/* Intro block */}
                <div className="text-center w-full">
                    <div>
                        <h1 className="text-xl text-primary">{APP_NAME}</h1>
                        <p>
                            Come play a cheeky game of word play! Ready to destroy your confidence?
                        </p>                        
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-row">
                        <div>
                            <Button href={PICK_GAME_MODE_ROUTE}>
                                Play for Free!
                            </Button>
                        </div>


                    </div>
                </div>

                {/* Teaser of how a game is played */}
                <div>
                    <LetterRow
                        letters={teaserWord.split('').map((letter, i) => ({ letter: letter, state: LetterState.Correct, position: i })) as EvaluatedLetter[]}
                        animate={true}
                    />
                </div>

                {/* About */}
                <Card>
                    <CardHeader>
                        <CardTitle>What is {APP_NAME}?</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 text-foreground-muted">
                        <p>The word-guessing game that'll crack your brain before you crack the code</p>
                        <p>
                            Letter-league is a modern word-guessing game. Challenge yourself to decode mystery words using strategic thinking and linguistic intuition. Each guess reveals clues about letter positions, pushing your vocabulary to its limits.                            
                        </p>

                        <p>You can play solo or have fun and play with friends in an online game where you battle each other.</p>
                    </CardContent>
                </Card>

                {/* Language Statistics */}
                <div>
                    <h2>Word Arsenal</h2>
                    <p>
                        Hundreds of thousands of words across multiple languages
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3">
                        {supportedLanguages.map((language) => {
                            return (
                                <Card key={language}>
                                    <CardContent className="flex flex-col gap-2 p-6">
                                        <div className="font-bold mb-2">{language}</div>

                                        <div className="flex flex-col">
                                            <span>100000</span>
                                            <span className="text-sm text-foreground-muted">unique words</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}                        
                    </div>
                </div>
            </div>
        </PageBase>
    )
}