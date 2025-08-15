export interface MediaPlatform {
  id: string;
  name: string;
  type: 'TikTok' | 'Google Ads' | 'Unity' | 'Facebook' | 'Twitter' | 'Applovin' | 'Moloco';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  accounts: MediaAccount[];
}

export interface MediaAccount {
  id: string;
  platformId: string;
  name: string;
  accountId: string;
  type: 'main' | 'sub' | 'mcc';
  parentId?: string;
  status: 'Active' | 'Closed';
  company: string;
  departments: string[];
  defaultSettings: DefaultSettings;
  fgInfo: FGInfo;
  createdAt: string;
  lastUpdated: string;
  optimizers: string[];
}

export interface DefaultSettings {
  // TikTok specific
  industryId?: string;
  businessType?: string;
  billingGroupId?: string;
  
  // Google Ads specific
  mccType?: 'main' | 'sub';
  mainMccId?: string;
  paymentProfileId?: string;
}

export interface FGInfo {
  dhId?: string;
  environment?: string;
  accountManagerId?: string;
}

export interface Optimizer {
  id: string;
  slackName: string;
  email: string;
  internalEmail: string;
  externalEmail?: string;
  trainingEmail: string;
  organizationDepartment: '010' | '045' | '055' | '060' | '919';
  permissionDepartments: ('010' | '045' | '055' | '060' | '919')[];
  position: string;
  status: 'active' | 'closed';
  mediaPermissions: MediaPermission[];
  createdAt: string;
  lastUpdated: string;
}

export interface MediaPermission {
  id: string;
  platform: string;
  accountManager?: string; // 账户管家选项
  email: string;
  facebookUserId?: string; // Facebook用户ID
}

export interface Permission {
  id: string;
  platformId: string;
  accountId: string;
  level: 'read' | 'write' | 'admin';
  status: 'approved' | 'pending' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface MainEntity {
  id: string;
  name: string;
  type: 'company' | 'department' | 'team';
  parentId?: string;
  accounts: string[];
  optimizers: string[];
  manager: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface OperationLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'refresh' | 'permission_change';
  module: 'media' | 'optimizer' | 'entity' | 'facebook' | 'system';
  objectType: 'MediaPlatform' | 'MediaAccount' | 'DefaultSettings' | 'FGInfo' | 'Optimizer' | 'MediaPermission' | 'FacebookBM' | 'FacebookAdAccount' | 'PermissionRelation';
  objectId: string;
  objectName: string;
  objectDetails: {
    before?: any;
    after?: any;
    changes?: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
  };
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'pending';
  errorMessage?: string;
}

export interface FacebookBM {
  id: string;
  bmName: string;
  bmId: string;
  adAccounts: FacebookAdAccount[];
  lastUpdated: string;
}

export interface FacebookAdAccount {
  id: string;
  bmId: string;
  accountName: string;
  accountId: string;
  role: 'Client' | 'Owner';
  lastUpdated: string;
}

// 权限管理相关类型定义
export interface PermissionRelation {
  id: string;
  
  // 基础信息
  platform: 'Google Ads' | 'Facebook' | 'TikTok' | 'Unity' | 'Applovin' | 'Moloco';
  
  // 容器信息 (MCC/BM/BC)
  container: {
    type: 'MCC' | 'Business Manager' | 'Business Center' | 'Platform';
    id: string;
    name: string;
    role?: 'Owner' | 'Client' | 'Partner'; // Facebook特有的关系类型
  };
  
  // 账户信息
  account: {
    id: string;
    name: string;
    type: 'Ad Account' | 'Page' | 'Shop' | 'Client Account';
    status: 'Active' | 'Paused' | 'Closed';
  };
  
  // 优化师信息
  optimizer: {
    id: string;
    name: string;
    email: string;
    department: string[];
    status: 'Active' | 'Inactive';
  };
  
  // 权限配置
  permissions: {
    // Google Ads - 简单角色
    googleAds?: {
      role: 'ADMIN' | 'STANDARD' | 'READ_ONLY' | 'EMAIL_ONLY';
    };
    
    // Facebook - 任务列表
    facebook?: {
      tasks: ('ADVERTISE' | 'ANALYZE' | 'MANAGE')[];
    };
    
    // TikTok - 双层权限
    tiktok?: {
      businessCenter: {
        role: 'ADMIN' | 'STANDARD' | 'FINANCE';
      };
      advertiser: {
        role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
      };
    };
    
    // 其他平台通用权限
    other?: {
      role: string;
      level: 'Full' | 'Limited' | 'ReadOnly';
    };
  };
  
  // 元数据
  dataSource: 'API' | 'Manual';
  syncStatus: 'Synced' | 'Pending' | 'Error';
  lastUpdated: string;
  lastSyncTime?: string;
}

// 权限模板
export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: {
    googleAds?: PermissionRelation['permissions']['googleAds'];
    facebook?: PermissionRelation['permissions']['facebook'];
    tiktok?: PermissionRelation['permissions']['tiktok'];
    other?: PermissionRelation['permissions']['other'];
  };
}

// 权限审计
export interface PermissionAudit {
  type: 'orphaned_accounts' | 'inactive_optimizers' | 'sync_failures' | 'permission_conflicts';
  title: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  count: number;
  items: string[];
  affectedRelations: string[]; // PermissionRelation IDs
}

export interface ProductGroup {
  id: string;
  name: string;
  code: string;
}

export interface BusinessInfo {
  id: string;
  productGroup: ProductGroup;
  tiktokPromotionLink: string;
  tiktokIndustryId: string;
}

export interface NotificationConfig {
  id: string;
  productGroup: ProductGroup;
  approvalAM: string[]; // 审批AM（多个）
  growthManager: string[]; // 增长负责人（多个）
  teamLead: string[]; // 巴长（多个）
  accountApprovalPerson: string; // 开户申请审批人（单个）
  permissionApprovalPerson: string; // 权限申请审批人（单个）
  balanceNotificationPerson: string[]; // 余额不足通知人（多个）
  balanceNotificationChannel: string; // 余额不足通知频道（单个）
  rechargeNotificationPerson: string[]; // 充值申请通知（多个）
}