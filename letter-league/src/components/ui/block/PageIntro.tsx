interface Props {
    title: string;
    subText?: string;
}

export default function PageIntro({ title, subText}: Props) {
    return (
        <div className="w-full flex- flex-col gap-2 text-center">
            <div className="text-6xl">
                {title}
            </div>

            <div className="text-xl text-foreground-muted">
                {subText}
            </div>
        </div>
    )
}