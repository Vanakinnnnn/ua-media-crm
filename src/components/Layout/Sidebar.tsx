import React from 'react';
import { 
  Monitor, 
  Users, 
  Building, 
  Settings, 
  Activity, 
  Archive,
  ChevronRight,
  Shield,
  Package
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  {
    id: 'media',
    label: '媒体信息',
    icon: Monitor,
    path: '/media'
  },
  {
    id: 'permissions',
    label: '权限管理',
    icon: Shield,
    path: '/permissions'
  },
  {
    id: 'optimizer',
    label: '优化师管理',
    icon: Users,
    path: '/optimizer'
  },
  {
    id: 'productGroup',
    label: '产品组管理',
    icon: Package,
    path: '/product-group'
  },
  {
    id: 'logs',
    label: '操作日志',
    icon: Activity,
    path: '/logs'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">媒体信息管理系统</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onModuleChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};