import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { NotificationTiming } from '@/app/types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, description, priority, status, dueDate, notificationTimings } = await request.json();

    // 既存のタスクを確認
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { notificationTimings: true }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // タスクの更新（トランザクションを使用）
    const updatedTask = await prisma.$transaction(async (tx) => {
      // 既存の通知タイミングを削除
      await tx.notificationTiming.deleteMany({
        where: { taskId: id }
      });

      // タスクと新しい通知タイミングを更新
      return tx.task.update({
        where: { id },
        data: {
          title,
          description,
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate) : null,
          notificationTimings: {
            create: notificationTimings?.map((timing: NotificationTiming) => ({
              minutes: timing.minutes,
              enabled: timing.enabled
            }))
          }
        },
        include: {
          notificationTimings: true
        }
      });
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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Task deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}