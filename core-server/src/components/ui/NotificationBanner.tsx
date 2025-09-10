import { LucideIcon } from 'lucide-react';
import { Check, CircleX, Info, Loader2, X } from "lucide-react";

type ColorVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

interface Props {
  text: string;
  colorVariant?: ColorVariant;
  className?: string;
  OverwriteIcon?: React.ElementType;
}

const colorStyles: Record<ColorVariant, { bg: string; border: string; text: string; Icon: React.ElementType }> = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary',
    Icon: Info
  },
  secondary: {
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
    text: 'text-secondary',
    Icon: Info
  },
  accent: {
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    text: 'text-accent',
    Icon: Info
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    Icon: Check
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    text: 'text-warning',
    Icon: Info
  },
  error: {
    bg: 'bg-error/10',
    border: 'border-error/20',
    text: 'text-error',
    Icon: CircleX
  }
};

export default function NotificationBanner({ 
  text, 
  colorVariant = 'primary', 
  OverwriteIcon,
  className = ''
}: Props) {
  const styles = colorStyles[colorVariant];
  
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 flex items-center gap-3 ${className}`}>
      {OverwriteIcon && <OverwriteIcon className={`${styles.text} flex-shrink-0`} size={20} />}
      {!OverwriteIcon && <styles.Icon className={`${styles.text} flex-shrink-0`} size={20} />}
      <p className={`${styles.text} font-semibold text-sm`}>
        {text}
      </p>
    </div>
  );
}