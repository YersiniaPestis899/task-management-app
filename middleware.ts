import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req })
  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

  // ルートページへのアクセス時の処理
  if (req.nextUrl.pathname === '/') {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
    return null
  }

  // 認証ページへのアクセス時の処理
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return null
  }

  // 保護されたルートへのアクセス時の処理
  if (!isAuth) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return null
}

export const config = {
  matcher: [
    '/',
    '/auth/signin',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}