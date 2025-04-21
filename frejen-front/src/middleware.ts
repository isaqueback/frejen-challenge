// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')

  const publicRoutes = ['/auth']

  const isProtectedRoute = !publicRoutes.includes(request.nextUrl.pathname)

  if (isProtectedRoute && !accessToken) {
    const url = new URL('/auth', request.url)
    return NextResponse.redirect(url)
  }

  if (!isProtectedRoute && accessToken) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
