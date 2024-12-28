import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.id;
    const data = await req.json();

    // 所有者確認
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id
      }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // タスクの更新
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notified: false // 期限が変更された場合は通知フラグをリセット
      }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}