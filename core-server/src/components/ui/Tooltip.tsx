'use client'

import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import cn from '@/lib/cn'

const tooltipVariants = cva(
  // Base styles
  'absolute z-50 rounded-lg shadow-lg whitespace-nowrap',
  {
    variants: {
      position: {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      },
      variant: {
        default: 'bg-foreground-muted text-background',
      }
    },
    defaultVariants: {
      position: 'top',
      size: 'md',
      variant: 'default',
    }
  }
)

interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  children: React.ReactNode
  content: string
  className?: string
  delay?: number
}

export default function Tooltip({ 
  children, 
  content, 
  position = 'top',
  size = 'md',
  variant = 'default',
  className,
  delay = 0
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  return (
    <div 
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className={tooltipVariants({ position, size, variant })}>
          {content}
        </div>
      )}
    </div>
  )
}