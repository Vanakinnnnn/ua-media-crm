import React, { useState, useMemo } from 'react';
import { Shield, Search, Filter, RotateCcw, ChevronDown, ChevronRight, Users, Building2, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { PermissionRelation, PermissionAudit } from '../../types';
import { mockPermissionRelations, mockPermissionAudits } from '../../data/mockData';
import MultiSelect from '../Common/MultiSelect';

interface GroupedPermission {
  platform: string;
  container: PermissionRelation['container'];
  account: PermissionRelation['account'];
  relationship: 'Owner' | 'Client'; // Facebook特殊处理
  department: string[]; // 账户所属部门
  optimizers: Array<{
    optimizer: PermissionRelation['optimizer'];
    permissions: PermissionRelation['permissions'];
    lastUpdated: string;
    mediaEmail?: string; // 媒体平台邮箱
  }>;
  lastUpdated: string;
}

// 确认对话框组件
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "确认",
  cancelText = "取消"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const PermissionModule: React.FC = () => {
  const [permissionRelations] = useState<PermissionRelation[]>(mockPermissionRelations);
  const [permissionAudits] = useState<PermissionAudit[]>(mockPermissionAudits);
  const [currentTab, setCurrentTab] = useState<'matrix' | 'audit'>('matrix');
  
  // 筛选状态管理
  const [tempFilters, setTempFilters] = useState({
    platforms: [] as string[],
    departments: [] as string[],
    optimizerStatus: [] as string[],
    searchKeyword: ''
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    platforms: [] as string[],
    departments: [] as string[],
    optimizerStatus: [] as string[],
    searchKeyword: ''
  });

  // 展开状态管理
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  
  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    accountInfo: string;
  }>({
    isOpen: false,
    accountInfo: ''
  });

  const platformOptions = ['Google Ads', 'Facebook', 'TikTok', 'Unity', 'Applovin', 'Moloco'];
  const departmentOptions = ['010', '045', '055', '060', '919'];
  const optimizerStatusOptions = ['Active', 'Inactive'];

  // 应用筛选
  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
  };

  // 重置筛选
  const handleResetFilters = () => {
    const resetFilters = {
      platforms: [] as string[],
      departments: [] as string[],
      optimizerStatus: [] as string[],
      searchKeyword: ''
    };
    setTempFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  // 搜索文本获取
  const getSearchableText = (relation: PermissionRelation): string => {
    return [
      relation.container.name,
      relation.container.id,
      relation.account.name,
      relation.account.id,
      relation.optimizer.name,
      relation.optimizer.email,
      ...relation.optimizer.department
    ].join(' ').toLowerCase();
  };

  // 高亮匹配文本
  const highlightText = (text: string, keyword: string): React.ReactNode => {
    if (!keyword.trim()) return text;
    
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 px-0.5 rounded">
          {part}
        </span>
      ) : part
    );
  };

  // 格式化权限显示 - 只显示真实角色名称
  const formatPermission = (permissions: PermissionRelation['permissions'], platform: string): React.ReactNode => {
    if (permissions.googleAds && platform === 'Google Ads') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {permissions.googleAds.role}
        </span>
      );
    }
    
    if (permissions.facebook && platform === 'Facebook') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {permissions.facebook.tasks.join(', ')}
        </span>
      );
    }
    
    if (permissions.tiktok && platform === 'TikTok') {
      return (
        <div className="flex gap-1">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            BC: {permissions.tiktok.businessCenter.role}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            AD: {permissions.tiktok.advertiser.role}
          </span>
        </div>
      );
    }
    
    if (permissions.other) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {permissions.other.role}
        </span>
      );
    }
    
    return <span className="text-gray-400">-</span>;
  };

  // 获取关系类型
  const getRelationshipType = (relation: PermissionRelation): 'Owner' | 'Client' => {
    if (relation.platform === 'Facebook' && relation.container.role) {
      return relation.container.role === 'Partner' ? 'Client' : relation.container.role as 'Owner' | 'Client';
    }
    return 'Owner';
  };

  // 获取媒体平台邮箱（模拟）
  const getMediaEmail = (optimizer: PermissionRelation['optimizer'], platform: string): string => {
    // 这里应该从实际数据中获取，现在模拟生成
    const domain = platform === 'Google Ads' ? 'gmail.com' : 
                   platform === 'Facebook' ? 'facebook.com' : 
                   platform === 'TikTok' ? 'tiktok.com' : 'platform.com';
    // 将姓名转换为邮箱格式（移除空格，转小写）
    const emailPrefix = optimizer.name.toLowerCase().replace(/\s+/g, '.');
    return `${emailPrefix}.${platform.toLowerCase().replace(' ', '')}@${domain}`;
  };

  // 筛选和分组权限关系
  const groupedPermissions = useMemo(() => {
    let filtered = permissionRelations;

    // 应用筛选条件
    if (appliedFilters.platforms.length > 0) {
      filtered = filtered.filter(relation => appliedFilters.platforms.includes(relation.platform));
    }
    
    if (appliedFilters.departments.length > 0) {
      filtered = filtered.filter(relation => 
        relation.optimizer.department.some(dept => appliedFilters.departments.includes(dept))
      );
    }
    
    if (appliedFilters.optimizerStatus.length > 0) {
      filtered = filtered.filter(relation => appliedFilters.optimizerStatus.includes(relation.optimizer.status));
    }
    
    if (appliedFilters.searchKeyword.trim()) {
      const keyword = appliedFilters.searchKeyword.toLowerCase();
      filtered = filtered.filter(relation => getSearchableText(relation).includes(keyword));
    }

    // 按容器-账户组合分组
    const grouped = new Map<string, GroupedPermission>();
    
    filtered.forEach(relation => {
      const accountKey = `${relation.platform}-${relation.container.id}-${relation.account.id}`;
      
      if (!grouped.has(accountKey)) {
        // 模拟账户部门（实际应从数据中获取）
        const accountDepartment = relation.optimizer.department.slice(0, 1); // 取第一个部门作为账户部门
        
        grouped.set(accountKey, {
          platform: relation.platform,
          container: relation.container,
          account: relation.account,
          relationship: getRelationshipType(relation),
          department: accountDepartment,
          optimizers: [],
          lastUpdated: relation.lastUpdated
        });
      }
      
      const group = grouped.get(accountKey)!;
      group.optimizers.push({
        optimizer: relation.optimizer,
        permissions: relation.permissions,
        lastUpdated: relation.lastUpdated,
        mediaEmail: getMediaEmail(relation.optimizer, relation.platform)
      });
      
      // 更新最后更新时间为最新的
      if (relation.lastUpdated > group.lastUpdated) {
        group.lastUpdated = relation.lastUpdated;
      }
    });

    return Array.from(grouped.values());
  }, [permissionRelations, appliedFilters]);

  // 切换账户展开状态
  const toggleAccountExpansion = (accountKey: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountKey)) {
      newExpanded.delete(accountKey);
    } else {
      newExpanded.add(accountKey);
    }
    setExpandedAccounts(newExpanded);
  };

  // 处理申请刷新
  const handleRefreshRequest = (group: GroupedPermission) => {
    setConfirmDialog({
      isOpen: true,
      accountInfo: `${group.platform} - ${group.account.name} (${group.account.id})`
    });
  };

  // 确认刷新
  const confirmRefresh = () => {
    // 这里应该调用实际的刷新API
    console.log('刷新权限数据:', confirmDialog.accountInfo);
    // 可以添加loading状态和成功/失败提示
  };

  // 渲染审计卡片
  const renderAuditCard = (audit: PermissionAudit) => {
    const severityColors = {
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    return (
      <div key={audit.type} className={`p-4 rounded-lg border-2 ${severityColors[audit.severity]}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{audit.title}</h3>
          <span className="text-2xl font-bold">{audit.count}</span>
        </div>
        <p className="text-sm mb-3">{audit.description}</p>
        {audit.items.length > 0 && (
          <div className="space-y-1">
            {audit.items.slice(0, 3).map((item, index) => (
              <div key={index} className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                {item}
              </div>
            ))}
            {audit.items.length > 3 && (
              <div className="text-xs text-gray-600">
                +{audit.items.length - 3} 更多
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染权限矩阵
  const renderPermissionMatrix = () => (
    <div className="space-y-6">
      {/* 筛选器区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">媒体平台</label>
            <MultiSelect
              options={platformOptions}
              selectedValues={tempFilters.platforms}
              onChange={(values) => setTempFilters(prev => ({ ...prev, platforms: values }))}
              placeholder="选择媒体平台"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
            <MultiSelect
              options={departmentOptions}
              selectedValues={tempFilters.departments}
              onChange={(values) => setTempFilters(prev => ({ ...prev, departments: values }))}
              placeholder="选择部门"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">优化师状态</label>
            <MultiSelect
              options={optimizerStatusOptions}
              selectedValues={tempFilters.optimizerStatus}
              onChange={(values) => setTempFilters(prev => ({ ...prev, optimizerStatus: values }))}
              placeholder="选择状态"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">综合搜索</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索账户、优化师..."
                value={tempFilters.searchKeyword}
                onChange={(e) => setTempFilters(prev => ({ ...prev, searchKeyword: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyFilters}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-1" />
            筛选
          </button>
          
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            重置
          </button>
        </div>
      </div>

      {/* 权限矩阵表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    账户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MCC/BM/BC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    关系
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    账户状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部门
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后更新
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedPermissions.map((group) => {
                const accountKey = `${group.platform}-${group.container.id}-${group.account.id}`;
                const isExpanded = expandedAccounts.has(accountKey);
                
                return (
                  <React.Fragment key={accountKey}>
                    {/* 账户层 */}
                    <tr className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleAccountExpansion(accountKey)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                {group.platform}
                              </span>
                              <div className="text-sm font-medium text-gray-900">
                                {highlightText(group.account.name, appliedFilters.searchKeyword)}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              账户ID: {highlightText(group.account.id, appliedFilters.searchKeyword)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {group.optimizers.length} 个优化师有权限
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {highlightText(group.container.name, appliedFilters.searchKeyword)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {group.container.type}: {highlightText(group.container.id, appliedFilters.searchKeyword)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          group.relationship === 'Owner' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {group.relationship}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          group.account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {group.account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {group.department.map(dept => (
                            <span key={dept} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {group.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRefreshRequest(group)}
                          className="inline-flex items-center px-2 py-1 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          申请刷新
                        </button>
                      </td>
                    </tr>
                    
                    {/* 优化师层 - 创新的卡片式展开 */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-0 py-0">
                          {/* 外层容器 - 增加左右缩进和阴影效果 */}
                          <div className="mx-8 my-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-inner">
                            {/* 连接线效果 */}
                            <div className="relative">
                              <div className="absolute left-4 top-0 w-0.5 h-full bg-blue-300"></div>
                              <div className="absolute left-3 top-4 w-3 h-0.5 bg-blue-300"></div>
                              
                              {/* 优化师列表 */}
                              <div className="pl-8 pr-4 py-4 space-y-3">
                                <div className="flex items-center mb-3">
                                  <Users className="h-4 w-4 text-blue-600 mr-2" />
                                  <span className="text-sm font-medium text-blue-900">
                                    权限优化师列表 ({group.optimizers.length}人)
                                  </span>
                                </div>
                                
                                {group.optimizers.map((opt, index) => (
                                  <div 
                                    key={`${accountKey}-${opt.optimizer.id}`} 
                                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 ml-4"
                                  >
                                    <div className="grid grid-cols-4 gap-4 items-center">
                                      {/* 优化师信息 */}
                                      <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" />
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-sm font-medium text-gray-900 truncate">
                                            {highlightText(opt.optimizer.name, appliedFilters.searchKeyword)}
                                          </div>
                                          <div className="text-xs text-gray-500 truncate">
                                            {highlightText(opt.optimizer.email, appliedFilters.searchKeyword)}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* 媒体平台邮箱 */}
                                      <div className="text-sm text-gray-600 truncate">
                                        <div className="flex items-center">
                                          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                          {opt.mediaEmail}
                                        </div>
                                      </div>
                                      
                                      {/* 权限配置 */}
                                      <div className="flex justify-center">
                                        {formatPermission(opt.permissions, group.platform)}
                                      </div>
                                      
                                      {/* 状态 */}
                                      <div className="flex justify-end">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          opt.optimizer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                            opt.optimizer.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'
                                          }`}></span>
                                          {opt.optimizer.status}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* 底部部门标签 */}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                      <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                          {opt.optimizer.department.map(dept => (
                                            <span key={dept} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                                              {highlightText(dept, appliedFilters.searchKeyword)}
                                            </span>
                                          ))}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                          更新: {opt.lastUpdated}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
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
        </div>
        
        {groupedPermissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无符合筛选条件的权限关系
          </div>
        )}
      </div>

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, accountInfo: '' })}
        onConfirm={confirmRefresh}
        title="确认申请刷新"
        message={`您确定要申请刷新以下账户的权限数据吗？\n\n${confirmDialog.accountInfo}\n\n刷新操作将从媒体平台API重新获取最新的权限关系数据。`}
        confirmText="确认刷新"
        cancelText="取消"
      />
    </div>
  );

  // 渲染权限审计
  const renderPermissionAudit = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {permissionAudits.map(renderAuditCard)}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600" />
          账户权限管理
        </h1>
        <p className="text-gray-600 mt-1">管理所有媒体平台的账户权限关系</p>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setCurrentTab('matrix')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'matrix'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            权限矩阵
          </button>
          <button
            onClick={() => setCurrentTab('audit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'audit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            权限审计
          </button>
        </nav>
      </div>

      {/* 标签页内容 */}
      {currentTab === 'matrix' && renderPermissionMatrix()}
      {currentTab === 'audit' && renderPermissionAudit()}
    </div>
  );
};

export default PermissionModule; 