import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

export default auth(async function middleware(request) {
  const token = await auth()
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return null
  }

  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
  }

  return null
})

export const config = {
  matcher: [
    '/',
    '/auth/signin',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}