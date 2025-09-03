interface Props {
    children: React.ReactElement;
}

export default function ErrorText({ children }: Props) {
    return (
        <span className="text-error font-semibold text-sm tracking-tight">
            {children}
        </span>
    )
}