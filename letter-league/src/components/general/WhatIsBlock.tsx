import { APP_NAME } from "@/app/global-constants";
import Card from "../ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "../ui/card/card-children";

export default function WhatIsBlock() {
    return (
        <div className="text-center space-y-12">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border shadow-xl bg-gradient-to-br from-background to-background-secondary">
                <CardHeader className="pb-6">
                    <CardTitle className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text text-transparent">
                        What is {APP_NAME}?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-lg leading-relaxed">
                    <p className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                        The word-guessing game that'll crack your brain before you crack the code
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <p className="text-foreground">
                                    Modern word-guessing experience with strategic thinking
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                <p className="text-foreground">
                                    Challenge yourself with linguistic intuition puzzles
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                <p className="text-foreground">
                                    Play solo or battle friends online
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                                <p className="text-foreground">
                                    Push your vocabulary to its absolute limits
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>        
    )
}