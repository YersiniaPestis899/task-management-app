import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './app/lib/auth'

export default auth(async function middleware(req: NextRequest) {
  const session = await auth()
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

  // 認証ページにアクセスして、既にログインしている場合
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // 認証が必要なページにアクセスして、ログインしていない場合
  if (!isAuthPage && !session) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}