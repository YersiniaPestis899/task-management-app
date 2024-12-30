import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(request: NextRequest) {
  // 静的アセットは処理をスキップ
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 環境に応じたCookie名の決定
  const cookieName = process.env.NODE_ENV === 'production' 
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';

  const authCookie = request.cookies.get(cookieName);
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // デバッグ用のログ
  console.log('Current path:', request.nextUrl.pathname);
  console.log('Cookie name:', cookieName);
  console.log('Auth cookie exists:', !!authCookie);
  console.log('Is auth page:', isAuthPage);

  if (authCookie && isAuthPage) {
    const response = NextResponse.redirect(new URL('/', request.url));
    return response;
  }

  if (!authCookie && !isAuthPage) {
    const signInUrl = new URL('/auth/signin', request.url);
    // フルURLをcallbackUrlとして設定
    const callbackUrl = request.url;
    signInUrl.searchParams.set('callbackUrl', callbackUrl);
    const response = NextResponse.redirect(signInUrl);
    return response;
  }

  return NextResponse.next();
}