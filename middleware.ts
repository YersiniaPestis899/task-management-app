import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/app/lib/auth'

export default async function middleware(request: NextRequest) {
  // リクエスト情報のログ
  console.log(`
    🔍 Request Analysis:
    - Path: ${request.nextUrl.pathname}
    - Method: ${request.method}
    - User-Agent: ${request.headers.get('user-agent')}
    - Mobile: ${request.headers.get('user-agent')?.includes('Mobile')}
  `);

  // 静的アセットのスキップ
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('favicon')
  ) {
    console.log('📦 Static asset request - bypassing auth check');
    return NextResponse.next();
  }

  try {
    // セッション検証
    const session = await auth();
    console.log('🔐 Auth Status:', !!session);

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    console.log('🚪 Auth Page:', isAuthPage);

    // 未認証ユーザーの処理
    if (!session && !isAuthPage) {
      console.log('🔄 Redirecting to sign in');
      const callbackUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, request.url));
    }

    // 認証済みユーザーの処理
    if (session && isAuthPage) {
      console.log('✅ Authenticated user - redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('🚨 Middleware Error:', error);
    // エラー時はホームページにリダイレクト
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}