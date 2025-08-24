import { APP_NAME } from "@/app/global-constants";

export default function WhatIsBlock() {
    const uspCards = [
        {
            title: "Strategic Gameplay",
            description: "Think beyond guessing. Every move is a calculated decision in this mind-bending word challenge.",
            icon: "🧠",
            gradient: "from-primary to-primary/60"
        },
        {
            title: "Social Competition",
            description: "Battle friends or climb global leaderboards. Turn vocabulary into victory.",
            icon: "⚡",
            gradient: "from-secondary to-secondary/60"
        },
        {
            title: "Endless Challenge",
            description: "Push your linguistic limits with puzzles that adapt and evolve with your skills.",
            icon: "🎯",
            gradient: "from-accent to-accent/60"
        }
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Why {APP_NAME}?
                </h2>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                    The word-guessing game that'll crack your brain before you crack the code
                </p>
            </div>

            {/* USP Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {uspCards.map((card, index) => (
                    <div 
                        key={index}
                        className="group relative p-8 rounded-2xl border border-border/50 hover:border-primary/30 bg-gradient-to-br from-background to-background-secondary hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    >
                        {/* Background glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                        
                        {/* Content */}
                        <div className="relative z-10 text-center space-y-4">
                            {/* Icon */}
                            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {card.icon}
                            </div>
                            
                            {/* Title */}
                            <h3 className={`text-xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                                {card.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-foreground/80 leading-relaxed text-sm">
                                {card.description}
                            </p>
                        </div>

                        {/* Subtle bottom accent */}
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>
                ))}
            </div>
        </div>        
    )
}