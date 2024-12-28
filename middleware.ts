import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isAuthed = !!req.auth

  if (isAuthPage) {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (!isAuthed && !isAuthPage) {
    let from = req.nextUrl.pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }
    
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
})

export const config = {
  matcher: [
    '/',
    '/auth/signin',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}