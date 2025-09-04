interface Props {
    title: string;
    children: React.ReactNode;
}

export default function HeroBlock({ title, children }: Props) {
    return (
        <div>
            <div className="space-y-4">
                <div className="relative">
                    {/* Background blur effect - positioned behind the text */}
                    <div className="absolute inset-0 -inset-x-4 -inset-y-2 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-lg -z-10" />
                    
                    {/* Main title */}
                    <h1 className="relative text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent pb-2 z-10">
                        {title}
                    </h1>        
                </div>
                {children}
            </div>            
        </div>
    )
}
