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

interface TaskWithNotifications {
  id: string;
  title: string;
  dueDate: Date | null;
}

export async function scheduleNotification(task: TaskWithNotifications) {
  if (!task.dueDate) return;

  try {
    console.log('Scheduling notification for task:', task);
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    const timeDiff = dueDate.getTime() - now.getTime();
    console.log('Time difference:', timeDiff);

    if (timeDiff <= 0) {
      console.log('Task already due, skipping notification');
      return;
    }

    // 30分前の通知を設定
    const notificationTime = new Date(dueDate.getTime() - 30 * 60000);
    const notificationDelay = Math.max(0, notificationTime.getTime() - now.getTime());

    console.log('Scheduling notification for:', {
      taskTitle: task.title,
      dueDate: dueDate.toLocaleString(),
      notificationTime: notificationTime.toLocaleString(),
      delay: notificationDelay
    });

    setTimeout(async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        await registration.showNotification('Task Reminder', {
          body: `Task "${task.title}" is due at ${dueDate.toLocaleTimeString()}!`,
          icon: '/icon.png',
          badge: '/badge.png',
          data: {
            taskId: task.id,
            dueDate: dueDate.toLocaleString(),
            url: '/'
          },
          tag: `task-${task.id}`,
          renotify: true,
          requireInteraction: true
        } as NotificationOptions);
        
        console.log('Notification scheduled successfully');
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }, notificationDelay);

  } catch (error) {
    console.error('Error in scheduleNotification:', error);
  }
}