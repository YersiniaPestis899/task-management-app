'use client';

import React from 'react';

interface NotificationTiming {
  minutes: number;
  enabled: boolean;
}

interface NotificationTimingSelectProps {
  timings: NotificationTiming[];
  onChange: (timings: NotificationTiming[]) => void;
}

export default function NotificationTimingSelect({ timings, onChange }: NotificationTimingSelectProps) {
  // デフォルトの通知タイミングオプション
  const defaultTimings = [
    { minutes: 0, label: 'At time of due' },
    { minutes: 5, label: '5 minutes before' },
    { minutes: 15, label: '15 minutes before' },
    { minutes: 30, label: '30 minutes before' },
    { minutes: 60, label: '1 hour before' },
    { minutes: 120, label: '2 hours before' },
    { minutes: 1440, label: '1 day before' },
  ];

  const handleTimingChange = (minutes: number, enabled: boolean) => {
    const updatedTimings = timings.map(timing => 
      timing.minutes === minutes ? { ...timing, enabled } : timing
    );
    if (!timings.find(t => t.minutes === minutes)) {
      updatedTimings.push({ minutes, enabled });
    }
    onChange(updatedTimings.sort((a, b) => b.minutes - a.minutes));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Notification Timing
      </label>
      <div className="space-y-2">
        {defaultTimings.map(({ minutes, label }) => (
          <div key={minutes} className="flex items-center">
            <input
              type="checkbox"
              id={`notification-${minutes}`}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={timings.some(t => t.minutes === minutes && t.enabled)}
              onChange={(e) => handleTimingChange(minutes, e.target.checked)}
            />
            <label
              htmlFor={`notification-${minutes}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">
          Custom Timing (minutes before)
        </label>
        <div className="mt-1 flex space-x-2">
          <input
            type="number"
            min="1"
            max="10080" // 1週間
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Minutes"
            onChange={(e) => {
              const minutes = parseInt(e.target.value);
              if (!isNaN(minutes) && minutes > 0) {
                handleTimingChange(minutes, true);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}