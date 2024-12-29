import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/app/lib/auth'

export default async function middleware(request: NextRequest) {
  console.log('Middleware - Path:', request.nextUrl.pathname);
  
  // 特定のパスはスキップ
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  const session = await auth();
  console.log('Middleware - Session status:', !!session);

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // 未認証ユーザーの処理
  if (!session && !isAuthPage) {
    console.log('Redirecting to signin page');
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 認証済みユーザーの処理
  if (session && isAuthPage) {
    console.log('Redirecting authenticated user to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}