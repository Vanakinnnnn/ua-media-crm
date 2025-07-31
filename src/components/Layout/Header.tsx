import React, { useState } from 'react';
import { Bell, Search, User, RefreshCw } from 'lucide-react';
import { RefreshRequestDialog } from '../Common/RefreshRequestDialog';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing }) => {
  const [isRefreshDialogOpen, setIsRefreshDialogOpen] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const handleRefreshRequest = (type: string, target: string) => {
    console.log('刷新申请提交:', { type, target });
    // 这里可以调用API或触发其他处理逻辑
    onRefresh();
    setRefreshSuccess(true);
    
    // 3秒后自动隐藏成功提示
    setTimeout(() => {
      setRefreshSuccess(false);
    }, 3000);
  };

  return (
    <>
      {/* 成功提示 */}
      {refreshSuccess && (
        <div className="bg-green-50 border border-green-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-800">提交成功</h4>
              <p className="text-sm text-green-700">刷新请求已成功提交，系统正在处理中。请前往「操作日志」页面查看处理进度</p>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          UA媒体账户管家与优化师信息维护 
          <span className="ml-2 text-sm bg-green-100 text-green-600 px-2 py-1 rounded">v1.0</span>
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索媒体平台、优化师或账户..."
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsRefreshDialogOpen(true)}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>申请刷新</span>
          </button>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <User className="w-5 h-5" />
            <span>管理员</span>
          </button>
        </div>
      </div>

      {/* 刷新申请弹窗 */}
      <RefreshRequestDialog
        isOpen={isRefreshDialogOpen}
        onClose={() => setIsRefreshDialogOpen(false)}
        onSubmit={handleRefreshRequest}
      />
          </header>
    </>
  );
};