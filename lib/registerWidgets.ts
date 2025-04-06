import { widgetRegistry } from './widgetRegistry.ts';
import { clockWidgetConfig } from '../components/widgets/ClockWidget.tsx';
import { weatherWidgetConfig } from '../components/widgets/WeatherWidget.tsx';

// 注册所有widgets
export function registerAllWidgets() {
  // 注册时钟widget
  widgetRegistry.register(clockWidgetConfig);
  
  // 注册天气widget
  widgetRegistry.register(weatherWidgetConfig);

  // 在这里注册更多widgets...
  
  console.log('All widgets registered successfully');
}