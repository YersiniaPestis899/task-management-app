import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/app/lib/auth'

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // APIルートはスキップ
  if (isApiRoute) {
    return NextResponse.next()
  }

  // 未認証かつ認証ページでない場合
  if (!session && !isAuthPage) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // 認証済みかつ認証ページにいる場合
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}