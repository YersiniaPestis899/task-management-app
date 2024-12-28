import { prisma } from './prisma';

export async function checkAndScheduleNotifications() {
  const now = new Date();
  const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);

  const upcomingTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gt: now,
        lte: thirtyMinutesFromNow
      },
      notified: false,
      status: {
        not: 'DONE'
      }
    }
  });

  for (const task of upcomingTasks) {
    try {
      // Service Workerを通じて通知を送信
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Task Due Soon!', {
        body: `Task "${task.title}" is due in ${Math.round((task.dueDate!.getTime() - now.getTime()) / 60000)} minutes!`,
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
          taskId: task.id,
          url: '/'
        },
        actions: [
          {
            action: 'view',
            title: 'View Task'
          },
          {
            action: 'complete',
            title: 'Mark Complete'
          }
        ]
      });

      // 通知済みフラグを更新
      await prisma.task.update({
        where: { id: task.id },
        data: { notified: true }
      });
    } catch (error) {
      console.error(`Failed to send notification for task ${task.id}:`, error);
    }
  }
}