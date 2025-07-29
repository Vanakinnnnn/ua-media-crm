import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, ChevronDown, ChevronRight, Save, X, Table, TreePine, Facebook, Check } from 'lucide-react';
import { MediaPlatform, MediaAccount, DefaultSettings, FGInfo } from '../../types';
import { mockMediaPlatforms, mockMediaAccounts } from '../../data/mockData';
import { FacebookAccountsModule } from './FacebookAccountsModule';

interface MediaModuleProps {
  refreshSuccess?: boolean;
}

// 自定义多选下拉组件
interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  label: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleSelectAll = () => {
    onChange(options);
  };

  const handleSelectNone = () => {
    onChange([]);
  };

  const removeItem = (item: string) => {
    onChange(value.filter(v => v !== item));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {value.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {value.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {item}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item);
                      }}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-1">
        {label} {value.length > 0 && `(${value.length})`}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                全选
              </button>
              <button
                onClick={handleSelectNone}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                全不选
              </button>
            </div>
          </div>
          {options.map(option => (
            <div
              key={option}
              onClick={() => handleToggleOption(option)}
              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                {value.includes(option) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MediaModule: React.FC<MediaModuleProps> = ({ refreshSuccess }) => {
  const [platforms] = useState<MediaPlatform[]>(mockMediaPlatforms);
  const [accounts, setAccounts] = useState<MediaAccount[]>(mockMediaAccounts);
  const [activeTab, setActiveTab] = useState<'media' | 'facebook'>('media');
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set());
  
  // 临时筛选器状态（用户输入但未应用）
  const [tempFilterStatus, setTempFilterStatus] = useState<string>('all');
  const [tempSelectedMediaTypes, setTempSelectedMediaTypes] = useState<string[]>([]);
  const [tempSelectedDepartments, setTempSelectedDepartments] = useState<string[]>([]);
  const [tempSearchKeyword, setTempSearchKeyword] = useState('');
  
  // 实际应用的筛选器状态
  const [appliedFilterStatus, setAppliedFilterStatus] = useState<string>('all');
  const [appliedSelectedMediaTypes, setAppliedSelectedMediaTypes] = useState<string[]>([]);
  const [appliedSelectedDepartments, setAppliedSelectedDepartments] = useState<string[]>([]);
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('');
  
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MediaAccount>>({});

  const departmentOptions = ['010', '045', '055', '060', '919'];
  const mediaTypeOptions = ['Facebook', 'Google Ads', 'TikTok', 'Applovin', 'Unity', 'Moloco'];

  // 搜索字段定义
  const getSearchableText = (account: MediaAccount, platform: MediaPlatform) => {
    const searchFields = [
      // 基本账户信息
      account.name,
      account.accountId,
      account.company,
      // 账户配置信息（注意：mainMccId不参与搜索，避免混淆）
      account.defaultSettings?.paymentProfileId,
      account.defaultSettings?.industryId,
      account.defaultSettings?.businessType,
      account.defaultSettings?.billingGroupId,
      account.defaultSettings?.mccType,
      // FG信息
      account.fgInfo?.dhId,
      account.fgInfo?.environment
      // 注意：状态、媒体类型、部门信息、主MCC ID不参与搜索，它们有专门的筛选器或特殊逻辑
    ];
    return searchFields.filter(Boolean).join(' ').toLowerCase();
  };

  // 高亮显示函数
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 font-medium">{part}</span> : 
        part
    );
  };

  // 应用筛选
  const handleApplyFilters = () => {
    setAppliedFilterStatus(tempFilterStatus);
    setAppliedSelectedMediaTypes(tempSelectedMediaTypes);
    setAppliedSelectedDepartments(tempSelectedDepartments);
    setAppliedSearchKeyword(tempSearchKeyword);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setTempFilterStatus('all');
    setTempSelectedMediaTypes([]);
    setTempSelectedDepartments([]);
    setTempSearchKeyword('');
    setAppliedFilterStatus('all');
    setAppliedSelectedMediaTypes([]);
    setAppliedSelectedDepartments([]);
    setAppliedSearchKeyword('');
  };

  // 筛选逻辑（使用已应用的筛选条件）
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const platform = platforms.find(p => p.id === account.platformId);
      
      // 状态筛选
      if (appliedFilterStatus !== 'all' && account.status !== appliedFilterStatus) return false;
      
      // 媒体类型筛选
      if (appliedSelectedMediaTypes.length > 0 && !appliedSelectedMediaTypes.includes(platform?.type || '')) return false;
      
      // 部门筛选
      if (appliedSelectedDepartments.length > 0) {
        const hasMatchingDept = account.departments.some(dept => appliedSelectedDepartments.includes(dept));
        if (!hasMatchingDept) return false;
      }
      
      // 关键词搜索
      if (appliedSearchKeyword) {
        const searchableText = getSearchableText(account, platform!);
        const matches = searchableText.includes(appliedSearchKeyword.toLowerCase());
        
        // 特殊逻辑：如果搜索关键词精准匹配某个主MCC的完整账户ID，则显示该主MCC下的所有子账户
        let isSubAccountOfMatchingMain = false;
        if (!matches && platform?.type === 'Google Ads' && account.parentId) {
          // 这是Google Ads子账户，检查其主账户的完整ID是否与搜索关键词精准匹配
          const mainAccount = accounts.find(acc => acc.id === account.parentId);
          if (mainAccount && mainAccount.accountId.toLowerCase() === appliedSearchKeyword.toLowerCase()) {
            isSubAccountOfMatchingMain = true;
          }
        }
        
        if (!matches && !isSubAccountOfMatchingMain) return false;
      }
      
      return true;
    });
  }, [accounts, platforms, appliedFilterStatus, appliedSelectedMediaTypes, appliedSelectedDepartments, appliedSearchKeyword]);

  const togglePlatform = (platformId: string) => {
    const newExpanded = new Set(expandedPlatforms);
    if (newExpanded.has(platformId)) {
      newExpanded.delete(platformId);
    } else {
      newExpanded.add(platformId);
    }
    setExpandedPlatforms(newExpanded);
  };

  const getAccountsForPlatform = (platformId: string) => {
    return accounts.filter(account => account.platformId === platformId);
  };

  const getChildAccounts = (parentId: string) => {
    return accounts.filter(account => account.parentId === parentId);
  };

  const handleEdit = (account: MediaAccount) => {
    setEditingAccount(account.id);
    setEditForm({ ...account });
  };

  const handleSave = () => {
    if (editingAccount && editForm) {
      setAccounts(prev => prev.map(account => 
        account.id === editingAccount 
          ? { ...account, ...editForm, lastUpdated: new Date().toLocaleString() }
          : account
      ));
      setEditingAccount(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingAccount(null);
    setEditForm({});
  };

  const updateEditForm = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const updateDefaultSettings = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      defaultSettings: { ...prev.defaultSettings, [field]: value }
    }));
  };

  const updateFGInfo = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      fgInfo: { ...(prev.fgInfo as Partial<FGInfo> ?? {}), [field]: value }
    }));
  };

  // 添加获取主账户的辅助函数
  const getMainAccount = (subAccount: MediaAccount): MediaAccount | null => {
    if (!subAccount.parentId) return null;
    return accounts.find(acc => acc.id === subAccount.parentId) || null;
  };

  // 获取主账户下所有子账户的部门合集
  const getMainAccountDepartments = (mainAccountId: string): string[] => {
    const subAccounts = accounts.filter(acc => acc.parentId === mainAccountId);
    const allDepts = subAccounts.flatMap(acc => acc.departments);
    return [...new Set(allDepts)]; // 去重
  };

  // 判断账户是否为Google Ads平台
  const isGoogleAdsAccount = (account: MediaAccount): boolean => {
    const platform = platforms.find(p => p.id === account.platformId);
    return platform?.type === 'Google Ads';
  };

  const renderDefaultSettingsForm = (account: MediaAccount, platform: MediaPlatform) => {
    const isEditing = editingAccount === account.id;
    const isGoogleAds = platform.type === 'Google Ads';
    const isTikTok = platform.type === 'TikTok';
    const isMain = !account.parentId;
    const mainAccount = isMain ? null : getMainAccount(account);
    
    // 获取设置值，子账户继承主账户的某些字段
    let settings;
    if (isEditing) {
      settings = editForm.defaultSettings || {};
    } else {
      settings = account.defaultSettings || {};
    }
    
    // 对于子账户的Payment Profile ID，使用主账户的值
    const paymentProfileId = isGoogleAds && !isMain && mainAccount 
      ? mainAccount.defaultSettings?.paymentProfileId 
      : settings.paymentProfileId;

    if (platform.type === 'Google Ads') {
      return (
        <div className="space-y-3 min-w-[200px]">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">MCC Type:</label>
            {/* 谷歌主MCC和子MCC都不能修改MCC Type */}
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              settings.mccType === 'main' 
                ? 'bg-blue-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {highlightText(settings.mccType === 'main' ? '主MCC' : settings.mccType === 'sub' ? '子MCC' : '-', appliedSearchKeyword)}
            </span>
          </div>
          {/* 主MCC ID 不再显示给任何账户 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Payment Profile ID:</label>
            {/* 只有谷歌主MCC可以编辑Payment Profile ID */}
            {isEditing && isMain ? (
              <input
                type="text"
                value={settings.paymentProfileId || ''}
                onChange={(e) => updateDefaultSettings('paymentProfileId', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-900">
                {highlightText(paymentProfileId || '-', appliedSearchKeyword)}
              </p>
            )}
          </div>
        </div>
      );
    } else if (platform.type === 'TikTok') {
      return (
        <div className="space-y-3 min-w-[200px]">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Industry ID:</label>
            {/* TikTok BC可以编辑所有账户配置信息 */}
            {isEditing ? (
              <input
                type="text"
                value={settings.industryId || ''}
                onChange={(e) => updateDefaultSettings('industryId', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-900">
                {highlightText(settings.industryId || '-', appliedSearchKeyword)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Business Type:</label>
            {isEditing ? (
              <input
                type="text"
                value={settings.businessType || ''}
                onChange={(e) => updateDefaultSettings('businessType', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-900">
                {highlightText(settings.businessType || '-', appliedSearchKeyword)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Billing Group ID:</label>
            {isEditing ? (
              <input
                type="text"
                value={settings.billingGroupId || ''}
                onChange={(e) => updateDefaultSettings('billingGroupId', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-900">
                {highlightText(settings.billingGroupId || '-', appliedSearchKeyword)}
              </p>
            )}
          </div>
        </div>
      );
    }
    
    // Facebook及其他媒体：账户配置列为空
    return <p className="text-sm text-gray-500">-</p>;
  };

  const renderDepartmentTags = (account: MediaAccount) => {
    const isEditing = editingAccount === account.id;
    const isGoogleAds = isGoogleAdsAccount(account);
    const isMain = !account.parentId;
    
    // 对于Google Ads主账户，部门由子账户合集决定，不可修改
    let departments;
    if (isGoogleAds && isMain) {
      departments = getMainAccountDepartments(account.id);
    } else {
      departments = isEditing ? editForm.departments || [] : account.departments;
    }

    // 部门编辑权限：
    // 1. 谷歌主MCC：不可编辑（由子账户决定）
    // 2. 谷歌子MCC：可编辑
    // 3. TikTok BC：可编辑
    // 4. Facebook及其他媒体：可编辑
    const canEditDepartments = isEditing && !(isGoogleAds && isMain);

    if (canEditDepartments) {
      return (
        <div className="space-y-2 min-w-[120px]">
          <label className="block text-xs font-medium text-gray-500 mb-2">选择部门:</label>
          <div className="grid grid-cols-2 gap-2">
            {departmentOptions.map(dept => (
              <label key={dept} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={departments.includes(dept)}
                  onChange={(e) => {
                    const newDepts = e.target.checked 
                      ? [...departments, dept]
                      : departments.filter(d => d !== dept);
                    updateEditForm('departments', newDepts);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{dept}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {departments.map(dept => (
          <span key={dept} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {dept}
          </span>
        ))}
      </div>
    );
  };

  const renderFGInfo = (account: MediaAccount) => {
    const isEditing = editingAccount === account.id;
    const isGoogleAds = isGoogleAdsAccount(account);
    const isMain = !account.parentId;
    const mainAccount = isMain ? null : getMainAccount(account);

    // 获取FG信息，子账户继承主账户的DHID和ENV
    let fgInfo: Partial<FGInfo>;
    if (isEditing) {
      fgInfo = editForm.fgInfo || {};
    } else {
      fgInfo = account.fgInfo || {};
    }
    
    // 对于Google Ads子账户，DHID和ENV继承主账户
    const dhId = isGoogleAds && !isMain && mainAccount 
      ? mainAccount.fgInfo?.dhId 
      : fgInfo.dhId;
    const environment = isGoogleAds && !isMain && mainAccount 
      ? mainAccount.fgInfo?.environment 
      : fgInfo.environment;

    // FG信息（DHID和ENV）全部不可编辑
    // if (isEditing && (isMain || !isGoogleAds)) {
    //   return (
    //     <div className="space-y-3 min-w-[180px]">
    //       <div>
    //         <label className="block text-xs font-medium text-gray-500 mb-1">DH ID:</label>
    //         <input
    //           type="text"
    //           value={fgInfo.dhId ?? ''}
    //           onChange={(e) => updateFGInfo('dhId', e.target.value)}
    //           className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-xs font-medium text-gray-500 mb-1">Environment:</label>
    //         <input
    //           type="text"
    //           value={fgInfo.environment ?? ''}
    //           onChange={(e) => updateFGInfo('environment', e.target.value)}
    //           className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //         />
    //       </div>
    //     </div>
    //   );
    // }

    return (
      <div className="text-sm space-y-1">
              <div>
          <span className="font-medium">DHID:</span> {highlightText(dhId ?? '', appliedSearchKeyword)}
        </div>
        <div>
          <span className="font-medium">ENV:</span> {highlightText(environment ?? '', appliedSearchKeyword)}
          </div>
      </div>
    );
  };

  // 2. 删除renderAccountTree和renderTreeView方法
  // function renderAccountTree ...
  // function renderTreeView ...

  const getGoogleAdsAccountsFlat = (accounts: MediaAccount[], filterFn?: (a: MediaAccount) => boolean) => {
    // 只处理Google Ads
    const googleAdsAccounts = accounts.filter(a => {
      const platform = platforms.find(p => p.id === a.platformId);
      return platform?.type === 'Google Ads';
    });
    // 先筛选
    const filtered = filterFn ? googleAdsAccounts.filter(filterFn) : googleAdsAccounts;
    // 找出所有需要展示的主账户ID
    const parentIds = new Set(filtered.map(a => a.parentId).filter(Boolean));
    const mainAccounts = googleAdsAccounts.filter(a => a.type === 'main' || a.type === 'mcc');
    // 需要补充的主账户
    const neededMain = mainAccounts.filter(a => parentIds.has(a.id));
    // 合并筛选结果和补充主账户
    const all = [...filtered, ...neededMain];
    // 按主账户-子账户顺序分组
    const grouped: MediaAccount[] = [];
    mainAccounts.forEach(main => {
      if (all.find(a => a.id === main.id || a.parentId === main.id)) {
        grouped.push(main);
        all.filter(a => a.parentId === main.id).forEach(sub => grouped.push(sub));
      }
    });
    return grouped;
  };

  const renderTableView = () => {
    // 只对Google Ads特殊处理
    const googleAdsPlatform = platforms.find(p => p.type === 'Google Ads');
    let googleAdsGroups: MediaAccount[][] = [];
    if (googleAdsPlatform) {
      // 使用筛选后的账户 - 确保所有筛选逻辑都已应用
      const googleAdsFiltered = filteredAccounts.filter(a => {
        const platform = platforms.find(p => p.id === a.platformId);
        return platform?.type === 'Google Ads';
      });
      // 对于Google Ads，还需要确保主子账户成对显示
      // 如果筛选结果包含子账户，需要补充其主账户
      const additionalParents: MediaAccount[] = [];
      
      googleAdsFiltered.forEach(account => {
        if (account.parentId) {
          // 这是子账户，需要确保其主账户也包含在内
          const parentAccount = accounts.find(a => a.id === account.parentId);
          if (parentAccount && !googleAdsFiltered.find(a => a.id === parentAccount.id)) {
            additionalParents.push(parentAccount);
          }
        }
      });
      
      const finalGoogleAdsAccounts = [...googleAdsFiltered, ...additionalParents];
      const sortedAccounts = getGoogleAdsAccountsFlat(finalGoogleAdsAccounts, () => true);
      
      // 将账户按主账户分组
      const groupMap = new Map<string, MediaAccount[]>();
      sortedAccounts.forEach(account => {
        if (!account.parentId) {
          // 主账户
          if (!groupMap.has(account.id)) {
            groupMap.set(account.id, []);
          }
          groupMap.get(account.id)!.unshift(account); // 主账户放在第一位
        } else {
          // 子账户
          if (!groupMap.has(account.parentId!)) {
            groupMap.set(account.parentId!, []);
          }
          groupMap.get(account.parentId!)!.push(account);
        }
      });
      
      googleAdsGroups = Array.from(groupMap.values()).filter(group => group.length > 0);
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                媒体
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                账户信息
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                部门
              </th>
              <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                账户配置
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FG信息
              </th>
              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                上次更新时间
              </th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* Google Ads主子账户边框分组展示 */}
            {googleAdsGroups.map((group, groupIndex) => (
              <React.Fragment key={`group-${groupIndex}`}>
                {group.map((account, accountIndex) => {
                  const isMain = !account.parentId;
                  const isFirstInGroup = accountIndex === 0;
                  const isLastInGroup = accountIndex === group.length - 1;
                  const isEditing = editingAccount === account.id;
                  
                  return (
                    <tr 
                      key={account.id} 
                      className={`
                        ${isMain ? 'font-bold bg-blue-50' : 'bg-white'} 
                        ${isFirstInGroup ? 'border-t-2 border-l-2 border-r-2 border-blue-200' : 'border-l-2 border-r-2 border-blue-200'}
                        ${isLastInGroup ? 'border-b-2 border-blue-200' : ''}
                        ${isMain && !isLastInGroup ? 'border-b border-blue-200' : ''}
                      `}
                    >
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {highlightText(googleAdsPlatform?.type || '-', appliedSearchKeyword)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {/* 账户信息内容 */}
                        {/* 账户信息编辑权限：只有谷歌子MCC可以编辑账户名称和ID，主MCC不可编辑 */}
                        {isEditing && !isMain ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Account Name"
                              value={editForm.name || ''}
                              onChange={(e) => updateEditForm('name', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              placeholder="Account ID"
                              value={editForm.accountId || ''}
                              onChange={(e) => updateEditForm('accountId', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {highlightText(account.name, appliedSearchKeyword)}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              ID: {highlightText(account.accountId, appliedSearchKeyword)}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {renderDepartmentTags(account)}
                      </td>
                      <td className="px-4 py-4">
                        {googleAdsPlatform && renderDefaultSettingsForm(account, googleAdsPlatform)}
                      </td>
                      <td className="px-4 py-4">
                        {renderFGInfo(account)}
                      </td>
                      <td className="px-4 py-4">
                        {/* 状态编辑权限：只有谷歌子MCC可以编辑状态，主MCC不可编辑 */}
                        {isEditing && !isMain ? (
                          <select
                            value={editForm.status || ''}
                            onChange={(e) => updateEditForm('status', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Active">Active</option>
                            <option value="Closed">Closed</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {account.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="truncate">{account.lastUpdated}</div>
                      </td>
                      <td className="px-4 py-4">
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
                              onClick={() => handleEdit(account)}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded"
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {/* 分组间间距 */}
                {groupIndex < googleAdsGroups.length - 1 && (
                  <tr>
                    <td colSpan={8} className="h-2"></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            
            {/* 其他平台原有展示（排除Google Ads） */}
            {filteredAccounts.filter(account => {
              const platform = platforms.find(p => p.id === account.platformId);
              return platform?.type !== 'Google Ads';
            }).map((account) => {
              const platform = platforms.find(p => p.id === account.platformId);
              const isEditing = editingAccount === account.id;
              
              return (
                <tr key={account.id} className={`${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'} border-b border-gray-200`}>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {highlightText(platform?.type || '-', appliedSearchKeyword)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {/* 其他平台账户信息：Facebook及其他媒体不可编辑账户信息，只有TikTok可以编辑 */}
                    {isEditing && platform?.type === 'TikTok' ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Account Name"
                          value={editForm.name || ''}
                          onChange={(e) => updateEditForm('name', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Account ID"
                          value={editForm.accountId || ''}
                          onChange={(e) => updateEditForm('accountId', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {highlightText(account.name, appliedSearchKeyword)}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          ID: {highlightText(account.accountId, appliedSearchKeyword)}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {renderDepartmentTags(account)}
                  </td>
                  <td className="px-4 py-4">
                    {platform && renderDefaultSettingsForm(account, platform)}
                  </td>
                  <td className="px-4 py-4">
                    {renderFGInfo(account)}
                  </td>
                  <td className="px-4 py-4">
                    {/* 其他平台状态编辑：只有TikTok可以编辑状态，Facebook及其他媒体不可编辑 */}
                    {isEditing && platform?.type === 'TikTok' ? (
                      <select
                        value={editForm.status || ''}
                        onChange={(e) => updateEditForm('status', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {account.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="truncate">{account.lastUpdated}</div>
                  </td>
                  <td className="px-4 py-4">
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
                          onClick={() => handleEdit(account)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded"
                          title="编辑"
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
    );
  };

  // 更新筛选器UI
  const renderFilters = () => (
    <div className="p-4 border-b border-gray-200 space-y-4">
      <div className="flex items-start space-x-4 flex-wrap gap-2">
        {/* 综合搜索 */}
        <div className="flex-1 min-w-[300px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索所有账户信息..."
            value={tempSearchKeyword}
            onChange={(e) => setTempSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* 状态筛选 */}
        <div>
          <select
            value={tempFilterStatus}
            onChange={(e) => setTempFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="text-xs text-gray-500 mt-1">状态</div>
        </div>
        
        {/* 媒体类型多选 */}
        <MultiSelect
          options={mediaTypeOptions}
          value={tempSelectedMediaTypes}
          onChange={setTempSelectedMediaTypes}
          placeholder="选择媒体类型"
          label="媒体类型"
        />
        
        {/* 部门多选 */}
        <MultiSelect
          options={departmentOptions}
          value={tempSelectedDepartments}
          onChange={setTempSelectedDepartments}
          placeholder="选择部门"
          label="部门"
        />
        
        {/* 筛选和重置按钮 */}
        <div className="flex gap-2">
                <button
            onClick={handleApplyFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>筛选</span>
                </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重置
                  </button>
                </div>
              </div>
              
      {/* 当前筛选条件显示 */}
      {(appliedFilterStatus !== 'all' || appliedSelectedMediaTypes.length > 0 || appliedSelectedDepartments.length > 0 || appliedSearchKeyword) && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm text-gray-600">当前筛选：</span>
            {appliedFilterStatus !== 'all' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                状态: {appliedFilterStatus}
              </span>
            )}
            {appliedSelectedMediaTypes.map(type => (
              <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                媒体: {type}
              </span>
            ))}
            {appliedSelectedDepartments.map(dept => (
              <span key={dept} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                部门: {dept}
              </span>
            ))}
            {appliedSearchKeyword && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                搜索: {appliedSearchKeyword}
              </span>
            )}
          </div>
                </div>
              )}
            </div>
          );

  // 3. 移除视图切换按钮和逻辑，只保留表格
  return (
    <div className="p-6 space-y-6">
      {refreshSuccess && activeTab === 'media' && (
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
        <div className="flex items-center space-x-6">
          <h2 className="text-2xl font-bold text-gray-900">媒体信息管理</h2>
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'media' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>媒体信息</span>
            </button>
            <button
              onClick={() => setActiveTab('facebook')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'facebook' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook 账户</span>
            </button>
          </div>
        </div>
        {activeTab === 'media' && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>添加Google子MCC</span>
          </button>
        )}
      </div>

      {activeTab === 'facebook' ? (
        <FacebookAccountsModule refreshSuccess={refreshSuccess} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {renderFilters()}
          {renderTableView()}
        </div>
      )}
    </div>
  );
};