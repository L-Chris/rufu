'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface WidgetConfig {
  widgetId: string;
  instanceId: string;
  config: {
    [key: string]: any;
  };
}

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange?: (configs: WidgetConfig[]) => void;
}

export default function ConfigModal({ isOpen, onClose, onConfigChange }: ConfigModalProps) {
  const [configs, setConfigs] = useState<WidgetConfig[]>([]);

  useEffect(() => {
    // 从API获取现有配置
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setConfigs(data);
        }
      })
      .catch(err => console.error('Failed to load configs:', err));
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configs)
      });
      if (onConfigChange) {
        onConfigChange(configs);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save configs:', error);
    }
  };

  const addWidgetInstance = (widgetId: string) => {
    setConfigs(prev => [
      ...prev,
      {
        widgetId,
        instanceId: `${widgetId}-${Date.now()}`,
        config: getDefaultConfig(widgetId)
      }
    ]);
  };

  const updateWidgetConfig = (instanceId: string, config: any) => {
    setConfigs(prev => prev.map(item => 
      item.instanceId === instanceId
        ? { ...item, config }
        : item
    ));
  };

  const getDefaultConfig = (widgetId: string) => {
    switch (widgetId) {
      case 'weather':
        return { city: '', unit: 'celsius' };
      case 'rss':
        return { feeds: [''], title: '' };
      default:
        return {};
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  配置
                </Dialog.Title>

                <div className="mt-4 space-y-6">
                  {configs.map((widgetConfig) => (
                    <div key={widgetConfig.instanceId} className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-medium text-gray-700">
                          {widgetConfig.widgetId === 'weather' ? '天气设置' : 'RSS 订阅'}
                        </h4>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setConfigs(prev => prev.filter(c => c.instanceId !== widgetConfig.instanceId))}
                        >
                          删除
                        </button>
                      </div>
                      {widgetConfig.widgetId === 'weather' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="城市"
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                            value={widgetConfig.config.city}
                            onChange={(e) => updateWidgetConfig(widgetConfig.instanceId, {
                              ...widgetConfig.config,
                              city: e.target.value
                            })}
                          />
                          <select
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                            value={widgetConfig.config.unit}
                            onChange={(e) => updateWidgetConfig(widgetConfig.instanceId, {
                              ...widgetConfig.config,
                              unit: e.target.value
                            })}
                          >
                            <option value="celsius">摄氏度</option>
                            <option value="fahrenheit">华氏度</option>
                          </select>
                        </div>
                      )}
                      {widgetConfig.widgetId === 'rss' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="标题（可选，不填则自动获取）"
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                            value={widgetConfig.config.title || ''}
                            onChange={(e) => updateWidgetConfig(widgetConfig.instanceId, {
                              ...widgetConfig.config,
                              title: e.target.value
                            })}
                          />
                          {widgetConfig.config.feeds.map((feed: string, index: number) => (
                            <input
                              key={index}
                              type="text"
                              placeholder="RSS Feed URL"
                              className="w-full rounded-md border border-gray-300 px-3 py-2"
                              value={feed}
                              onChange={(e) => {
                                const newFeeds = [...widgetConfig.config.feeds];
                                newFeeds[index] = e.target.value;
                                updateWidgetConfig(widgetConfig.instanceId, {
                                  ...widgetConfig.config,
                                  feeds: newFeeds
                                });
                              }}
                            />
                          ))}
                          <button
                            type="button"
                            className="rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-200"
                            onClick={() => {
                              const newFeeds = [...widgetConfig.config.feeds, ''];
                              updateWidgetConfig(widgetConfig.instanceId, {
                                ...widgetConfig.config,
                                feeds: newFeeds
                              });
                            }}
                          >
                            添加 RSS Feed
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-200"
                      onClick={() => addWidgetInstance('weather')}
                    >
                      添加天气组件
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-200"
                      onClick={() => addWidgetInstance('rss')}
                    >
                      添加RSS组件
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                    onClick={onClose}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    onClick={handleSave}
                  >
                    保存
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}