export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Service Worker not supported');
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    throw new Error('Notifications not supported');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  return permission;
}

interface NotificationTiming {
  minutes: number;
  enabled: boolean;
}

interface TaskWithNotifications {
  id: string;
  title: string;
  dueDate: Date | null;
  notificationTimings: NotificationTiming[];
}

export async function scheduleNotification(task: TaskWithNotifications) {
  if (!task.dueDate || !task.notificationTimings?.length) return;

  const now = new Date();
  const dueDate = new Date(task.dueDate);
  
  // 有効な通知タイミングをフィルタリング
  const enabledTimings = task.notificationTimings.filter(timing => timing.enabled);

  for (const timing of enabledTimings) {
    const notificationTime = new Date(dueDate.getTime() - timing.minutes * 60000);
    const timeDiff = notificationTime.getTime() - now.getTime();

    // 未来の通知のみスケジュール
    if (timeDiff <= 0) continue;

    setTimeout(async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const timeDescription = timing.minutes === 0 
          ? 'now'
          : timing.minutes < 60 
            ? `${timing.minutes} minutes before due time`
            : timing.minutes === 60 
              ? '1 hour before due time'
              : timing.minutes === 1440 
                ? '1 day before due time'
                : `${Math.floor(timing.minutes / 60)} hours before due time`;

        await registration.showNotification('Task Reminder', {
          body: `Task "${task.title}" is due ${timeDescription}!`,
          icon: '/icon.png',
          badge: '/badge.png',
          vibrate: [100, 50, 100],
          data: {
            taskId: task.id,
            dueDate: dueDate.toLocaleString(),
            notificationTiming: timing
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
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }, timeDiff);
  }
}