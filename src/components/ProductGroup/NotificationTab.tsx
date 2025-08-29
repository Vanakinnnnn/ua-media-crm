import React, { useState } from 'react';
import { Edit2, Save, X, Settings } from 'lucide-react';
import { NotificationConfig } from '../../types';
import { mockNotificationConfig } from '../../data/mockData';

interface ColumnEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnName: string;
  field: keyof NotificationConfig;
  currentData: NotificationConfig[];
  currentItemId: string;
  isMultiple: boolean;
  currentValue: string | string[];
  onApply: (field: keyof NotificationConfig, data: any) => void;
}

const ColumnEditModal: React.FC<ColumnEditModalProps> = ({
  isOpen,
  onClose,
  columnName,
  field,
  currentData: _currentData,
  currentItemId: _currentItemId,
  isMultiple,
  currentValue: _currentValue,
  onApply
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    growthManager: boolean;
  }>({
    growthManager: false
  });



  // 初始化选中状态
  React.useEffect(() => {
    if (isOpen) {
      // 默认不勾选，让用户主动选择
      setSelectedOptions({
        growthManager: false
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    const result: any = {};
    
    if (isMultiple) {
      // 多选列：追加模式，更新所有行
      result.operation = 'updateAllRows';
      result.growthManager = selectedOptions.growthManager;
    } else {
      // 单选列：覆盖模式，让applyColumnEdit为每一行使用各自的增长负责人
      result.operation = 'updateAllRowsWithOwnGrowthManager';
      result.growthManager = selectedOptions.growthManager;
    }
    
    onApply(field, result);
    onClose();
    setSelectedOptions({ growthManager: false });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">编辑{columnName}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type={isMultiple ? "checkbox" : "radio"}
                checked={selectedOptions.growthManager}
                onChange={(e) => {
                  if (isMultiple) {
                    setSelectedOptions(prev => ({ ...prev, growthManager: e.target.checked }));
                  } else {
                    setSelectedOptions(prev => ({ 
                      ...prev, 
                      growthManager: e.target.checked
                    }));
                  }
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">添加本组增长负责人</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            应用
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationTab: React.FC = () => {
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig[]>(mockNotificationConfig);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<NotificationConfig>>({});
  const [columnEditModal, setColumnEditModal] = useState<{
    isOpen: boolean;
    columnName: string;
    field: keyof NotificationConfig;
  }>({
    isOpen: false,
    columnName: '',
    field: 'accountApprovalPerson'
  });

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

  // 打开列编辑模态框
  const openColumnEdit = (columnName: string, field: keyof NotificationConfig) => {
    setColumnEditModal({
      isOpen: true,
      columnName,
      field
    });
  };

  // 应用列编辑
  const applyColumnEdit = (field: keyof NotificationConfig, data: any) => {
    if (data.operation === 'updateAllRows') {
      // 多选列：追加模式，更新所有行
      setNotificationConfig(prev => 
        prev.map(item => {
          const currentValue = item[field];
          const currentArray = Array.isArray(currentValue) ? currentValue : [];
          let newArray = [...currentArray];
          
          // 处理增长负责人邮箱
          if (data.growthManager) {
            // 添加本组的增长负责人邮箱
            item.growthManager.forEach(gmEmail => {
              if (!newArray.includes(gmEmail)) {
                newArray.push(gmEmail);
              }
            });
          } else {
            // 移除本组的增长负责人邮箱
            newArray = newArray.filter(email => !item.growthManager.includes(email));
          }
          
          return {
            ...item,
            [field]: newArray
          };
        })
      );
      
      // 如果当前正在编辑，也更新编辑数据
      if (editingId) {
        const editingItem = notificationConfig.find(item => item.id === editingId);
        if (editingItem) {
          setEditingData(prev => {
            const currentValue = prev[field];
            const currentArray = Array.isArray(currentValue) ? currentValue : [];
            let newArray = [...currentArray];
            
            // 处理增长负责人邮箱
            if (data.growthManager) {
              // 添加本组的增长负责人邮箱
              editingItem.growthManager.forEach(gmEmail => {
                if (!newArray.includes(gmEmail)) {
                  newArray.push(gmEmail);
                }
              });
            } else {
              // 移除本组的增长负责人邮箱
              newArray = newArray.filter(email => !editingItem.growthManager.includes(email));
            }
            
            return { ...prev, [field]: newArray };
          });
        }
      }
    } else if (data.operation === 'updateAllRowsWithOwnGrowthManager') {
      // 单选列：为每一行使用各自的增长负责人
      setNotificationConfig(prev => 
        prev.map(item => {
          if (data.growthManager) {
            // 使用本组第一个增长负责人邮箱
            return {
              ...item,
              [field]: item.growthManager[0] || ''
            };
          } else {
            return {
              ...item,
              [field]: ''
            };
          }
        })
      );
      
      // 如果当前正在编辑，也更新编辑数据
      if (editingId) {
        const editingItem = notificationConfig.find(item => item.id === editingId);
        if (editingItem) {
          setEditingData(prev => ({ 
            ...prev, 
            [field]: data.growthManager ? (editingItem.growthManager[0] || '') : ''
          }));
        }
      }
    } else {
      // 单选列：覆盖模式（保留原有逻辑）
      setNotificationConfig(prev => 
        prev.map(item => {
          return {
            ...item,
            [field]: data.newValue
          };
        })
      );
      
      // 如果当前正在编辑，也更新编辑数据
      if (editingId) {
        setEditingData(prev => ({ ...prev, [field]: data.newValue }));
      }
    }
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
                  <div className="flex items-center space-x-2">
                    <span>开户申请审批人</span>
                    <button
                      onClick={() => openColumnEdit('开户申请审批人', 'accountApprovalPerson')}
                      className="text-blue-600 hover:text-blue-900"
                      title="编辑整列"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  <div className="flex items-center space-x-2">
                    <span>权限申请审批人</span>
                    <button
                      onClick={() => openColumnEdit('权限申请审批人', 'permissionApprovalPerson')}
                      className="text-blue-600 hover:text-blue-900"
                      title="编辑整列"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  <div className="flex items-center space-x-2">
                    <span>余额不足通知人</span>
                    <button
                      onClick={() => openColumnEdit('余额不足通知人', 'balanceNotificationPerson')}
                      className="text-blue-600 hover:text-blue-900"
                      title="编辑整列"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
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

      {/* 列编辑模态框 */}
      <ColumnEditModal
        isOpen={columnEditModal.isOpen}
        onClose={() => setColumnEditModal(prev => ({ ...prev, isOpen: false }))}
        columnName={columnEditModal.columnName}
        field={columnEditModal.field}
        currentData={notificationConfig}
        currentItemId={'all'}
        isMultiple={['balanceNotificationPerson'].includes(columnEditModal.field)}
        currentValue={editingId ? (editingData[columnEditModal.field] as string | string[] || '') : ''}
        onApply={applyColumnEdit}
      />
    </div>
  );
}; 
