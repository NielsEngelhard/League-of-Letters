interface Props {
    title: string;
    text: string;
}

export default function StatisticHighlight({ title, text }: Props) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-xl text-secondary font-bold">{title}</span>
            <span className="text-sm font-medium text-foreground-muted">{text}</span>
        </div>
    )
}