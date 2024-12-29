import { prisma } from './prisma';

export async function checkAndScheduleNotifications() {
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000; // ローカルタイムオフセットをミリ秒で取得
  const localNow = new Date(now.getTime() - localOffset); // ローカル時間に変換
  const thirtyMinutesFromNow = new Date(localNow.getTime() + 30 * 60000);

  const upcomingTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gt: localNow,
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
      const taskDueDate = new Date(task.dueDate!.getTime() - localOffset);
      const timeUntilDue = Math.round((taskDueDate.getTime() - localNow.getTime()) / 60000);

      // Service Workerを通じて通知を送信
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Task Due Soon!', {
        body: `Task "${task.title}" is due in ${timeUntilDue} minutes!`,
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
          taskId: task.id,
          url: '/',
          dueDate: taskDueDate.toLocaleString() // ローカル時間での期限を追加
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