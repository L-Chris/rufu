'use client';

import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget.tsx';
import { WidgetProps } from '../../types/widget.ts';
import styles from './ClockWidget.module.css';

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
      <div className={styles.clockWidget}>
        <div className={styles.time}>{formatTime(date)}</div>
        <div className={styles.date}>{formatDate(date)}</div>
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
  defaultHeight: 1,
  defaultRefreshInterval: 1000,
};