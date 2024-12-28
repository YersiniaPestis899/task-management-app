// 既存のインポートに追加:
import TaskEditModal from './TaskEditModal';
import { useState } from 'react';
import type { Task } from '@prisma/client';

// TaskListコンポーネント内に追加:
const [editingTask, setEditingTask] = useState<Task | null>(null);

// handleUpdateTask 関数を追加:
const handleUpdateTask = async (updatedTask: Task) => {
  try {
    const response = await fetch(`/api/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) throw new Error('Failed to update task');
    
    await fetchTasks();
    setEditingTask(null);
    router.refresh();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update task');
  }
};

// タスクカードのJSXに編集ボタンを追加:
<div
  key={task.id}
  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
>
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">{task.title}</h3>
    <div className="flex items-center space-x-2">
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
      <button
        onClick={() => setEditingTask(task)}
        className="text-gray-600 hover:text-blue-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
    </div>
  </div>
  {/* 既存のタスク表示コード */}
</div>

// モーダルコンポーネントの追加:
{editingTask && (
  <TaskEditModal
    task={editingTask}
    isOpen={!!editingTask}
    onClose={() => setEditingTask(null)}
    onUpdate={handleUpdateTask}
  />
)}