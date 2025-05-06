/**
 * Widget类型定义
 */

export interface WidgetProps<T = any> {
  id: string;
  title: string;
  width?: number;
  height?: number;
  config: T;
}

export interface WidgetConfig<T = any> {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<WidgetProps<T>>;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface WidgetRegistryItem extends WidgetConfig {
  isEnabled: boolean;
}