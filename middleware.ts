// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

const protectedRoutes = ['/posts', '/create-post']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    if (token) verify(token, process.env.JWT_SECRET!)
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/posts/:path*', '/create-post'],
}
