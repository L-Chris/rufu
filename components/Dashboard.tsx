'use client';

import React, { useState, useEffect } from 'react';
import { widgetRegistry } from '../lib/widgetRegistry';
import { WidgetRegistryItem, WidgetProps } from '../types/widget';
import ConfigModal from './ConfigModal';

interface WidgetConfig {
  widgetId: string;
  instanceId: string;
  config: {
    [key: string]: any;
  };
}

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetRegistryItem[]>([]);
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    // 获取所有启用的widgets
    const enabledWidgets = widgetRegistry.getEnabledWidgets();
    setWidgets(enabledWidgets);

    // 获取所有widget配置
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWidgetConfigs(data);
        }
      })
      .catch(err => console.error('Failed to load configs:', err));
  }, []);

  const handleConfigChange = (newConfigs: WidgetConfig[]) => {
    setWidgetConfigs(newConfigs);
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl text-gray-800">Dashboard</h1>
        <button
          onClick={() => setIsConfigOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          配置
        </button>
      </div>
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onConfigChange={handleConfigChange}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 max-lg:grid-cols-3 gap-5">
        {widgetConfigs.map((widgetConfig) => {
          const widget = widgets.find(w => w.id === widgetConfig.widgetId);
          if (!widget) return null;

          const WidgetComponent = widget.component;
          const widgetProps: WidgetProps = {
            id: widgetConfig.instanceId,
            title: widget.name,
            width: widget.defaultWidth,
            height: widget.defaultHeight,
            config: widgetConfig.config
          };

          return (
            <div key={widgetConfig.instanceId} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:translate-y-[-5px] hover:shadow-lg">
              <WidgetComponent {...widgetProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
}