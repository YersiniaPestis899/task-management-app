import { Task } from '@prisma/client'

export interface NotificationTiming {
  id?: string;
  minutes: number;
  enabled: boolean;
  taskId?: string;
}

export interface TaskWithNotifications extends Task {
  notificationTimings: NotificationTiming[];
}