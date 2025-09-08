import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { NotificationConfig } from '../../types';
import { mockNotificationConfig } from '../../data/mockData';

export const NotificationTab: React.FC = () => {
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig[]>(mockNotificationConfig);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<NotificationConfig>>({});

  // 开始编辑
  const startEditing = (item: NotificationConfig) => {
    setEditingId(item.id);
    setEditingData({
      approvalAM: [...item.approvalAM],
      growthManager: item.growthManager.length > 0 ? [item.growthManager[0]] : [],
      accountApprovalPerson: item.accountApprovalPerson,
      permissionApprovalPerson: item.permissionApprovalPerson,
      balanceNotificationPerson: [...item.balanceNotificationPerson],
      balanceNotificationChannel: item.balanceNotificationChannel
    });
  };

  // 保存编辑
  const saveEditing = () => {
    if (editingId && editingData) {
      setNotificationConfig(prev => 
        prev.map(item => 
          item.id === editingId 
            ? { ...item, ...editingData }
            : item
        )
      );
      setEditingId(null);
      setEditingData({});
    }
  };

  // 取消编辑
  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  // 更新编辑数据
  const updateEditingData = (field: keyof NotificationConfig, value: string | string[]) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };




  // 删除邮箱
  const removeEmail = (field: keyof NotificationConfig, index: number) => {
    if (!editingData) return;
    
    const currentValue = editingData[field];
    if (!Array.isArray(currentValue)) return;
    
    const newEmails = currentValue.filter((_, i) => i !== index);
    updateEditingData(field, newEmails);
  };

  // 简化版本：直接显示邮箱，不再使用角色图标
  const isRoleLabel = (_value: string) => {
    return false; // 不再使用角色标识
  };

  const renderRoleIcon = (value: string) => {
    return value; // 直接返回值，不渲染图标
  };

  return (
    <div className="space-y-6">
      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1200px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 border-r border-gray-200">
                  产品组
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  审批AM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  增长负责人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  开户申请审批人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  权限申请审批人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  余额不足通知人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  余额不足通知频道
                </th>
                <th className="sticky right-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-l border-gray-200">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notificationConfig.map((item) => {
                const isEditing = editingId === item.id;
                const editingItem = editingData;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* 产品组 - 固定左侧 */}
                    <td className={`sticky left-0 z-10 px-6 py-4 whitespace-nowrap border-r border-gray-200 ${isEditing ? 'bg-blue-50' : 'bg-white'}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {item.productGroup.code}
                      </div>
                    </td>
                    {/* 审批AM */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          {(editingItem.approvalAM || []).map((email, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex-1 text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                {isRoleLabel(email) ? renderRoleIcon(email) : email}
                              </div>
                              <button
                                onClick={() => removeEmail('approvalAM', index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <input
                            type="text"
                            placeholder="输入邮箱后按回车"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                updateEditingData('approvalAM', [...(editingItem.approvalAM || []), e.currentTarget.value.trim()]);
                                e.currentTarget.value = '';
                              }
                            }}
                          />

                        </div>
                      ) : (
                        <div className="space-y-1">
                          {item.approvalAM.map((email, index) => (
                            <div key={index} className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                              {isRoleLabel(email) ? renderRoleIcon(email) : email}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* 增长负责人 - 单邮箱 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingItem.growthManager?.[0] || ''}
                          onChange={(e) => updateEditingData('growthManager', [e.target.value])}
                          placeholder="请输入邮箱"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {item.growthManager.length > 0 ? item.growthManager[0] : '-'}
                        </div>
                      )}
                    </td>

                    {/* 开户申请审批人 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingItem.accountApprovalPerson || ''}
                            onChange={(e) => updateEditingData('accountApprovalPerson', e.target.value)}
                            placeholder="请输入邮箱"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />

                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {isRoleLabel(item.accountApprovalPerson) ? renderRoleIcon(item.accountApprovalPerson) : (item.accountApprovalPerson || '-')}
                        </div>
                      )}
                    </td>

                    {/* 权限申请审批人 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingItem.permissionApprovalPerson || ''}
                            onChange={(e) => updateEditingData('permissionApprovalPerson', e.target.value)}
                            placeholder="请输入邮箱"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />

                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {isRoleLabel(item.permissionApprovalPerson) ? renderRoleIcon(item.permissionApprovalPerson) : (item.permissionApprovalPerson || '-')}
                        </div>
                      )}
                    </td>

                    {/* 余额不足通知人 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          {(editingItem.balanceNotificationPerson || []).map((email, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex-1 text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                {isRoleLabel(email) ? renderRoleIcon(email) : email}
                              </div>
                              <button
                                onClick={() => removeEmail('balanceNotificationPerson', index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <input
                            type="text"
                            placeholder="输入邮箱后按回车"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                updateEditingData('balanceNotificationPerson', [...(editingItem.balanceNotificationPerson || []), e.currentTarget.value.trim()]);
                                e.currentTarget.value = '';
                              }
                            }}
                          />

                        </div>
                      ) : (
                        <div className="space-y-1">
                          {item.balanceNotificationPerson.map((email, index) => (
                            <div key={index} className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                              {isRoleLabel(email) ? renderRoleIcon(email) : email}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* 余额不足通知频道 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingItem.balanceNotificationChannel || ''}
                          onChange={(e) => updateEditingData('balanceNotificationChannel', e.target.value)}
                          placeholder="请输入频道"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {item.balanceNotificationChannel || '-'}
                        </div>
                      )}
                    </td>

                    {/* 操作按钮 - 固定右侧 */}
                    <td className={`sticky right-0 z-10 px-6 py-4 whitespace-nowrap text-sm font-medium border-l border-gray-200 ${isEditing ? 'bg-blue-50' : 'bg-white'}`}>
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={saveEditing}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="保存"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="取消"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="text-sm text-gray-500 text-center">
        共 {notificationConfig.length} 个产品组
      </div>
    </div>
  );
}; 
