'use client';

import React, { useEffect, useState } from 'react';
import { WidgetProps } from '../../types/widget';
// Tailwind替换了CSS模块

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
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="m-0 text-base font-medium text-gray-800">{title}</h3>
        {onRefresh && (
          <button
            className="bg-transparent border-none cursor-pointer text-base text-gray-500 flex items-center justify-center w-6 h-6 rounded-full transition-all hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            title="刷新"
          >
            {isRefreshing ? '⟳' : '↻'}
          </button>
        )}
      </div>
      <div className="flex-1 p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}