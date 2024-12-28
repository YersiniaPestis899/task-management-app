import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaBase = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

export const prisma = globalForPrisma.prisma ?? prismaBase

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma