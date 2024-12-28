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

export async function scheduleNotification(task: any) {
  if (!task.dueDate) return;

  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const timeDiff = dueDate.getTime() - now.getTime();

  if (timeDiff <= 0) return;

  setTimeout(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Task Reminder', {
        body: `Task "${task.title}" is due soon!`,
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
          taskId: task.id
        }
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, Math.max(0, timeDiff - 30 * 60 * 1000)); // 30 minutes before due date
}