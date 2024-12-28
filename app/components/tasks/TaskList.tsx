'use client';

import { useEffect, useState } from 'react';
import type { Task } from '@prisma/client';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-gray-500 text-center">No tasks found</div>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <span
              className={`px-2 py-1 rounded text-sm ${
                task.priority === 'HIGH'
                  ? 'bg-red-100 text-red-800'
                  : task.priority === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {task.priority.toLowerCase()}
            </span>
          </div>
          {task.description && (
            <p className="text-gray-600 mt-2">{task.description}</p>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              Status: {task.status.replace('_', ' ')}
            </span>
            {task.dueDate && (
              <span className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}