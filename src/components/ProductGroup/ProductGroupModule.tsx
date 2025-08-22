import React, { useState } from 'react';
import { BusinessInfoTab } from './BusinessInfoTab';
import { NotificationTab } from './NotificationTab';

export const ProductGroupModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'notification'>('business');

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">产品组管理</h2>
        <p className="text-sm text-gray-600 mt-1">
          管理各产品组的业务信息和通知配置
        </p>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('business')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'business'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            业务信息管理
          </button>
          <button
            onClick={() => setActiveTab('notification')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notification'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            通知管理
          </button>
        </nav>
      </div>

      {/* 标签页内容 */}
      <div className="mt-6">
        {activeTab === 'business' && <BusinessInfoTab />}
        {activeTab === 'notification' && <NotificationTab />}
      </div>
    </div>
  );
};
