import React from 'react';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          UA媒体账户管家与优化师信息维护 
          <span className="ml-2 text-sm bg-green-100 text-green-600 px-2 py-1 rounded">v1.0</span>
        </h1>
      </div>
    </header>
  );
};