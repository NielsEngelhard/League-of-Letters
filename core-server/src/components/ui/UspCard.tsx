import Card from "./card/Card";

interface Props {
    title: string;
    subTxt?: string;
    children?: React.ReactNode;
    Icon: React.ElementType;
    fullWidth?: boolean;
}

export default function UspCard({ title, subTxt, children, Icon, fullWidth }: Props) {
    return (
        <Card className={`mx-auto ${fullWidth ? 'w-full' : 'w-fit'}`}>
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 p-3 bg-primary/20 rounded-full">
                    <Icon className="w-6 h-6 text-foreground-muted" />
                </div>
                <h3 className="text-foreground font-medium mb-1">
                    {title}
                </h3>
                {subTxt && (
                    <p className="text-foreground-muted text-sm">
                        {subTxt}
                    </p>                
                )}

                {children && (
                    <>{children}</>                
                )}            
            </div>
        </Card>
    )
}