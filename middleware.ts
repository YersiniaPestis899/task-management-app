import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
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

  // 本番環境とローカル環境の両方のセッショントークンに対応
  const authCookie = request.cookies.get('next-auth.session-token') || 
                    request.cookies.get('__Secure-next-auth.session-token');

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // 認証済みの場合、auth ページへのアクセスを '/' にリダイレクト
  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 未認証の場合、保護されたルートへのアクセスを '/auth/signin' にリダイレクト
  if (!authCookie && !isAuthPage) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}