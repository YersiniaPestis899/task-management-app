import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    console.log('Tasks API session:', session); // デバッグログ

    if (!session?.user?.id) {
      console.log('No user ID in session'); // デバッグログ
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Fetched tasks:', tasks); // デバッグログ
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Task fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}