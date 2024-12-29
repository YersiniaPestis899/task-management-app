import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/app/lib/prisma'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  logger: {
    error: (code, metadata) => {
      console.error('AUTH ERROR:', { code, metadata })
    },
    warn: (code) => {
      console.warn('AUTH WARN:', code)
    },
    debug: (code, metadata) => {
      console.log('AUTH DEBUG:', { code, metadata })
    }
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: { 
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60 
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('Sign-in attempt:', { user, account, profile })
      return true
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (user) {
        token.userId = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout'
  }
})