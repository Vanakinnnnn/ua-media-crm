// 方案5: 极简列表式布局
const renderMediaPermissions_Layout5 = (optimizer: Optimizer) => {
  const isEditing = editingOptimizer === optimizer.id;
  
  if (isEditing) {
    return renderEditingPermissions(optimizer);
  }

  return (
    <div className="min-w-[280px]">
      {optimizer.mediaPermissions.length > 0 ? (
        <div className="space-y-1">
          {optimizer.mediaPermissions.map((permission, index) => (
            <div key={permission.id} className="flex items-center text-sm py-1">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-800">{permission.platform}</span>
                {permission.accountManager && (
                  <span className="text-gray-500"> → {permission.accountManager}</span>
                )}
                <div className="text-xs text-gray-400 truncate">
                  {permission.email}
                  {permission.facebookUserId && (
                    <span className="ml-2 text-yellow-600">({permission.facebookUserId})</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">暂无权限</div>
      )}
    </div>
  );
}; 