import Button from "@/components/ui/Button";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader } from "@/components/ui/card/card-children";
import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";

export interface Props extends VariantProps<typeof buttonVariants> {
    title: string;
    subTxt: string;
    btnTxt: string;
    href?: string;
    Icon: React.ElementType;
    className?: string;
    children?: React.ReactNode;
}

const buttonVariants = cva(
  "",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        accent: "bg-accent text-white",
        primaryGradient: "bg-gradient-to-l from-primary to-primary/70 text-white",
        secondaryGradient: "bg-gradient-to-r from-secondary to-secondary/60 text-white",
      }
    },
    defaultVariants: {
        variant: "primary"
    }
  }
)

export default function GameModeCard({ 
  title, 
  subTxt, 
  btnTxt, 
  href, 
  Icon, 
  variant, 
  className, 
  children 
}: Props) {
    return (
        <Card className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex items-center">
              <div className={`w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center text-white ${cn(buttonVariants({ variant }), className)}`}>
                <Icon />
              </div>
              <div className="font-semibold text-2xl tracking-tight">{title}</div>
          </CardHeader>
          <CardContent>
            <div className="w-full flex flex-col gap-3 items-center text-center justify-between h-full">
              <div className="text-foreground-muted">{subTxt}</div>
               {children}
              {href && (
                <Button   
                  href={href}                  
                  className={`w-full ${cn(buttonVariants({ variant }), className)}`}
                >
                  {btnTxt}
                </Button>           
              )}
            </div>
          </CardContent>
        </Card>
    )
}