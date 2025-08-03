import Title from "../text/Title";

interface Props {
    title: string;
    subText?: string;
    titleSize?: "sm" | "md" | "lg";
    titleColor?: "primary" | "text" | "gradient";    
}

export default function PageIntro({ title, subText, titleSize = "md", titleColor = "primary" }: Props) {
    const getAccentColor = () => {
        switch (titleColor) {
            case "primary": return "from-blue-500 to-indigo-500";
            case "gradient": return "from-purple-500 via-blue-500 to-indigo-500";
            case "text": return "from-gray-400 to-gray-600";
            default: return "from-blue-500 to-indigo-500";
        }
    };

    return (
        <div className="w-full flex flex-col items-center text-center space-y-6">
            {/* Decorative top elements */}
            <div className="flex items-center gap-2 opacity-60">

            </div>

            {/* Main title with enhanced styling */}
            <div className="relative">
                <Title
                    title={title}
                    size={titleSize}
                    color={titleColor}
                />
                
                {/* Animated underline */}
                <div className="relative mt-3 flex justify-center">
                    <div className={`
                        h-0.5 bg-gradient-to-r ${getAccentColor()} rounded-full
                        transition-all duration-1000 ease-out
                        ${titleSize === "lg" ? "w-24" : titleSize === "md" ? "w-16" : "w-12"}
                        opacity-0 animate-fade-in-scale
                    `} 
                    style={{ animationDelay: '300ms', animationFillMode: 'forwards' }} 
                    />
                </div>
            </div>

            {/* Enhanced subtitle */}
            {subText && (
                <div className="max-w-2xl mx-auto space-y-3">
                    <div className="text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up px-4" 
                         style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                        {subText}
                    </div>
                    
                    {/* Subtle accent line */}
                    <div className="flex justify-center">
                        <div className={`w-8 h-px bg-gradient-to-r ${getAccentColor()} opacity-30`} />
                    </div>
                </div>
            )}
        </div>
    );
}