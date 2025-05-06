'use client';

import React, { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { WidgetProps, WidgetConfig } from '../../types/widget';


interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
}

// 模拟天气数据获取函数
const fetchWeatherData = async (): Promise<WeatherData> => {
  // 在实际应用中，这里应该调用真实的天气API
  // 这里只是返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        location: '北京',
        temperature: Math.floor(Math.random() * 15) + 10, // 10-25度之间的随机温度
        condition: ['晴朗', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
        icon: ['☀️', '⛅', '🌧️', '☁️'][Math.floor(Math.random() * 4)],
      });
    }, 1000);
  });
};

interface WeatherConfig {
  city: string;
  unit: string;
}

interface WeatherWidgetProps extends WidgetProps<WeatherConfig> {}

export default function WeatherWidget(props: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const config = props.config || { city: '', unit: 'celsius' };

  const loadWeatherData = async () => {
    setLoading(true);
    setError(undefined);
    
    try {
      const data = await fetchWeatherData();
      setWeather(data);
    } catch (err) {
      setError('无法加载天气数据');
      console.error('Failed to fetch weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, [props.config]);

  return (
    <BaseWidget
      {...props}
      loading={loading}
      error={error}
      onRefresh={loadWeatherData}
    >
      {weather && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-5xl mb-2">{weather.icon}</div>
          <div className="text-4xl font-bold mb-1 text-gray-800">
            {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="text-base text-gray-600 mb-2">{weather.condition}</div>
          <div className="text-sm text-gray-500">{weather.location}</div>
        </div>
      )}
    </BaseWidget>
  );
}

// 注册widget配置
export const weatherWidgetConfig: WidgetConfig<WeatherConfig> = {
  id: 'weather',
  name: '天气',
  description: '显示天气信息',
  component: WeatherWidget,
  defaultWidth: 300,
  defaultHeight: 200
};