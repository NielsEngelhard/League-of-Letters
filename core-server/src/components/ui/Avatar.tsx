interface Props {
    colorHex?: string | null;
    children?: React.ReactElement;
}

export default function Avatar({ colorHex, children }: Props) {
    return (
        <div className={`relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 sm:w-10 sm:h-10 items-center justify-center ${!colorHex && 'bg-primary/10' }`}
            style={colorHex ? { backgroundColor: colorHex} : {}}>
            {children}
        </div>
    )
}