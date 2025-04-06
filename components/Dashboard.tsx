'use client';

import React, { useState, useEffect } from 'react';
import { widgetRegistry } from '../lib/widgetRegistry.ts';
import { WidgetRegistryItem, WidgetProps } from '../types/widget.ts';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetRegistryItem[]>([]);

  useEffect(() => {
    // 获取所有启用的widgets
    const enabledWidgets = widgetRegistry.getEnabledWidgets();
    console.log('Enabled widgets:', enabledWidgets); // 添加调试日志
    setWidgets(enabledWidgets);
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.widgetsGrid}>
        {widgets.map((widget) => {
          const WidgetComponent = widget.component;
          const widgetProps: WidgetProps = {
            id: widget.id,
            title: widget.name,
            width: widget.defaultWidth,
            height: widget.defaultHeight,
            refreshInterval: widget.defaultRefreshInterval,
          };

          return (
            <div key={widget.id} className={styles.widgetContainer}>
              <WidgetComponent {...widgetProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
}