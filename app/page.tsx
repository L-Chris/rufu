'use client';

import { useEffect, useState } from 'react';
import { registerAllWidgets } from '../lib/registerWidgets';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [widgetsRegistered, setWidgetsRegistered] = useState(false);
  // 在客户端组件中使用useEffect确保widget注册在客户端执行
  useEffect(() => {
    // 确保widgets只注册一次
    if (!widgetsRegistered) {
      // 注册所有widgets
      registerAllWidgets();
      setWidgetsRegistered(true);
    }
  }, []);

  return (
    <main>
      { widgetsRegistered && <Dashboard /> }
    </main>
  );
}
