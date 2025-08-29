import React, { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { BusinessInfo, TimezoneConfig } from '../../types';
import { mockBusinessInfo } from '../../data/mockData';

export const BusinessInfoTab: React.FC = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo[]>(mockBusinessInfo);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<BusinessInfo>>({});

  // 开始编辑
  const startEditing = (item: BusinessInfo) => {
    setEditingId(item.id);
    setEditingData({
      facebook: { 
        timezones: item.facebook.timezones.map(tz => ({ ...tz }))
      },
      google: { 
        timezones: item.google.timezones.map(tz => ({ ...tz }))
      },
      tiktok: { 
        promotionLink: item.tiktok.promotionLink,
        industryId: item.tiktok.industryId,
        timezones: item.tiktok.timezones.map(tz => ({ ...tz }))
      }
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

  // 更新简单字段
  const updateSimpleField = (platform: 'tiktok', field: string, value: string) => {
    setEditingData(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      } as any
    }));
  };

  // 更新时区数据
  const updateTimezone = (platform: 'facebook' | 'google' | 'tiktok', index: number, field: 'code' | 'location', value: string) => {
    setEditingData(prev => {
      const currentPlatform = prev[platform];
      if (!currentPlatform || !currentPlatform.timezones) return prev;
      
      const newTimezones = [...currentPlatform.timezones];
      newTimezones[index] = { ...newTimezones[index], [field]: value };
      
      return {
        ...prev,
        [platform]: {
          ...currentPlatform,
          timezones: newTimezones
        }
      };
    });
  };

  // 添加时区
  const addTimezone = (platform: 'facebook' | 'google' | 'tiktok') => {
    setEditingData(prev => {
      const currentPlatform = prev[platform];
      if (!currentPlatform) return prev;
      
      const newTimezone: TimezoneConfig = { code: '', location: '' };
      
      return {
        ...prev,
        [platform]: {
          ...currentPlatform,
          timezones: [...(currentPlatform.timezones || []), newTimezone]
        }
      };
    });
  };

  // 删除时区
  const removeTimezone = (platform: 'facebook' | 'google' | 'tiktok', index: number) => {
    setEditingData(prev => {
      const currentPlatform = prev[platform];
      if (!currentPlatform || !currentPlatform.timezones) return prev;
      
      const newTimezones = currentPlatform.timezones.filter((_, i) => i !== index);
      
      return {
        ...prev,
        [platform]: {
          ...currentPlatform,
          timezones: newTimezones
        }
      };
    });
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
                  Facebook
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Google
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TikTok
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

                    {/* Facebook - 时区 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-500">时区配置</div>
                            <button
                              onClick={() => addTimezone('facebook')}
                              className="text-blue-600 hover:text-blue-900"
                              title="添加时区"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {editingData.facebook?.timezones?.map((timezone, index) => (
                            <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-md">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">时区 {index + 1}</span>
                                {editingData.facebook!.timezones!.length > 1 && (
                                  <button
                                    onClick={() => removeTimezone('facebook', index)}
                                    className="text-red-600 hover:text-red-900"
                                    title="删除时区"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">时区代码</label>
                                  <input
                                    type="text"
                                    value={timezone.code}
                                    onChange={(e) => updateTimezone('facebook', index, 'code', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="UTC+8"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">地理名称</label>
                                  <input
                                    type="text"
                                    value={timezone.location}
                                    onChange={(e) => updateTimezone('facebook', index, 'location', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Asia/Singapore"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1 text-sm text-gray-900">
                          <div className="font-medium text-gray-500 mb-2">时区:</div>
                          {item.facebook.timezones.map((timezone, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                              <div><strong>代码:</strong> {timezone.code}</div>
                              <div><strong>地区:</strong> {timezone.location}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Google - 时区 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-500">时区配置</div>
                            <button
                              onClick={() => addTimezone('google')}
                              className="text-blue-600 hover:text-blue-900"
                              title="添加时区"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {editingData.google?.timezones?.map((timezone, index) => (
                            <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-md">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">时区 {index + 1}</span>
                                {editingData.google!.timezones!.length > 1 && (
                                  <button
                                    onClick={() => removeTimezone('google', index)}
                                    className="text-red-600 hover:text-red-900"
                                    title="删除时区"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">时区代码</label>
                                  <input
                                    type="text"
                                    value={timezone.code}
                                    onChange={(e) => updateTimezone('google', index, 'code', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="UTC+8"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">地理名称</label>
                                  <input
                                    type="text"
                                    value={timezone.location}
                                    onChange={(e) => updateTimezone('google', index, 'location', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Asia/Singapore"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1 text-sm text-gray-900">
                          <div className="font-medium text-gray-500 mb-2">时区:</div>
                          {item.google.timezones.map((timezone, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                              <div><strong>代码:</strong> {timezone.code}</div>
                              <div><strong>地区:</strong> {timezone.location}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* TikTok - Promotion Link, Industry ID, 时区 */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Promotion Link</div>
                            <input
                              type="text"
                              value={editingData.tiktok?.promotionLink || ''}
                              onChange={(e) => updateSimpleField('tiktok', 'promotionLink', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Promotion Link"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Industry ID</div>
                            <input
                              type="text"
                              value={editingData.tiktok?.industryId || ''}
                              onChange={(e) => updateSimpleField('tiktok', 'industryId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Industry ID"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium text-gray-500">时区配置</div>
                              <button
                                onClick={() => addTimezone('tiktok')}
                                className="text-blue-600 hover:text-blue-900"
                                title="添加时区"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            {editingData.tiktok?.timezones?.map((timezone, index) => (
                              <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-md mb-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">时区 {index + 1}</span>
                                  {editingData.tiktok!.timezones!.length > 1 && (
                                    <button
                                      onClick={() => removeTimezone('tiktok', index)}
                                      className="text-red-600 hover:text-red-900"
                                      title="删除时区"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">时区代码</label>
                                    <input
                                      type="text"
                                      value={timezone.code}
                                      onChange={(e) => updateTimezone('tiktok', index, 'code', e.target.value)}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="UTC+8"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">地理名称</label>
                                    <input
                                      type="text"
                                      value={timezone.location}
                                      onChange={(e) => updateTimezone('tiktok', index, 'location', e.target.value)}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Asia/Singapore"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm text-gray-900">
                          <div><strong>Promotion Link:</strong> {item.tiktok.promotionLink || '-'}</div>
                          <div><strong>Industry ID:</strong> {item.tiktok.industryId || '-'}</div>
                          <div>
                            <div className="font-medium text-gray-500 mb-1">时区:</div>
                            {item.tiktok.timezones.map((timezone, index) => (
                              <div key={index} className="bg-gray-50 p-2 rounded text-xs mb-1">
                                <div><strong>代码:</strong> {timezone.code}</div>
                                <div><strong>地区:</strong> {timezone.location}</div>
                              </div>
                            ))}
                          </div>
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
