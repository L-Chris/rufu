/**
 * Widget类型定义
 */

export interface WidgetProps {
  id: string;
  title: string;
  width?: number;
  height?: number;
  refreshInterval?: number; // 刷新间隔（毫秒）
}

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<WidgetProps>;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultRefreshInterval?: number;
}

export interface WidgetRegistryItem extends WidgetConfig {
  isEnabled: boolean;
}