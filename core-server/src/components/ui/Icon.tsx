import { cva } from "class-variance-authority";

interface Props {
  LucideIcon: React.ElementType;
  size?: "xs" | "sm" | "md" | "lg";
}

const iconVariants = cva("transition-colors", {
  variants: {
    size: {
      xs: "w-3 md:w-4 h-3 md:h-4",
      sm: "w-4 md:w-5 h-4 md:h-5",
      md: "w-6 h-6 md:w-8 md:h-8",
      lg: "w-10 h-10 md:w-12 md:h-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default function Icon({ LucideIcon, size }: Props) {
  return (
    <div>
      <LucideIcon className={iconVariants({ size })} />
    </div>
  );
}
