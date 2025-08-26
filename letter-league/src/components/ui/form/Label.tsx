interface Props {
    text: string;
    required?: boolean;
}

export default function Label({ text, required }: Props) {
    return (
        <label className="text-sm font-semibold text-start text-foreground/90">
            {text}
            {required && <>*</>}
        </label>
    )
}