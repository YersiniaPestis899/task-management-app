export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        console.log('Existing Service Worker found', existingRegistration);
        return existingRegistration;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully', registration);
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
    console.error('Notifications not supported');
    throw new Error('Notifications not supported');
  }

  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
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
  console.log('Scheduling notification for task:', task);

  if (!task.dueDate || !task.notificationTimings?.length) {
    console.log('No due date or notification timings set');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker is ready');

    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    // 有効な通知タイミングをフィルタリング
    const enabledTimings = task.notificationTimings.filter(timing => timing.enabled);
    console.log('Enabled notification timings:', enabledTimings);

    for (const timing of enabledTimings) {
      const notificationTime = new Date(dueDate.getTime() - timing.minutes * 60000);
      const timeDiff = notificationTime.getTime() - now.getTime();

      console.log('Notification timing details:', {
        taskTitle: task.title,
        dueDate: dueDate.toLocaleString(),
        notificationTime: notificationTime.toLocaleString(),
        timeDiff: `${Math.round(timeDiff / 1000 / 60)} minutes`,
        timing
      });

      if (timeDiff <= 0) {
        console.log('Skipping past notification timing');
        continue;
      }

      // 通知のスケジュール
      setTimeout(async () => {
        try {
          console.log('Showing notification for timing:', timing);
          
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
            ],
            tag: `task-${task.id}-${timing.minutes}`,  // 重複通知を防ぐためのタグ
            renotify: true  // 同じタグでも新しい通知を表示
          });
          console.log('Notification scheduled successfully');
        } catch (error) {
          console.error('Error showing notification:', error);
        }
      }, timeDiff);

      console.log('Notification timer set for:', notificationTime.toLocaleString());
    }
  } catch (error) {
    console.error('Error in scheduleNotification:', error);
  }
}