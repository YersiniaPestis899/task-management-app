import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

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
          access_type: "offline",
          prompt: "consent",
          response_type: "code"
        }
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        console.log('Sign in failed: No email provided');
        return false;
      }
      console.log('Sign in successful:', profile.email);
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // デバッグログ
      console.log('Redirect params:', { url, baseUrl });

      // 相対URLの処理
      if (url.startsWith("/")) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('Redirecting to full URL:', fullUrl);
        return fullUrl;
      }

      // 同一オリジンの処理
      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to same origin URL:', url);
        return url;
      }

      // デフォルトリダイレクト
      console.log('Redirecting to base URL:', baseUrl);
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout'
  },
  debug: process.env.NODE_ENV === 'development'
});