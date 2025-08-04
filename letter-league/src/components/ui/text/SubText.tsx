import { cva, type VariantProps } from 'class-variance-authority';

interface Props extends VariantProps<typeof subTextVariants> {
    text: string;
    className?: string;
}

const subTextVariants = cva('font-', {
    variants: {
        size: {
            sm: 'text-sm',
            md: 'text-md',
            lg: 'text-lg',
        },
        color : {
            muted: "text-foreground-muted",
            primary: "text-primary font-bold",
            text: "text-text font-bold",
            gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold pb-1"
        }
    },
    defaultVariants: {
        size: 'md',
        color: "muted"
    },
});

export default function SubText({ text, size, color, className }: Props) {
    return <div className={subTextVariants({ size, color, className })}>{text}</div>;
}
