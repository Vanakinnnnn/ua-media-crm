import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock,
  User,
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Shield,
  Building2,
  Monitor,
  FileText,
  Bell
} from 'lucide-react';
import { OperationLog } from '../../types';
import { mockOperationLogs } from '../../data/mockData';

interface FilterState {
  module: string;
  action: string;
  startDate: string;
  endDate: string;
  userId: string;
}



export const OperationLogs: React.FC = () => {
  const [logs] = useState<OperationLog[]>(mockOperationLogs);
  const [filters, setFilters] = useState<FilterState>({
    module: 'all',
    action: 'all',
    startDate: '',
    endDate: '',
    userId: ''
  });


  // 筛选选项
  const moduleOptions = [
    { value: 'all', label: '所有模块', icon: Settings },
    { value: '媒体信息', label: '媒体信息', icon: Monitor },
    { value: '优化师管理', label: '优化师管理', icon: User },
    { value: '产品组管理', label: '产品组管理', icon: Building2 }
  ];

  const actionOptions = [
    { value: 'all', label: '所有操作', icon: Settings },
    { value: '新增', label: '新增', icon: Plus },
    { value: '修改', label: '修改', icon: Edit },
    { value: '删除', label: '删除', icon: Trash2 }
  ];









  // 应用筛选器
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {


      // 模块筛选
      if (filters.module !== 'all' && log.module !== filters.module) {
        return false;
      }

      // 操作类型筛选
      if (filters.action !== 'all' && log.action !== filters.action) {
        return false;
      }



      // 操作人搜索筛选（仅搜索用户列）
      if (filters.userId) {
        const keyword = filters.userId.toLowerCase();
        if (!log.userId.toLowerCase().includes(keyword)) {
          return false;
        }
      }

      // 日期范围筛选
      if (filters.startDate || filters.endDate) {
        const logDate = new Date(log.timestamp);
        
        if (filters.startDate && logDate < new Date(filters.startDate)) {
          return false;
        }
        
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999); // 包含结束日期的全天
          if (logDate > endDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [logs, filters]);

  // 获取模块颜色
  const getModuleColor = (module: string) => {
    switch (module) {
      case '媒体信息':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '优化师管理':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case '产品组管理':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取操作类型颜色
  const getActionColor = (action: string) => {
    switch (action) {
      case '新增':
        return 'bg-green-100 text-green-800 border-green-200';
      case '修改':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '删除':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };



  // 获取操作类型图标
  const getActionIcon = (action: string) => {
    switch (action) {
      case '新增':
        return Plus;
      case '修改':
        return Edit;
      case '删除':
        return Trash2;
      default:
        return Settings;
    }
  };


  // 时间格式化 - 按照新的要求显示为日期分钟
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-');
  };



  // 重置筛选器
  const resetFilters = () => {
    setFilters({
      module: 'all',
      action: 'all',
      startDate: '',
      endDate: '',
      userId: ''
    });
  };



  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
        <h2 className="text-2xl font-bold text-gray-900">操作日志</h2>
          <p className="text-sm text-gray-600 mt-1">
            记录系统中的所有操作，包括创建、修改、删除、权限变更等
          </p>
        </div>

      </div>

      {/* 筛选器 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">


            {/* 模块筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">模块</label>
              <select
                value={filters.module}
                onChange={(e) => setFilters(prev => ({ ...prev, module: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {moduleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 操作类型筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">操作类型</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {actionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>





            {/* 开始日期筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 结束日期筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 操作人搜索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">操作人</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索操作人邮箱..."
                  value={filters.userId}
                  onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 筛选器操作按钮 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              共找到 {filteredLogs.length} 条记录
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                重置筛选
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                确认筛选
              </button>
            </div>
          </div>
        </div>

      {/* 日志列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  模块
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  原值
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  新值
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                
                return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatTime(log.timestamp)}
                            </div>
                            <div className="text-xs text-gray-500">
                    {log.timestamp}
                            </div>
                          </div>
                        </div>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{log.userId}</span>
                        </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getModuleColor(log.module)}`}>
                          {moduleOptions.find(opt => opt.value === log.module)?.label || log.module}
                    </span>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                          <ActionIcon className="w-3 h-3 mr-1" />
                          {actionOptions.find(opt => opt.value === log.action)?.label || log.action}
                    </span>
                  </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                          <pre className="whitespace-pre-wrap font-mono text-xs">
                            {log.originalValue || '-'}
                          </pre>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                          <pre className="whitespace-pre-wrap font-mono text-xs">
                            {log.newValue || '-'}
                          </pre>
                        </div>
                      </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 空状态 */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的操作记录</h3>
            <p className="text-gray-500">请尝试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>


    </div>
  );
};
