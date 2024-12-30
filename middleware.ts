import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Static resources and API routes bypass
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Not authenticated and trying to access protected route
  if (!session && !isAuthPage) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Authenticated and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.png|.jpg|.jpeg|.gif|.ico).*)',
  ]
}