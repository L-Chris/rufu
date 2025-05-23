'use client';

import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { WidgetProps } from '../../types/widget';


export default function ClockWidget(props: WidgetProps) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <BaseWidget {...props}>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-4xl font-bold mb-2 text-gray-800">{formatTime(date)}</div>
        <div className="text-base text-gray-600">{formatDate(date)}</div>
      </div>
    </BaseWidget>
  );
}

// 注册widget配置
export const clockWidgetConfig = {
  id: 'clock',
  name: '时钟',
  description: '显示当前时间和日期',
  component: ClockWidget,
  defaultWidth: 1,
  defaultHeight: 1
};