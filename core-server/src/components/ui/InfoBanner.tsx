import { LucideIcon } from 'lucide-react';

type ColorVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

interface Props {
  text: string;
  colorVariant?: ColorVariant;
  icon?: LucideIcon;
  className?: string;
}

const colorStyles: Record<ColorVariant, { bg: string; border: string; text: string; icon: string }> = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary',
    icon: 'text-primary'
  },
  secondary: {
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
    text: 'text-secondary',
    icon: 'text-secondary'
  },
  accent: {
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    text: 'text-accent',
    icon: 'text-accent'
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    icon: 'text-success'
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    text: 'text-warning',
    icon: 'text-warning'
  },
  error: {
    bg: 'bg-error/10',
    border: 'border-error/20',
    text: 'text-error',
    icon: 'text-error'
  }
};

export default function InfoBanner({ 
  text, 
  colorVariant = 'primary', 
  icon: Icon,
  className = ''
}: Props) {
  const styles = colorStyles[colorVariant];
  
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 flex items-center gap-3 ${className}`}>
      {Icon && <Icon className={`${styles.icon} flex-shrink-0`} size={20} />}
      <p className={`${styles.text} font-semibold text-sm`}>
        {text}
      </p>
    </div>
  );
}