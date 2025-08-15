import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { MediaModule } from './components/Media/MediaModule';
import { OptimizerModule } from './components/Optimizer/OptimizerModule';
import { OperationLogs } from './components/Common/OperationLogs';
import PermissionModule from './components/Permissions/PermissionModule';
import { ProductGroupModule } from './components/ProductGroup/ProductGroupModule';

function App() {
  const [activeModule, setActiveModule] = useState('media');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshSuccess(false);
    // 模拟刷新过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    setRefreshSuccess(true);
    // 3秒后隐藏成功消息
    setTimeout(() => setRefreshSuccess(false), 3000);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'media':
        return <MediaModule />;
      case 'permissions':
        return <PermissionModule />;
      case 'optimizer':
        return <OptimizerModule />;
      case 'productGroup':
        return <ProductGroupModule />;
      case 'logs':
        return <OperationLogs />;
      default:
        return <MediaModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <div className="flex-1 flex flex-col">
        <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        
        <main className="flex-1 overflow-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default App;