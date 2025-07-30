import React, { useState } from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import { Optimizer, MediaPermission, MediaAccount } from '../../types';
import { mockOptimizers, mockMediaAccounts } from '../../data/mockData';

interface OptimizerModuleProps {
  refreshSuccess?: boolean;
}

export const OptimizerModule: React.FC<OptimizerModuleProps> = ({ refreshSuccess }) => {
  const [optimizers] = useState<Optimizer[]>(mockOptimizers); // 优化师信息只读，来源Hamburger平台
  const [accounts] = useState<MediaAccount[]>(mockMediaAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrganizationDepartment, setFilterOrganizationDepartment] = useState<string>('all');
  const [filterPermissionDepartment, setFilterPermissionDepartment] = useState<string>('all');

  const departmentOptions = ['010', '045', '055', '060', '919'];
  const platformOptions = ['TikTok', 'Google Ads', 'Unity', 'Facebook', 'Applovin', 'Moloco'];
  const accountManagerOptions = ['Main Account Manager', 'Campaign Manager', 'Performance Manager', 'Business Manager', 'Ad Manager', 'Network Manager', 'Analytics Manager', 'DSP Manager', 'Growth Manager', 'Lead Manager', 'Senior Manager'];


  // 根据优化师权限部门获取可用的账户列表（排除Google主MCC）
  const getAvailableAccounts = (permissionDepartments: string[], platform: string): MediaAccount[] => {
    return accounts.filter(account => {
      // 排除Google主MCC账户
      if (account.type === 'mcc' && account.defaultSettings?.mccType === 'main') {
        return false;
      }
      // 账户的部门必须与优化师的权限部门有交集
      return account.departments.some(dept => permissionDepartments.includes(dept));
    }).filter(account => {
      // 过滤匹配的平台
      const accountPlatform = accounts.find(a => a.id === account.id);
      // 这里需要通过platformId映射到平台类型，暂时简化处理
      return true; // 实际实现中需要根据platformId匹配
    });
  };

  const renderMediaPermissions = (optimizer: Optimizer) => {
    return (
      <div className="space-y-2 min-w-[400px]">
        {optimizer.mediaPermissions.map((permission) => (
          <div key={permission.id} className="text-sm border border-gray-200 rounded p-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="font-medium text-gray-600">媒体:</span> {permission.platform}</div>
              <div><span className="font-medium text-gray-600">账户管家:</span> {permission.accountManager || '-'}</div>
              <div><span className="font-medium text-gray-600">账户名称:</span> {permission.accountName || '-'}</div>
              <div><span className="font-medium text-gray-600">邮箱:</span> <span className="text-blue-600">{permission.email}</span></div>
              {permission.userId && (
                <div className="col-span-2"><span className="font-medium text-gray-600">用户ID:</span> {permission.userId}</div>
              )}
            </div>
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
        <div className="text-sm text-gray-600">
          数据来源：Hamburger平台（只读）
        </div>
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
              value={filterOrganizationDepartment}
              onChange={(e) => setFilterOrganizationDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有组织部门</option>
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterPermissionDepartment}
              onChange={(e) => setFilterPermissionDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有权限部门</option>
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
                  <th className="w-80 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {optimizers
                  .filter(optimizer => {
                    // 按搜索词过滤
                    const matchesSearch = !searchTerm || 
                      optimizer.slackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      optimizer.email.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    // 按组织部门过滤
                    const matchesOrgDept = filterOrganizationDepartment === 'all' || 
                      optimizer.organizationDepartment === filterOrganizationDepartment;
                    
                    // 按权限部门过滤
                    const matchesPermDept = filterPermissionDepartment === 'all' ||
                      optimizer.permissionDepartments.includes(filterPermissionDepartment as '010' | '045' | '055' | '060' | '919');
                    
                    return matchesSearch && matchesOrgDept && matchesPermDept;
                  })
                  .map((optimizer) => (
                    <tr key={optimizer.id} className="hover:bg-gray-50">
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
                    </tr>
                  ))
                }
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};