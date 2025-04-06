'use client';

import React, { useState, useEffect } from 'react';
import { widgetRegistry } from '../lib/widgetRegistry.ts';
import { WidgetRegistryItem, WidgetProps } from '../types/widget.ts';
// Tailwind替换了CSS模块

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetRegistryItem[]>([]);

  useEffect(() => {
    // 获取所有启用的widgets
    const enabledWidgets = widgetRegistry.getEnabledWidgets();
    console.log('Enabled widgets:', enabledWidgets); // 添加调试日志
    setWidgets(enabledWidgets);
  }, []);

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-2xl mb-5 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <div key={widget.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:translate-y-[-5px] hover:shadow-lg">
              <WidgetComponent {...widgetProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
}