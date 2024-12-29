'use client';

import { Task } from '@prisma/client';
import { useState } from 'react';
import NotificationTimingSelect from './NotificationTimingSelect';
import { NotificationTiming, TaskWithNotifications } from '@/app/types';

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => Promise<void>;
}

export default function TaskEditModal({
  task,
  isOpen,
  onClose,
  onUpdate
}: TaskEditModalProps) {
  const formatDateForInput = (dateStr: Date | string | null): string => {
    if (!dateStr) return '';
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('sv-SE');
  };

  const formatTimeForInput = (dateStr: Date | string | null): string => {
    if (!dateStr) return '';
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('sv-SE').substring(0, 5);
  };

  const defaultNotificationTimings: NotificationTiming[] = [
    { minutes: 30, enabled: true }
  ];

  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
    dueDate: formatDateForInput(task.dueDate),
    dueTime: formatTimeForInput(task.dueDate),
    notificationTimings: (task as TaskWithNotifications).notificationTimings || defaultNotificationTimings
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let combinedDateTime = null;
      if (editedTask.dueDate && editedTask.dueTime) {
        const dateTimeStr = `${editedTask.dueDate}T${editedTask.dueTime}`;
        combinedDateTime = new Date(dateTimeStr);
      }

      const updatedTask = {
        ...task,
        title: editedTask.title,
        description: editedTask.description,
        priority: editedTask.priority,
        status: editedTask.status,
        dueDate: combinedDateTime,
        notificationTimings: editedTask.notificationTimings
      };

      await onUpdate(updatedTask as Task);
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editedTask.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Time</label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editedTask.dueTime}
                onChange={(e) => setEditedTask({ ...editedTask, dueTime: e.target.value })}
              />
            </div>
          </div>

          <NotificationTimingSelect
            timings={editedTask.notificationTimings}
            onChange={(timings) => setEditedTask({ ...editedTask, notificationTimings: timings })}
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}