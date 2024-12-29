import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // secure: process.env.NODE_ENV === 'production'  // モバイルテスト用に一時的に無効化
        secure: false
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('🔑 JWT Callback:', { tokenId: token.sub, userId: user?.id });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('📍 Session Callback:', { sessionUser: session?.user?.email, tokenId: token.sub });
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔀 Redirect Callback:', { url, baseUrl });
      // ベースURLからの相対パスの場合
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('↪️ Redirecting to:', fullUrl);
        return fullUrl;
      }
      // 同一オリジンの場合
      if (url.startsWith(baseUrl)) {
        console.log('↪️ Redirecting to:', url);
        return url;
      }
      // デフォルトはホームページ
      console.log('↪️ Redirecting to baseUrl:', baseUrl);
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout'
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('🚨 Auth Error:', { code, metadata });
    },
    warn(code) {
      console.warn('⚠️ Auth Warning:', code);
    },
    debug(code, metadata) {
      console.log('🔍 Auth Debug:', { code, metadata });
    }
  }
})