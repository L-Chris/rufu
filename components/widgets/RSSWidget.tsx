'use client';

import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { WidgetProps } from '../../types/widget';

// 定义RSS项目的接口
interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  isoDate?: string;
}

// 定义RSS源的接口
interface RSSSource {
  url: string;
  title: string;
}

// 定义组件的属性，扩展自WidgetProps
interface RSSWidgetProps extends WidgetProps {
  sources?: RSSSource[];
  maxItems?: number;
}

// 模拟获取RSS数据的函数
const fetchRSSData = async (sources: RSSSource[]): Promise<RSSItem[]> => {
  const params = new URLSearchParams({
    sources: JSON.stringify(sources)
  });
  
  const response = await fetch(`/api/rss?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch RSS data');
  }
  
  return response.json();
};

export default function RSSWidget(props: RSSWidgetProps) {
  const { maxItems = 5, sources = [] } = props;
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // 默认RSS源
  const defaultSources: RSSSource[] = [
    { url: 'https://rsshub.app/hackernews', title: 'HackerNews' },
  ];

  // 合并默认源和用户配置的源
  const rssSources = sources.length > 0 ? sources : defaultSources;

  const loadRSSData = async () => {
    setLoading(true);
    setError(undefined);
    
    try {
      const items = await fetchRSSData(rssSources);
      setRssItems(items.slice(0, maxItems));
    } catch (err) {
      setError('无法加载RSS数据');
      console.error('Failed to fetch RSS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRSSData();
  }, []);

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <BaseWidget
      {...props}
      loading={loading}
      error={error}
      onRefresh={loadRSSData}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <ul className="divide-y divide-gray-200 overflow-y-auto">
          {rssItems.map((item, index) => (
            <li key={index} className="py-3 hover:bg-gray-50 transition-colors">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{item.title}</h3>
                {item.contentSnippet && (
                  <p className="text-xs text-gray-600 mb-1 line-clamp-2">{item.contentSnippet}</p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  {item.creator && <span>{item.creator}</span>}
                  {item.pubDate && <span>{formatDate(item.pubDate)}</span>}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </BaseWidget>
  );
}

// 注册widget配置
export const rssWidgetConfig = {
  id: 'rss',
  name: 'RSS阅读器',
  description: '显示多个RSS源的最新内容',
  component: RSSWidget,
  defaultWidth: 2,
  defaultHeight: 2,
  defaultRefreshInterval: 600000, // 5分钟刷新一次
};