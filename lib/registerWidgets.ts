import { widgetRegistry } from './widgetRegistry';
import { clockWidgetConfig } from '../components/widgets/ClockWidget';
import { weatherWidgetConfig } from '../components/widgets/WeatherWidget';
import { rssWidgetConfig } from '../components/widgets/RSSWidget';

// 注册所有widgets
export function registerAllWidgets() {
  // 注册时钟widget
  widgetRegistry.register(clockWidgetConfig);
  
  // 注册天气widget
  widgetRegistry.register(weatherWidgetConfig);
  
  // 注册RSS widget
  widgetRegistry.register(rssWidgetConfig);

  // 在这里注册更多widgets...
  
  console.log('All widgets registered successfully');
}