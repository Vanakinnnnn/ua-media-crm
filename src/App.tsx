import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { MediaModule } from './components/Media/MediaModule';
// 权限管理模块暂时隐藏，本期项目不开发
// import { PermissionModule } from './components/Permissions/PermissionModule';
import { OptimizerModule } from './components/Optimizer/OptimizerModule';
import { ProductGroupModule } from './components/ProductGroup/ProductGroupModule';
import { OperationLogs } from './components/Common/OperationLogs';

function App() {
  const [activeModule, setActiveModule] = useState<'media' | 'permissions' | 'optimizer' | 'productGroup' | 'logs'>('media');

  const renderModule = () => {
    switch (activeModule) {
      case 'media':
        return <MediaModule />;
      // 权限管理模块暂时隐藏，本期项目不开发
      // case 'permissions':
      //   return <PermissionModule />;
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="flex-1 min-w-0 overflow-hidden">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default App;