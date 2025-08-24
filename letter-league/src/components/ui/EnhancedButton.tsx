'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Button from "@/components/ui/Button"
import Link from "next/link"

interface EnhancedButtonProps {
  href?: string
  onClick?: () => void | Promise<void>
  children: React.ReactNode
  className?: string
  disabled?: boolean
  variant?: string
  showSpinner?: boolean
}

export default function EnhancedButton({ 
  href, 
  onClick, 
  children, 
  className, 
  disabled = false,
  variant,
  showSpinner = true,
  ...props 
}: EnhancedButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)

    try {
      if (href) {
        // Handle navigation
        startTransition(() => {
          router.push(href)
        })
      } else if (onClick) {
        // Handle custom click
        await onClick()
      }
    } finally {
      // Keep loading state for minimum time to prevent flicker
      setTimeout(() => setIsLoading(false), 200)
    }
  }

  const isLoadingState = isLoading || isPending
  
  const buttonContent = (
    <Button 
      className={`${className} ${isLoadingState ? 'cursor-not-allowed opacity-75' : ''} relative overflow-hidden`}
      disabled={disabled || isLoadingState}
      onClick={href ? undefined : handleClick}
      {...props}
    >
      <span className={`transition-opacity duration-200 ${isLoadingState ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </span>
      {showSpinner && isLoadingState && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      {isLoadingState && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
      )}
    </Button>
  )

  if (href) {
    return (
      <Link href={href} onClick={handleClick}>
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}