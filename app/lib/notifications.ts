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
  const localOffset = now.getTimezoneOffset() * 60000; // ローカルタイムオフセットをミリ秒で取得
  const localNow = new Date(now.getTime() - localOffset); // ローカル時間に変換
  
  const dueDate = new Date(task.dueDate);
  const localDueDate = new Date(dueDate.getTime() - localOffset); // 期限をローカル時間に変換
  
  const timeDiff = localDueDate.getTime() - localNow.getTime();

  if (timeDiff <= 0) return;

  setTimeout(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Task Reminder', {
        body: `Task "${task.title}" is due at ${localDueDate.toLocaleTimeString()}!`,
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
          taskId: task.id,
          dueDate: localDueDate.toLocaleString() // ローカル時間での期限を追加
        }
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, Math.max(0, timeDiff - 30 * 60 * 1000)); // 30 minutes before due date
}