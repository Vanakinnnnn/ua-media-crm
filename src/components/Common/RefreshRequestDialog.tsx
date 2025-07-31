import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { mockFacebookBMs } from '../../data/mockData';

interface RefreshRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string, target: string) => void;
}

interface FacebookBMOption {
  value: string;
  label: string;
  bmName: string;
  bmId: string;
}

export const RefreshRequestDialog: React.FC<RefreshRequestDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [refreshType, setRefreshType] = useState('账户管家');
  const [refreshTarget, setRefreshTarget] = useState('全部');
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 刷新类型选项
  const refreshTypeOptions = [
    { value: '账户管家', label: '账户管家' },
    { value: 'Facebook BM Client账户', label: 'Facebook BM Client账户' }
  ];

  // 获取Facebook BM选项
  const facebookBMOptions: FacebookBMOption[] = mockFacebookBMs.map(bm => ({
    value: `${bm.bmName} : ${bm.bmId}`,
    label: `${bm.bmName} : ${bm.bmId}`,
    bmName: bm.bmName,
    bmId: bm.bmId
  }));

  // 过滤后的BM选项
  const filteredBMOptions = facebookBMOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTargetDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 重置状态
  useEffect(() => {
    if (refreshType === '账户管家') {
      setRefreshTarget('全部');
    } else if (refreshType === 'Facebook BM Client账户') {
      setRefreshTarget('');
    }
    setSearchTerm('');
  }, [refreshType]);

  // 处理提交
  const handleSubmit = () => {
    onSubmit(refreshType, refreshTarget);
    onClose();
  };

  // 处理目标选择
  const handleTargetSelect = (value: string) => {
    setRefreshTarget(value);
    setIsTargetDropdownOpen(false);
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">刷新申请</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 弹窗内容 */}
        <div className="p-6 space-y-4">
          {/* 刷新类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              刷新类型 <span className="text-red-500">*</span>
            </label>
            <select
              value={refreshType}
              onChange={(e) => setRefreshType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {refreshTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 刷新对象 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              刷新对象 <span className="text-red-500">*</span>
            </label>
            
            {refreshType === '账户管家' ? (
              // 账户管家时显示不可编辑的"全部"
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                全部
              </div>
            ) : (
              // Facebook BM Client账户时显示可搜索的下拉菜单
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTargetDropdownOpen(!isTargetDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className={`truncate ${refreshTarget ? 'text-gray-900' : 'text-gray-500'}`}>
                    {refreshTarget || '请选择Facebook BM'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isTargetDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTargetDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    {/* 搜索框 */}
                    <div className="p-2 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="搜索BM名称或ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* 选项列表 */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredBMOptions.length > 0 ? (
                        filteredBMOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleTargetSelect(option.value)}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                              refreshTarget === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                            }`}
                          >
                            <div className="truncate">{option.label}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          没有找到匹配的BM
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 弹窗底部 */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={refreshType === 'Facebook BM Client账户' && !refreshTarget}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交申请
          </button>
        </div>
      </div>
    </div>
  );
}; 