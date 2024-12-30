import { prisma } from './prisma';

export async function checkAndScheduleNotifications() {
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000;
  const localNow = new Date(now.getTime() - localOffset);
  const thirtyMinutesFromNow = new Date(localNow.getTime() + 30 * 60000);

  try {
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

    console.log('Checking notifications for tasks:', upcomingTasks);

    for (const task of upcomingTasks) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const taskDueDate = task.dueDate ? new Date(task.dueDate.getTime() - localOffset) : null;
        
        if (!taskDueDate) {
          console.log('Task has no due date:', task.id);
          continue;
        }

        const timeUntilDue = Math.round((taskDueDate.getTime() - localNow.getTime()) / 60000);
        
        console.log('Scheduling notification for task:', {
          taskId: task.id,
          title: task.title,
          dueAt: taskDueDate.toLocaleString(),
          timeUntilDue
        });

        await registration.showNotification('Task Due Soon!', {
          body: `Task "${task.title}" is due in ${timeUntilDue} minutes!`,
          icon: '/icon.png',
          badge: '/badge.png',
          tag: `task-${task.id}`,
          renotify: true,
          requireInteraction: true,
          data: {
            taskId: task.id,
            url: '/',
            dueDate: taskDueDate.toLocaleString()
          }
        } as NotificationOptions);

        // 通知済みフラグを更新
        await prisma.task.update({
          where: { id: task.id },
          data: { notified: true }
        });

        console.log('Notification sent and task updated:', task.id);
      } catch (error) {
        console.error('Failed to schedule notification for task:', task.id, error);
      }
    }
  } catch (error) {
    console.error('Error in checkAndScheduleNotifications:', error);
  }
}