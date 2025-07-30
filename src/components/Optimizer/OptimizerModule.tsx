import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Check, X, Clock, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { Optimizer, MediaPermission } from '../../types';
import { mockOptimizers, mockMediaAccounts, mockMediaPlatforms } from '../../data/mockData';
import { PlatformLogo } from '../Common/PlatformLogo';

interface OptimizerModuleProps {
  refreshSuccess?: boolean;
}

export const OptimizerModule: React.FC<OptimizerModuleProps> = ({ refreshSuccess }) => {
  const [optimizers, setOptimizers] = useState<Optimizer[]>(mockOptimizers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [editingOptimizer, setEditingOptimizer] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Optimizer>>({});
  const [permissionForm, setPermissionForm] = useState<MediaPermission[]>([]);
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set());

  const departmentOptions = ['010', '045', '055', '060', '919'];
  const platformOptions = ['TikTok', 'Google Ads', 'Unity', 'Facebook', 'Twitter'];

  // 获取可用的账户管家选项
  const getAvailableAccounts = (platform: string, optimizerPermissionDepartments: string[]) => {
    // 根据平台找到对应的平台ID
    const mediaPlat = mockMediaPlatforms.find(p => p.type === platform);
    if (!mediaPlat) return [];

    // 找到该平台下的所有账户，排除Google Ads的主MCC
    const platformAccounts = mockMediaAccounts.filter(account => {
      if (account.platformId !== mediaPlat.id) return false;
      
      // 如果是Google Ads，排除主MCC（mccType为'main'的账户）
      if (platform === 'Google Ads' && account.defaultSettings?.mccType === 'main') {
        return false;
      }
      
      return true;
    });

    // 筛选出与优化师权限部门有交集的账户
    const availableAccounts = platformAccounts.filter(account => {
      const accountDepts = account.departments || [];
      return optimizerPermissionDepartments.some(dept => accountDepts.includes(dept));
    });

    return availableAccounts.map(account => ({
      value: account.name,
      label: account.name
    }));
  };


  const handleEdit = (optimizer: Optimizer) => {
    setEditingOptimizer(optimizer.id);
    setEditForm({ ...optimizer });
    setPermissionForm([...optimizer.mediaPermissions]);
  };

  const handleSave = () => {
    if (editingOptimizer && editForm) {
      setOptimizers(prev => prev.map(optimizer => 
        optimizer.id === editingOptimizer 
          ? { ...optimizer, ...editForm, mediaPermissions: permissionForm, lastUpdated: new Date().toLocaleString() }
          : optimizer
      ));
      setEditingOptimizer(null);
      setEditForm({});
      setPermissionForm([]);
    }
  };

  const handleCancel = () => {
    setEditingOptimizer(null);
    setEditForm({});
    setPermissionForm([]);
  };

  const updateEditForm = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };


  const addPermission = () => {
    const newPermission: MediaPermission = {
      id: Date.now().toString(),
      platform: '',
      accountManager: '',
      email: '',
      facebookUserId: ''
    };
    setPermissionForm(prev => [...prev, newPermission]);
  };

  const updatePermission = (index: number, field: string, value: string) => {
    setPermissionForm(prev => prev.map((perm, i) => 
      i === index ? { ...perm, [field]: value } : perm
    ));
  };

  const removePermission = (index: number) => {
    setPermissionForm(prev => prev.filter((_, i) => i !== index));
  };

  // 切换权限展开/折叠状态
  const togglePermissionExpansion = (optimizerId: string) => {
    setExpandedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optimizerId)) {
        newSet.delete(optimizerId);
      } else {
        newSet.add(optimizerId);
      }
      return newSet;
    });
  };



  // 方案1: 紧凑标签式布局
  const renderMediaPermissions_Layout1 = (optimizer: Optimizer) => {
    return (
      <div className="space-y-1 min-w-[280px]">
        {optimizer.mediaPermissions.map((permission) => (
          <div key={permission.id} className="flex items-center space-x-2 py-1">
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 min-w-[80px] text-center">
              {permission.platform}
            </span>
            {permission.accountManager && (
              <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 truncate max-w-[120px]" title={permission.accountManager}>
                {permission.accountManager}
              </span>
            )}
            <span className="text-xs text-gray-500 truncate" title={permission.email}>
              📧 {permission.email.split('@')[0]}
            </span>
            {permission.facebookUserId && (
              <span className="px-1 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700">
                ID: {permission.facebookUserId.slice(-4)}
              </span>
            )}
          </div>
        ))}
        {optimizer.mediaPermissions.length === 0 && (
          <span className="text-sm text-gray-500">暂无权限</span>
        )}
      </div>
    );
  };

  // 方案2: 表格式分列布局
  const renderMediaPermissions_Layout2 = (optimizer: Optimizer) => {
    return (
      <div className="min-w-[320px]">
        {optimizer.mediaPermissions.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 border-b pb-1">
              <div>平台</div>
              <div>账户</div>
              <div>联系</div>
            </div>
            {optimizer.mediaPermissions.map((permission) => (
              <div key={permission.id} className="grid grid-cols-3 gap-2 text-sm py-1">
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {permission.platform}
                  </span>
                </div>
                <div className="truncate" title={permission.accountManager}>
                  {permission.accountManager || '-'}
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600 truncate" title={permission.email}>
                    {permission.email}
                  </div>
                  {permission.facebookUserId && (
                    <div className="text-xs text-yellow-600">
                      ID: {permission.facebookUserId}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-500">暂无权限</span>
        )}
      </div>
    );
  };

  // 方案3: 卡片堆叠式布局  
  const renderMediaPermissions_Layout3 = (optimizer: Optimizer) => {
    return (
      <div className="space-y-2 min-w-[260px]">
        {optimizer.mediaPermissions.map((permission) => (
          <div key={permission.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-600 text-sm">{permission.platform}</span>
              {permission.facebookUserId && (
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                  {permission.facebookUserId}
                </span>
              )}
            </div>
            {permission.accountManager && (
              <div className="text-sm font-medium text-gray-700 mb-1">
                {permission.accountManager}
              </div>
            )}
            <div className="text-xs text-gray-500">
              {permission.email}
            </div>
          </div>
        ))}
        {optimizer.mediaPermissions.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            暂无媒体权限
          </div>
        )}
      </div>
    );
  };

  // 方案4: 图标式单行布局
  const renderMediaPermissions_Layout4 = (optimizer: Optimizer) => {
    return (
      <div className="space-y-2 min-w-[300px]">
        {optimizer.mediaPermissions.map((permission) => (
          <div key={permission.id} className="flex items-center space-x-3 p-2 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
            <div className="flex items-center space-x-2 min-w-[100px]">
              <PlatformLogo platform={permission.platform} size="md" />
              <span className="text-sm font-medium text-gray-700">{permission.platform}</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex-1 min-w-0">
              {permission.accountManager && (
                <div className="text-sm font-medium text-gray-800 truncate">
                  {permission.accountManager}
                </div>
              )}
              <div className="text-xs text-gray-500 truncate" title={permission.email}>
                {permission.email}
              </div>
              {permission.facebookUserId && (
                <div className="text-xs text-yellow-600">
                  User ID: {permission.facebookUserId}
                </div>
              )}
            </div>
          </div>
        ))}
        {optimizer.mediaPermissions.length === 0 && (
          <div className="text-center py-3 text-gray-500 text-sm">
            <span className="text-2xl mb-2 block">📭</span>
            暂无媒体权限
          </div>
        )}
      </div>
    );
  };

  // 方案5: 极简列表式布局
  const renderMediaPermissions_Layout5 = (optimizer: Optimizer) => {
    return (
      <div className="min-w-[280px]">
        {optimizer.mediaPermissions.length > 0 ? (
          <div className="space-y-1">
            {optimizer.mediaPermissions.map((permission, index) => (
              <div key={permission.id} className="flex items-center text-sm py-1">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-800">{permission.platform}</span>
                  {permission.accountManager && (
                    <span className="text-gray-500"> → {permission.accountManager}</span>
                  )}
                  <div className="text-xs text-gray-400 truncate">
                    {permission.email}
                    {permission.facebookUserId && (
                      <span className="ml-2 text-yellow-600">({permission.facebookUserId})</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">暂无权限</div>
        )}
      </div>
    );
  };

  // 方案6: 折叠式布局
  const renderMediaPermissions_Layout6 = (optimizer: Optimizer) => {
    const isExpanded = expandedPermissions.has(optimizer.id);
    const permissionCount = optimizer.mediaPermissions.length;

    // 按平台分组权限
    const groupedPermissions = optimizer.mediaPermissions.reduce((acc, permission) => {
      if (!acc[permission.platform]) {
        acc[permission.platform] = [];
      }
      acc[permission.platform].push(permission);
      return acc;
    }, {} as Record<string, MediaPermission[]>);

    // 获取唯一平台列表用于预览
    const uniquePlatforms = Array.from(new Set(optimizer.mediaPermissions.map(p => p.platform)));

    return (
      <div className="min-w-[280px]">
        {/* 折叠头部 */}
        <div 
          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => togglePermissionExpansion(optimizer.id)}
        >
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              媒体权限 ({permissionCount})
            </span>
          </div>
          
          {/* 折叠状态下的平台Logo预览 */}
          {!isExpanded && permissionCount > 0 && (
            <div className="flex items-center space-x-2">
              {uniquePlatforms.slice(0, 4).map((platform) => (
                <PlatformLogo 
                  key={platform} 
                  platform={platform}
                  size="sm"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
              ))}
              {uniquePlatforms.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">+{uniquePlatforms.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* 展开的详细内容 */}
        {isExpanded && (
          <div className="mt-2 space-y-2 pl-4 border-l-2 border-blue-200">
            {permissionCount > 0 ? (
              Object.entries(groupedPermissions).map(([platform, permissions]) => (
                <div key={platform} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                  {/* 平台头部 */}
                  <div className="flex items-center space-x-3 mb-3 pb-2 border-b border-gray-100">
                    <PlatformLogo platform={platform} size="md" />
                    <span className="font-medium text-gray-800">{platform}</span>
                    <span className="text-xs text-gray-500">({permissions.length}个账户)</span>
                  </div>
                  
                  {/* 权限账户列表 */}
                  <div className="space-y-3">
                    {permissions.map((permission, index) => (
                      <div key={permission.id} className={`${index > 0 ? 'pt-3 border-t border-gray-100' : ''}`}>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          {permission.accountManager && (
                            <div className="text-gray-700">
                              <span className="font-medium text-gray-500">账户管家:</span> {permission.accountManager}
                            </div>
                          )}
                          
                          <div className="text-gray-700">
                            <span className="font-medium text-gray-500">媒体邮箱:</span> {permission.email}
                          </div>
                          
                          {permission.facebookUserId && (
                            <div className="text-gray-700">
                              <span className="font-medium text-gray-500">用户ID:</span> 
                              <span className="ml-1 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                                {permission.facebookUserId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic py-2">暂无媒体权限</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMediaPermissions = (optimizer: Optimizer) => {
    const isEditing = editingOptimizer === optimizer.id;
    
    if (isEditing) {
      return (
        <div className="space-y-3 min-w-[300px]">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">编辑媒体权限</h4>
            <button
              onClick={addPermission}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + 添加权限
            </button>
          </div>
          {permissionForm.map((permission, index) => {
            const currentOptimizer = optimizers.find(opt => opt.id === editingOptimizer);
            const availableAccounts = currentOptimizer ? getAvailableAccounts(permission.platform, currentOptimizer.permissionDepartments) : [];
            
            return (
              <div key={permission.id} className="space-y-2 p-2 border border-gray-200 rounded">
                <select
                  value={permission.platform}
                  onChange={(e) => {
                    updatePermission(index, 'platform', e.target.value);
                    updatePermission(index, 'accountManager', '');
                  }}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">选择平台</option>
                  {platformOptions.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                
                {permission.platform && (
                  <select
                    value={permission.accountManager || ''}
                    onChange={(e) => updatePermission(index, 'accountManager', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">选择账户管家</option>
                    {availableAccounts.map(account => (
                      <option key={account.value} value={account.value}>{account.label}</option>
                    ))}
                  </select>
                )}
                
                <input
                  type="email"
                  placeholder="邮箱地址"
                  value={permission.email}
                  onChange={(e) => updatePermission(index, 'email', e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {permission.platform === 'Facebook' && (
                  <input
                    type="text"
                    placeholder="用户ID"
                    value={permission.facebookUserId || ''}
                    onChange={(e) => updatePermission(index, 'facebookUserId', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                <button
                  onClick={() => removePermission(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    // 您可以在这里选择使用哪种布局方案
    // 当前使用方案6: 折叠式布局
    return renderMediaPermissions_Layout6(optimizer);
  };

  return (
    <div className="p-6 space-y-6">
      {refreshSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-800">提交成功</h4>
              <p className="text-sm text-green-700">刷新请求已成功提交，系统正在处理中...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">优化师管理</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索优化师姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有部门</option>
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>筛选</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    优化师信息
                  </th>
                  <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    组织部门
                  </th>
                  <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    权限部门
                  </th>
                  <th className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    媒体权限
                  </th>
                  <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    培训平台邮箱
                  </th>
                  <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    上次更新时间
                  </th>
                  <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {optimizers.map((optimizer) => {
                  const isEditing = editingOptimizer === optimizer.id;
                  
                  return (
                    <tr key={optimizer.id} className={`${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                           <span className="text-blue-600">{optimizer.slackName}</span>
                          </div>
                          <div className="text-sm text-gray-500">{optimizer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {optimizer.organizationDepartment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {optimizer.permissionDepartments.map(dept => (
                            <span key={dept} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {renderMediaPermissions(optimizer)}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="email"
                            placeholder="培训平台邮箱"
                            value={editForm.trainingEmail || ''}
                            onChange={(e) => updateEditForm('trainingEmail', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{optimizer.trainingEmail}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            value={editForm.status || ''}
                            onChange={(e) => updateEditForm('status', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            optimizer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {optimizer.status === 'active' ? 'Active' : 'Closed'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="truncate">{optimizer.lastUpdated}</div>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={handleSave}
                              className="p-1 text-green-600 hover:text-green-900 hover:bg-green-100 rounded"
                              title="保存"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded"
                              title="取消"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEdit(optimizer)}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded"
                              title="编辑权限信息"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};