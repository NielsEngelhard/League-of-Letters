// Middleware for protecting routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JWTService } from './jwt-service';

export function middleware(request: NextRequest) {
  // Define which paths need authentication
  const protectedPaths = ['/dashboard', '/profile', '/settings'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Check for JWT token
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token || !JWTService.verifyToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}