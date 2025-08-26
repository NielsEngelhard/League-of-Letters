interface Props {
    Icon: React.ElementType;
    title: string;
    description?: string;
}

export default function DefaultCardHeader({ Icon, title, description }: Props) {
    return (
        <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {title}
                </h2>
                {description && (
                    <p className="text-foreground-muted">
                        Jump in quickly with a temporary account
                    </p>                    
                )}
            </div>
        </div>        
    )
}