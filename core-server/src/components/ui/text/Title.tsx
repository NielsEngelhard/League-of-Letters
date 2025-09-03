import { cva, type VariantProps } from 'class-variance-authority';

interface Props extends VariantProps<typeof subTextVariants> {
    title: string;
    className?: string;
}

const subTextVariants = cva('font-bold', {
    variants: {
        size: {
            sm: 'text-1xl md:text-2xl',
            md: 'text-2xl md:text-4xl',
            lg: 'text-3xl md:text-5xl',
        },
        color : {
            primary: "text-primary",
            text: "text-text",
            gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1"
        }
    },
    defaultVariants: {
        size: 'md',
        color: "primary"
    },
});

export default function Title({ title, size, color, className }: Props) {
    return <div className={subTextVariants({ size, color, className })}>{title}</div>;
}
