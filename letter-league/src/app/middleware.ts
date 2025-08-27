// middleware.ts
import { DefaultLanguage, supportedLanguages } from '@/features/i18n/languages'
import { NextRequest, NextResponse } from 'next/server'

function getLocale(request: NextRequest): string {
  // First, check if user has a saved language preference (for authenticated users)
  const savedLanguage = request.cookies.get('user-language')?.value
  if (savedLanguage && supportedLanguages.includes(savedLanguage as any)) {
    return savedLanguage
  }

  // Otherwise, detect from browser's Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || ''
  
  if (!acceptLanguage) return DefaultLanguage;
  
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,nl;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = 'q=1'] = lang.trim().split(';')
      return {
        code: code.split('-')[0].toLowerCase(), // Extract language code
        quality: parseFloat(q.split('=')[1]) || 1
      }
    })
    .sort((a, b) => b.quality - a.quality) // Sort by preference

  // Find first supported language
  for (const { code } of languages) {
    if (supportedLanguages.includes(code as any)) {
      return code
    }
  }
  
  return DefaultLanguage;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if pathname already has a locale
  const pathnameHasLocale = supportedLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If pathname already has a locale, continue
  if (pathnameHasLocale) return

  // If pathname doesn't have locale, redirect to appropriate locale
  const locale = getLocale(request)
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
  
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|_next/static|_next/image|_next/font|favicon.ico).*)',
  ],
}