interface Props {
    title: string;
    children: React.ReactNode;
}

export default function HeroBlock({ title, children }: Props) {
    return (
        <div>
            <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse pb-2">
                    {title}
                </h1>

                {children}
            </div>            
        </div>
    )
}