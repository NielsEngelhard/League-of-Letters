interface Props {
    color?: string;
    children?: React.ReactElement;
}

export default function Avatar({ color, children }: Props) {
    return (
        <div className={`relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 sm:w-10 sm:h-10 items-center justify-center ${color ? `bg-[${color}]` : 'bg-primary/10' }`}>
            {children}
        </div>
    )
}