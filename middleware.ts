import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/app/lib/auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs'  // Edge Runtimeから Node.js Runtimeに変更
}

export default async function middleware(request: NextRequest) {
  const session = await auth()
  console.log('Session in middleware:', !!session);

  // API routes をスキップ
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 静的アセットをスキップ
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  console.log('Is auth page:', isAuthPage);

  // 未認証ユーザーの処理
  if (!session && !isAuthPage) {
    console.log('Redirecting to signin - no session');
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // 認証済みユーザーの処理
  if (session && isAuthPage) {
    console.log('Redirecting to home - authenticated');
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}