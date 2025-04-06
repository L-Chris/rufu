'use client';

import React, { useEffect, useState } from 'react';
import { WidgetProps } from '../../types/widget.ts';
import styles from './BaseWidget.module.css';

interface BaseWidgetProps extends WidgetProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

export default function BaseWidget({
  title,
  children,
  loading = false,
  error,
  refreshInterval,
  onRefresh,
}: BaseWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 处理自动刷新
  useEffect(() => {
    if (!refreshInterval || !onRefresh) return;

    const intervalId = setInterval(() => {
      onRefresh();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, onRefresh]);

  // 手动刷新
  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={styles.refreshButton}
            aria-label="Refresh widget"
          >
            ↻
          </button>
        )}
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}