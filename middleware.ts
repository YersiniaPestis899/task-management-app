import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isAuthed = !!req.auth

  if (isAuthPage) {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return null
  }

  if (!isAuthed) {
    return NextResponse.redirect(
      new URL('/auth/signin', req.url)
    )
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