interface Props {
    LucideIcon: React.ElementType;
}

export default function Icon({ LucideIcon }: Props) {
    return (
        <div>
            <LucideIcon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
    );
}
