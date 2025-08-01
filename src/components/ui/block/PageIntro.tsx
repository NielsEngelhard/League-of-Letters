interface Props {
    title: string;
    subText?: string;
}

export default function PageIntro({ title, subText }: Props) {
    return (
        <div className="w-full flex flex-col gap-4 text-center">
            <div className="text-xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent py-2">
                {title}
            </div>

            {subText && (
                <div className="text-xl text-foreground-muted">
                    {subText}
                </div>
            )}
        </div>
    );
}
