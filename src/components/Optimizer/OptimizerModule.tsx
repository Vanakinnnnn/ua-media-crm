import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Check, X, Clock, Save } from 'lucide-react';
import { Optimizer, MediaPermission } from '../../types';
import { mockOptimizers } from '../../data/mockData';

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

  const departmentOptions = ['010', '045', '055', '060', '919'];
  const platformOptions = ['TikTok', 'Google Ads', 'Unity', 'Facebook', 'Twitter'];


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
      email: ''
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

  const renderMediaPermissions = (optimizer: Optimizer) => {
    return (
      <div className="space-y-2 min-w-[250px]">
        {optimizer.mediaPermissions.map((permission) => (
          <div key={permission.id} className="text-sm border border-gray-200 rounded p-2">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-blue-600">{permission.platform}</span>
            </div>
            {permission.accountManager && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">账户管家:</span> {permission.accountManager}
              </div>
            )}
            <div className="text-xs text-gray-600">
              <span className="font-medium">邮箱:</span> {permission.email}
            </div>
            {permission.facebookUserId && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">用户ID:</span> {permission.facebookUserId}
              </div>
            )}
          </div>
        ))}
        {optimizer.mediaPermissions.length === 0 && (
          <span className="text-sm text-gray-500">暂无权限</span>
        )}
      </div>
    );
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
                        <div className="text-sm text-gray-900">{optimizer.trainingEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          optimizer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {optimizer.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="truncate">{optimizer.lastUpdated}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">只读</span>
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