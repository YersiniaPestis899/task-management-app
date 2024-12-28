import { checkAndScheduleNotifications } from './notificationScheduler';

export function startNotificationChecks() {
  // 初回実行
  checkAndScheduleNotifications();

  // 5分ごとに実行
  setInterval(checkAndScheduleNotifications, 5 * 60 * 1000);
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notification permission granted');
    return true;
  }
  
  console.log('Notification permission denied');
  return false;
}