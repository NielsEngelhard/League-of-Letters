'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GlobalLoadingIndicator() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Override the router.push method to show loading
    const originalPush = router.push
    router.push = (...args) => {
      handleStart()
      const result = originalPush.apply(router, args)
      // Since router.push doesn't return a promise, we'll use a timeout
      // to hide the loading indicator after navigation starts
      handleComplete();
      return result
    }

    // Also handle browser back/forward
    const handlePopState = () => {
      handleStart()
      // Complete after a short delay to account for page render
      setTimeout(handleComplete, 100)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      router.push = originalPush // Restore original method
    }
  }, [router])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Main loading spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-foreground-muted/20 rounded-full animate-spin border-t-primary"></div>
          {/* Inner ring */}
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-foreground-muted/20 rounded-full animate-spin animate-reverse border-t-secondary"></div>
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text with animated dots */}
        <div className="flex items-center space-x-1 text-foreground-muted">
          <span className="text-lg font-medium">Loading</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-foreground-muted rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-foreground-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
    </div>
  )
}