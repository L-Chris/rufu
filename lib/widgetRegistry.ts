import { WidgetConfig, WidgetRegistryItem } from '../types/widget';

// Widget注册表
class WidgetRegistry {
  private widgets: Map<string, WidgetRegistryItem> = new Map();

  // 注册一个新的widget
  register(widgetConfig: WidgetConfig): void {
    console.log(widgetConfig);
    if (!widgetConfig || !widgetConfig.id) {
      console.warn(`Cannot register widget with undefined id`);
      return;
    }
    
    if (this.widgets.has(widgetConfig.id)) {
      console.warn(`Widget with id ${widgetConfig.id} already registered`);
      return;
    }

    this.widgets.set(widgetConfig.id, {
      ...widgetConfig,
      isEnabled: true,
    });
  }

  // 获取所有已注册的widgets
  getAllWidgets(): WidgetRegistryItem[] {
    return Array.from(this.widgets.values());
  }

  // 获取所有启用的widgets
  getEnabledWidgets(): WidgetRegistryItem[] {
    return this.getAllWidgets().filter(widget => widget.isEnabled);
  }

  // 获取特定widget
  getWidget(id: string): WidgetRegistryItem | undefined {
    return this.widgets.get(id);
  }

  // 启用或禁用widget
  setWidgetEnabled(id: string, isEnabled: boolean): void {
    const widget = this.widgets.get(id);
    if (widget) {
      this.widgets.set(id, { ...widget, isEnabled });
    }
  }
}

// 创建单例实例
export const widgetRegistry = new WidgetRegistry();