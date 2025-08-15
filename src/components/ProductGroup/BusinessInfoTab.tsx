import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { BusinessInfo } from '../../types';
import { mockBusinessInfo } from '../../data/mockData';

export const BusinessInfoTab: React.FC = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo[]>(mockBusinessInfo);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<BusinessInfo>>({});

  // 开始编辑
  const startEditing = (item: BusinessInfo) => {
    setEditingId(item.id);
    setEditingData({
      tiktokPromotionLink: item.tiktokPromotionLink,
      tiktokIndustryId: item.tiktokIndustryId
    });
  };

  // 保存编辑
  const saveEditing = () => {
    if (editingId && editingData) {
      setBusinessInfo(prev => 
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
  const updateEditingData = (field: keyof BusinessInfo, value: string) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  产品组
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TikTok Promotion Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TikTok Industry ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {businessInfo.map((item) => {
                const isEditing = editingId === item.id;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* 产品组 - 只读 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.productGroup.code}
                      </div>
                    </td>

                    {/* TikTok Promotion Link */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingData.tiktokPromotionLink || ''}
                          onChange={(e) => updateEditingData('tiktokPromotionLink', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入TikTok推广链接"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {item.tiktokPromotionLink || '-'}
                        </div>
                      )}
                    </td>

                    {/* TikTok Industry ID */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingData.tiktokIndustryId || ''}
                          onChange={(e) => updateEditingData('tiktokIndustryId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入TikTok行业ID"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {item.tiktokIndustryId || '-'}
                        </div>
                      )}
                    </td>

                    {/* 操作按钮 */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
        共 {businessInfo.length} 个产品组
      </div>
    </div>
  );
};
