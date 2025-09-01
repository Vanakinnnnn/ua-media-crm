import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Minus,
  FileText,
  TrendingUp,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';
import { RefreshRecord } from '../../types';
import { mockRefreshRecords } from '../../data/mockData';

type SortField = 'submitTime' | 'updateTime';
type SortDirection = 'asc' | 'desc';

interface RefreshRecordsProps {
  isOpen: boolean;
  onClose: () => void;
}

const RefreshRecords: React.FC<RefreshRecordsProps> = ({ isOpen, onClose }) => {
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const [records] = useState<RefreshRecord[]>(mockRefreshRecords);
  
  // 排序状态
  const [sortField, setSortField] = useState<SortField>('submitTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // 筛选状态
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  // 下拉菜单ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };

    if (isTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTypeDropdownOpen]);

  // 处理排序
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 获取排序图标
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-blue-600" /> : 
      <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  // 处理类型筛选
  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setIsTypeDropdownOpen(false);
  };

  // 获取筛选显示文本
  const getFilterDisplayText = () => {
    switch (typeFilter) {
      case 'all':
        return '全部类型';
      case '账户管家':
        return '账户管家';
      case 'Facebook BM Client账户':
        return 'Facebook BM';
      default:
        return '全部类型';
    }
  };

  // 筛选和排序后的记录
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;
    
    // 类型筛选
    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => record.refreshType === typeFilter);
    }
    
    // 排序
    filtered.sort((a, b) => {
      const aValue = new Date(a[sortField]).getTime();
      const bValue = new Date(b[sortField]).getTime();
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    return filtered;
  }, [records, typeFilter, sortField, sortDirection]);

  const toggleRecordExpansion = (recordId: string) => {
    const newExpanded = new Set(expandedRecords);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRecords(newExpanded);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: RefreshRecord['status']) => {
    switch (status) {
      case '成功':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case '失败':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case '执行中':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: RefreshRecord['status']) => {
    switch (status) {
      case '成功':
        return 'bg-green-100 text-green-800 border-green-200';
      case '失败':
        return 'bg-red-100 text-red-800 border-red-200';
      case '执行中':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '-';
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">刷新记录</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {records.length} 条记录
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 记录统计栏 */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              共 {filteredAndSortedRecords.length} 条记录
            </span>
            {typeFilter !== 'all' && (
              <button
                onClick={() => setTypeFilter('all')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* 表格内容区域 */}
        <div className="overflow-y-auto max-h-[calc(90vh-240px)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                  <div className="flex items-center space-x-1">
                    <span>申请类型</span>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* 下拉菜单 */}
                      {isTypeDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleTypeFilter('all')}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                typeFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                            >
                              全部类型
                            </button>
                            <button
                              onClick={() => handleTypeFilter('账户管家')}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                typeFilter === '账户管家' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                            >
                              账户管家
                            </button>
                            <button
                              onClick={() => handleTypeFilter('Facebook BM Client账户')}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                typeFilter === 'Facebook BM Client账户' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                            >
                              Facebook BM Client账户
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 当前筛选状态指示 */}
                  {typeFilter !== 'all' && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {getFilterDisplayText()}
                      </span>
                    </div>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('submitTime')}
                >
                  <div className="flex items-center space-x-1">
                    <span>提交时间</span>
                    {getSortIcon('submitTime')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('updateTime')}
                >
                  <div className="flex items-center space-x-1">
                    <span>更新时间</span>
                    {getSortIcon('updateTime')}
                  </div>
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
              {filteredAndSortedRecords.map((record) => {
                const isExpanded = expandedRecords.has(record.id);
                
                return (
                  <React.Fragment key={record.id}>
                    {/* 主行 */}
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.applicant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.refreshType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.submitTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.updateTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => toggleRecordExpansion(record.id)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <span>{isExpanded ? '收起' : '详情'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* 详细信息展开行 */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 基本信息 */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                申请详情
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">申请ID：</span>
                                  <span className="text-gray-900">{record.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">申请人：</span>
                                  <span className="text-gray-900">{record.applicant}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">刷新类型：</span>
                                  <span className="text-gray-900">{record.refreshType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">刷新对象：</span>
                                  <span className="text-gray-900">{record.refreshTarget}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">提交时间：</span>
                                  <span className="text-gray-900">{formatTime(record.submitTime)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">更新时间：</span>
                                  <span className="text-gray-900">{formatTime(record.updateTime)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">执行时长：</span>
                                  <span className="text-gray-900">{formatDuration(record.duration || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">执行状态：</span>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(record.status)}
                                    <span className="text-gray-900">{record.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                        {/* 执行结果 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            执行结果
                          </h4>
                          
                          {record.status === '失败' && record.errorMessage ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-red-800">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">执行失败</span>
                              </div>
                              <p className="text-red-700 text-sm mt-1">{record.errorMessage}</p>
                            </div>
                          ) : record.status === '执行中' ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-blue-800">
                                <Loader className="w-4 h-4 animate-spin" />
                                <span className="font-medium">正在执行中...</span>
                              </div>
                              <p className="text-blue-700 text-sm mt-1">请耐心等待刷新完成</p>
                            </div>
                          ) : record.results ? (
                            <div className="space-y-3">
                              {/* 新增 */}
                              {record.results.added && record.results.added.length > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 text-green-800 mb-2">
                                    <Plus className="w-4 h-4" />
                                    <span className="font-medium">新增 ({record.results.added.length})</span>
                                  </div>
                                  <div className="space-y-1">
                                    {record.results.added.map((item, index) => (
                                      <div key={index} className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 减少 */}
                              {record.results.removed && record.results.removed.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 text-red-800 mb-2">
                                    <Minus className="w-4 h-4" />
                                    <span className="font-medium">减少 ({record.results.removed.length})</span>
                                  </div>
                                  <div className="space-y-1">
                                    {record.results.removed.map((item, index) => (
                                      <div key={index} className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded">
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 未变更 */}
                              {record.results.unchanged !== undefined && record.results.unchanged > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 text-gray-700">
                                    <FileText className="w-4 h-4" />
                                    <span className="font-medium">未变更: {record.results.unchanged} 个账户</span>
                                  </div>
                                </div>
                              )}

                              {/* 无变更的情况 */}
                              {(!record.results.added || record.results.added.length === 0) &&
                               (!record.results.removed || record.results.removed.length === 0) &&
                               (record.results.unchanged === undefined || record.results.unchanged === 0) && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 text-gray-700">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium">刷新完成，无数据变更</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-700">
                                <FileText className="w-4 h-4" />
                                <span className="font-medium">暂无执行结果</span>
                              </div>
                            </div>
                          )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* 空状态 */}
          {filteredAndSortedRecords.length === 0 && (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无匹配的刷新记录</h3>
              <p className="text-gray-500">
                {records.length === 0 ? '还没有进行过刷新申请' : '请尝试调整筛选条件'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefreshRecords;
