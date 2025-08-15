import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Clock,
  User,
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Shield,
  Building2,
  Smartphone,
  Monitor,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { OperationLog } from '../../types';
import { mockOperationLogs } from '../../data/mockData';

interface FilterState {
  searchTerm: string;
  module: string;
  action: string;
  objectType: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  userId: string;
}

interface ExpandedLogs {
  [key: string]: boolean;
}

export const OperationLogs: React.FC = () => {
  const [logs] = useState<OperationLog[]>(mockOperationLogs);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    module: 'all',
    action: 'all',
    objectType: 'all',
    status: 'all',
    dateRange: {
      start: '',
      end: ''
    },
    userId: ''
  });
  const [expandedLogs, setExpandedLogs] = useState<ExpandedLogs>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 筛选选项
  const moduleOptions = [
    { value: 'all', label: '所有模块', icon: Settings },
    { value: 'media', label: '媒体信息', icon: Monitor },
    { value: 'optimizer', label: '优化师管理', icon: User },
    { value: 'facebook', label: 'Facebook账户', icon: Smartphone },
    { value: 'system', label: '系统管理', icon: Building2 }
  ];

  const actionOptions = [
    { value: 'all', label: '所有操作', icon: Settings },
    { value: 'create', label: '新增', icon: Plus },
    { value: 'update', label: '修改', icon: Edit },
    { value: 'delete', label: '删除', icon: Trash2 },
    { value: 'refresh', label: '刷新', icon: RefreshCw },
    { value: 'permission_change', label: '权限变更', icon: Shield }
  ];

  const objectTypeOptions = [
    { value: 'all', label: '所有对象', icon: Settings },
    { value: 'MediaPlatform', label: '媒体平台', icon: Monitor },
    { value: 'MediaAccount', label: '媒体账户', icon: Building2 },
    { value: 'DefaultSettings', label: '账户配置', icon: Settings },
    { value: 'FGInfo', label: 'FG信息', icon: Info },
    { value: 'Optimizer', label: '优化师', icon: User },
    { value: 'MediaPermission', label: '媒体权限', icon: Shield },
    { value: 'FacebookBM', label: 'Facebook BM', icon: Smartphone },
    { value: 'FacebookAdAccount', label: 'Facebook广告账户', icon: Smartphone }
  ];

  const statusOptions = [
    { value: 'all', label: '所有状态', icon: Info },
    { value: 'success', label: '成功', icon: CheckCircle },
    { value: 'failed', label: '失败', icon: AlertCircle },
    { value: 'pending', label: '待处理', icon: Clock }
  ];

  // 获取用户列表
  const userOptions = useMemo(() => {
    const users = Array.from(new Set(logs.map(log => log.userId)));
    return users.map(userId => {
      const log = logs.find(l => l.userId === userId);
      return {
        value: userId,
        label: log?.userName || userId
      };
    });
  }, [logs]);

  // 应用筛选器
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // 搜索词筛选
      if (filters.searchTerm && !log.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !log.objectName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !log.userName.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // 模块筛选
      if (filters.module !== 'all' && log.module !== filters.module) {
        return false;
      }

      // 操作类型筛选
      if (filters.action !== 'all' && log.action !== filters.action) {
        return false;
      }

      // 对象类型筛选
      if (filters.objectType !== 'all' && log.objectType !== filters.objectType) {
        return false;
      }

      // 状态筛选
      if (filters.status !== 'all' && log.status !== filters.status) {
        return false;
      }

      // 用户筛选
      if (filters.userId && log.userId !== filters.userId) {
        return false;
      }

      // 日期范围筛选
      if (filters.dateRange.start || filters.dateRange.end) {
        const logDate = new Date(log.timestamp);
        if (filters.dateRange.start && logDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && logDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      return true;
    });
  }, [logs, filters]);

  // 获取模块颜色
  const getModuleColor = (module: string) => {
    switch (module) {
      case 'media':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optimizer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'facebook':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取操作类型颜色
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refresh':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'permission_change':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取操作类型图标
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return Plus;
      case 'update':
        return Edit;
      case 'delete':
        return Trash2;
      case 'refresh':
        return RefreshCw;
      case 'permission_change':
        return Shield;
      default:
        return Settings;
    }
  };

  // 获取对象类型图标
  const getObjectTypeIcon = (objectType: string) => {
    switch (objectType) {
      case 'MediaPlatform':
        return Monitor;
      case 'MediaAccount':
        return Building2;
      case 'DefaultSettings':
        return Settings;
      case 'FGInfo':
        return Info;
      case 'Optimizer':
        return User;
      case 'MediaPermission':
        return Shield;
      case 'FacebookBM':
      case 'FacebookAdAccount':
        return Smartphone;
      default:
        return Settings;
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}小时前`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 展开/收起日志详情
  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  // 查看日志详情
  const viewLogDetail = (log: OperationLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  // 重置筛选器
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      module: 'all',
      action: 'all',
      objectType: 'all',
      status: 'all',
      dateRange: {
        start: '',
        end: ''
      },
      userId: ''
    });
  };

  // 导出日志
  const exportLogs = () => {
    const csvContent = [
      ['时间', '用户', '模块', '操作', '对象类型', '对象名称', '描述', '状态', 'IP地址'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.module,
        log.action,
        log.objectType,
        log.objectName,
        log.description,
        log.status,
        log.ipAddress || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `操作日志_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>高级筛选</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出日志</span>
          </button>
        </div>
      </div>

      {/* 高级筛选器 */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* 搜索词 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">搜索关键词</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索操作记录..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

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

            {/* 对象类型筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">对象类型</label>
              <select
                value={filters.objectType}
                onChange={(e) => setFilters(prev => ({ ...prev, objectType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {objectTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 状态筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 用户筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">操作用户</label>
              <select
                value={filters.userId}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有用户</option>
                {userOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 开始日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 结束日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 筛选器操作按钮 */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              重置筛选
            </button>
            <div className="text-sm text-gray-500">
              共找到 {filteredLogs.length} 条记录
            </div>
          </div>
        </div>
      )}

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
                  对象
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                const ObjectTypeIcon = getObjectTypeIcon(log.objectType);
                const isExpanded = expandedLogs[log.id];
                
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-gray-50">
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
                          <span className="text-sm text-gray-900">{log.userName}</span>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <ObjectTypeIcon className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{log.objectName}</div>
                            <div className="text-xs text-gray-500">{log.objectType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {log.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(log.status)}`}>
                          {statusOptions.find(opt => opt.value === log.status)?.label || log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleLogExpansion(log.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title={isExpanded ? '收起详情' : '展开详情'}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => viewLogDetail(log)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 展开的详情行 */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* 基本信息 */}
                              <div className="space-y-3">
                                <h4 className="font-medium text-gray-900">基本信息</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">操作ID:</span>
                                    <span className="text-gray-900">{log.id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">IP地址:</span>
                                    <span className="text-gray-900">{log.ipAddress || '未知'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">操作时间:</span>
                                    <span className="text-gray-900">{log.timestamp}</span>
                                  </div>
                                </div>
                              </div>

                              {/* 变更详情 */}
                              <div className="space-y-3">
                                <h4 className="font-medium text-gray-900">变更详情</h4>
                                {log.objectDetails.changes && log.objectDetails.changes.length > 0 ? (
                                  <div className="space-y-2">
                                    {log.objectDetails.changes.map((change, index) => (
                                      <div key={index} className="text-sm p-2 bg-blue-50 rounded border border-blue-200">
                                        <div className="font-medium text-blue-900">{change.field}</div>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                          <div>
                                            <span className="text-blue-600">原值:</span>
                                            <span className="ml-1 text-blue-900">{String(change.oldValue)}</span>
                                          </div>
                                          <div>
                                            <span className="text-blue-600">新值:</span>
                                            <span className="ml-1 text-blue-900">{String(change.newValue)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    {log.action === 'create' ? '新增对象' : '无具体变更记录'}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 完整对象信息 */}
                            {(log.objectDetails.before || log.objectDetails.after) && (
                              <div className="space-y-3">
                                <h4 className="font-medium text-gray-900">完整对象信息</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {log.objectDetails.before && (
                                    <div>
                                      <h5 className="text-sm font-medium text-gray-700 mb-2">操作前</h5>
                                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                        {JSON.stringify(log.objectDetails.before, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  {log.objectDetails.after && (
                                    <div>
                                      <h5 className="text-sm font-medium text-gray-700 mb-2">操作后</h5>
                                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                        {JSON.stringify(log.objectDetails.after, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

      {/* 日志详情模态框 */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">操作日志详情</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">基本信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">操作ID:</span>
                      <span className="text-gray-900 font-mono">{selectedLog.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">操作用户:</span>
                      <span className="text-gray-900">{selectedLog.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">操作类型:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                        {actionOptions.find(opt => opt.value === selectedLog.action)?.label || selectedLog.action}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">所属模块:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModuleColor(selectedLog.module)}`}>
                        {moduleOptions.find(opt => opt.value === selectedLog.module)?.label || selectedLog.module}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">对象信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">对象类型:</span>
                      <span className="text-gray-900">{selectedLog.objectType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">对象名称:</span>
                      <span className="text-gray-900">{selectedLog.objectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">对象ID:</span>
                      <span className="text-gray-900 font-mono">{selectedLog.objectId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">操作状态:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                        {statusOptions.find(opt => opt.value === selectedLog.status)?.label || selectedLog.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作描述 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">操作描述</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLog.description}</p>
              </div>

              {/* 变更详情 */}
              {selectedLog.objectDetails.changes && selectedLog.objectDetails.changes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">具体变更</h4>
                  <div className="space-y-3">
                    {selectedLog.objectDetails.changes.map((change, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="font-medium text-blue-900 mb-2">{change.field}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-blue-600 font-medium">原值:</span>
                            <div className="mt-1 p-2 bg-white rounded border border-blue-200">
                              <pre className="text-sm text-blue-900 whitespace-pre-wrap">{String(change.oldValue)}</pre>
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">新值:</span>
                            <div className="mt-1 p-2 bg-white rounded border border-blue-200">
                              <pre className="text-sm text-blue-900 whitespace-pre-wrap">{String(change.newValue)}</pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 完整对象信息 */}
              {(selectedLog.objectDetails.before || selectedLog.objectDetails.after) && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">完整对象信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedLog.objectDetails.before && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">操作前状态</h5>
                        <pre className="text-xs bg-gray-100 p-3 rounded border overflow-auto max-h-64">
                          {JSON.stringify(selectedLog.objectDetails.before, null, 2)}
                        </pre>
                      </div>
                    )}
                    {selectedLog.objectDetails.after && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">操作后状态</h5>
                        <pre className="text-xs bg-gray-100 p-3 rounded border overflow-auto max-h-64">
                          {JSON.stringify(selectedLog.objectDetails.after, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 系统信息 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">系统信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">操作时间:</span>
                      <span className="text-gray-900">{selectedLog.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">IP地址:</span>
                      <span className="text-gray-900">{selectedLog.ipAddress || '未知'}</span>
                    </div>
                  </div>
                  {selectedLog.errorMessage && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">错误信息:</span>
                        <span className="text-red-600">{selectedLog.errorMessage}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
