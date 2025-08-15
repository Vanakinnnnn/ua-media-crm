import { MediaPlatform, MediaAccount, Optimizer, Permission, MainEntity, OperationLog, PermissionRelation, PermissionTemplate, PermissionAudit, ProductGroup, BusinessInfo, NotificationConfig } from '../types';
import { FacebookBM, FacebookAdAccount } from '../types';

export const mockMediaPlatforms: MediaPlatform[] = [
  {
    id: '1',
    name: 'TikTok Ads',
    type: 'TikTok',
    status: 'active',
    createdAt: '2024-01-15',
    accounts: []
  },
  {
    id: '2',
    name: 'Google Ads',
    type: 'Google Ads',
    status: 'active',
    createdAt: '2024-01-10',
    accounts: []
  },
  {
    id: '3',
    name: 'Unity Ads',
    type: 'Unity',
    status: 'active',
    createdAt: '2024-01-20',
    accounts: []
  },
  {
    id: '4',
    name: 'Facebook Business',
    type: 'Facebook',
    status: 'active',
    createdAt: '2024-01-12',
    accounts: []
  },
  {
    id: '5',
    name: 'AppLovin MAX',
    type: 'Applovin',
    status: 'active',
    createdAt: '2024-01-18',
    accounts: []
  },
  {
    id: '6',
    name: 'Moloco Cloud DSP',
    type: 'Moloco',
    status: 'active',
    createdAt: '2024-01-22',
    accounts: []
  }
];

export const mockMediaAccounts: MediaAccount[] = [
  // 第一个Google Ads主账户及其子账户
  {
    id: '1',
    platformId: '2',
    name: 'Main MCC Account',
    accountId: 'MCC-001',
    type: 'mcc',
    status: 'Active',
    company: 'EY PTE. LTD',
    departments: ['010', '045', '055', '060'], // 由子账户部门合集决定
    defaultSettings: {
      mccType: 'main',
      mainMccId: 'MCC-001',
      paymentProfileId: 'PAY-12345'
    },
    fgInfo: {
      dhId: '12345668',
      environment: 'SG'
    },
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-25 14:30:00',
    optimizers: ['1', '2']
  },
  {
    id: '2',
    platformId: '2',
    name: 'Gaming Division',
    accountId: 'SUB-001',
    type: 'sub',
    parentId: '1',
    status: 'Active',
    company: 'EY PTE. LTD',
    departments: ['055', '060'],
    defaultSettings: {
      mccType: 'sub',
      mainMccId: 'MCC-001',
      paymentProfileId: 'PAY-12345'
    },
    fgInfo: {
      dhId: '12345668',
      environment: 'SG'
    },
    createdAt: '2024-01-12',
    lastUpdated: '2024-01-24 16:45:00',
    optimizers: ['1']
  },
  {
    id: '4',
    platformId: '2',
    name: 'E-commerce Division',
    accountId: 'SUB-002',
    type: 'sub',
    parentId: '1',
    status: 'Active',
    company: 'EY PTE. LTD',
    departments: ['010', '045'],
    defaultSettings: {
      mccType: 'sub',
      mainMccId: 'MCC-001',
      paymentProfileId: 'PAY-12345'
    },
    fgInfo: {
      dhId: '12345668',
      environment: 'SG'
    },
    createdAt: '2024-01-13',
    lastUpdated: '2024-01-25 09:30:00',
    optimizers: ['2']
  },
  // 第二个Google Ads主账户及其子账户
  {
    id: '5',
    platformId: '2',
    name: 'Secondary MCC Account',
    accountId: 'MCC-002',
    type: 'mcc',
    status: 'Active',
    company: 'HBG Global Ltd',
    departments: ['045', '055'], // 由子账户部门合集决定
    defaultSettings: {
      mccType: 'main',
      mainMccId: 'MCC-002',
      paymentProfileId: 'PAY-54321'
    },
    fgInfo: {
      dhId: '12345671',
      environment: 'US'
    },
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-25 11:15:00',
    optimizers: ['1', '3']
  },
  {
    id: '6',
    platformId: '2',
    name: 'Mobile App Campaigns',
    accountId: 'SUB-003',
    type: 'sub',
    parentId: '5',
    status: 'Active',
    company: 'HBG Global Ltd',
    departments: ['045'],
    defaultSettings: {
      mccType: 'sub',
      mainMccId: 'MCC-002',
      paymentProfileId: 'PAY-54321'
    },
    fgInfo: {
      dhId: '12345671',
      environment: 'US'
    },
    createdAt: '2024-01-16',
    lastUpdated: '2024-01-24 15:20:00',
    optimizers: ['1']
  },
  {
    id: '7',
    platformId: '2',
    name: 'Web Campaigns',
    accountId: 'SUB-004',
    type: 'sub',
    parentId: '5',
    status: 'Active',
    company: 'HBG Global Ltd',
    departments: ['055'],
    defaultSettings: {
      mccType: 'sub',
      mainMccId: 'MCC-002',
      paymentProfileId: 'PAY-54321'
    },
    fgInfo: {
      dhId: '12345671',
      environment: 'US'
    },
    createdAt: '2024-01-17',
    lastUpdated: '2024-01-25 08:45:00',
    optimizers: ['3']
  },
  // TikTok账户（非Google Ads）
  {
    id: '10',
    platformId: '1',
    name: 'TikTok Main Account',
    accountId: 'TT-123-456-789',
    type: 'main',
    status: 'Active',
    company: 'TikTok Ltd',
    departments: ['045', '919'],
    defaultSettings: {
      industryId: 'IND-001',
      businessType: 'E-commerce',
      billingGroupId: 'BG-12345'
    },
    fgInfo: {
      dhId: '12345680',
      environment: 'SG'
    },
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-25 10:20:00',
    optimizers: ['2', '3']
  },
  // Facebook账户示例
  {
    id: '11',
    platformId: '4',
    name: 'Facebook Business Manager',
    accountId: 'FB-BM-789456123',
    type: 'main',
    status: 'Active',
    company: 'Social Media Corp',
    departments: ['010', '045'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345681',
      environment: 'US'
    },
    createdAt: '2024-01-12',
    lastUpdated: '2024-01-26 14:15:00',
    optimizers: ['4', '5']
  },
  {
    id: '12',
    platformId: '4',
    name: 'Facebook Gaming Ad Account',
    accountId: 'FB-AD-456789123',
    type: 'main',
    status: 'Active',
    company: 'Gaming Hub Ltd',
    departments: ['055', '060'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345682',
      environment: 'SG'
    },
    createdAt: '2024-01-14',
    lastUpdated: '2024-01-26 16:30:00',
    optimizers: ['6', '7']
  },
  // Unity账户示例
  {
    id: '13',
    platformId: '3',
    name: 'Unity Mobile Ads',
    accountId: 'UN-MOBILE-001',
    type: 'main',
    status: 'Active',
    company: 'Mobile Games Studio',
    departments: ['055', '919'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345683',
      environment: 'US'
    },
    createdAt: '2024-01-20',
    lastUpdated: '2024-01-26 11:45:00',
    optimizers: ['8', '9']
  },
  {
    id: '14',
    platformId: '3',
    name: 'Unity Desktop Games',
    accountId: 'UN-DESKTOP-002',
    type: 'main',
    status: 'Closed',
    company: 'Desktop Games Inc',
    departments: ['060'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345684',
      environment: 'EU'
    },
    createdAt: '2024-01-21',
    lastUpdated: '2024-01-26 09:20:00',
    optimizers: ['10']
  },
  // AppLovin账户示例
  {
    id: '15',
    platformId: '5',
    name: 'AppLovin MAX Network',
    accountId: 'AL-MAX-789012',
    type: 'main',
    status: 'Active',
    company: 'Ad Network Solutions',
    departments: ['045', '055'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345685',
      environment: 'US'
    },
    createdAt: '2024-01-18',
    lastUpdated: '2024-01-26 13:10:00',
    optimizers: ['4', '8']
  },
  {
    id: '16',
    platformId: '5',
    name: 'AppLovin Exchange',
    accountId: 'AL-EXCHANGE-345',
    type: 'main',
    status: 'Active',
    company: 'Exchange Platform Ltd',
    departments: ['010'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345686',
      environment: 'SG'
    },
    createdAt: '2024-01-19',
    lastUpdated: '2024-01-26 15:40:00',
    optimizers: ['5']
  },
  // Moloco账户示例
  {
    id: '17',
    platformId: '6',
    name: 'Moloco Cloud DSP',
    accountId: 'MOL-DSP-567890',
    type: 'main',
    status: 'Active',
    company: 'AI Advertising Tech',
    departments: ['919'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345687',
      environment: 'US'
    },
    createdAt: '2024-01-22',
    lastUpdated: '2024-01-26 12:25:00',
    optimizers: ['9', '10']
  },
  {
    id: '18',
    platformId: '6',
    name: 'Moloco Retail Media',
    accountId: 'MOL-RETAIL-123',
    type: 'main',
    status: 'Active',
    company: 'Retail Solutions Co',
    departments: ['045', '060'],
    defaultSettings: {},
    fgInfo: {
      dhId: '12345688',
      environment: 'SG'
    },
    createdAt: '2024-01-23',
    lastUpdated: '2024-01-26 10:50:00',
    optimizers: ['4', '6']
  }
];

export const mockOptimizers: Optimizer[] = [
  // 010部门优化师
  {
    id: '1',
    slackName: '@zhang.san',
    email: 'zhang.san@company.com',
    internalEmail: 'zhang.san@internal.com',
    externalEmail: 'zhang.san.external@gmail.com',
    trainingEmail: 'zhang.san.training@platform.com',
    organizationDepartment: '010',
    permissionDepartments: ['010', '045'],
    position: 'Senior Optimizer',
    status: 'active',
    mediaPermissions: [
      { id: '1', platform: 'Google Ads', accountManager: 'Gaming Division', email: 'zhang.san.ads@gmail.com' },
      { id: '2', platform: 'Facebook', accountManager: 'Facebook Business Manager', email: 'zhang.san.facebook@gmail.com', facebookUserId: 'FB-USER-001' }
    ],
    createdAt: '2024-01-05',
    lastUpdated: '2024-01-25 14:30:00'
  },
  {
    id: '2',
    slackName: '@john.smith',
    email: 'john.smith@company.com',
    internalEmail: 'john.smith@internal.com',
    trainingEmail: 'john.smith.training@platform.com',
    organizationDepartment: '010',
    permissionDepartments: ['010'],
    position: 'Media Buyer',
    status: 'active',
    mediaPermissions: [
      { id: '3', platform: 'Google Ads', accountManager: 'E-commerce Division', email: 'john.smith.ads@gmail.com' },
      { id: '4', platform: 'TikTok', accountManager: 'TikTok Main Account', email: 'john.smith.tiktok@gmail.com' }
    ],
    createdAt: '2024-01-08',
    lastUpdated: '2024-01-24 16:45:00'
  },
  // 045部门优化师
  {
    id: '3',
    slackName: '@li.si',
    email: 'li.si@company.com',
    internalEmail: 'li.si@internal.com',
    trainingEmail: 'li.si.training@platform.com',
    organizationDepartment: '045',
    permissionDepartments: ['045', '055'],
    position: 'Campaign Manager',
    status: 'active',
    mediaPermissions: [
      { id: '5', platform: 'Facebook', email: 'li.si.facebook@gmail.com' },
      { id: '6', platform: 'TikTok', email: 'li.si.tiktok@gmail.com' }
    ],
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-25 12:15:00'
  },
  {
    id: '4',
    slackName: '@emma.davis',
    email: 'emma.davis@company.com',
    internalEmail: 'emma.davis@internal.com',
    trainingEmail: 'emma.davis.training@platform.com',
    organizationDepartment: '045',
    permissionDepartments: ['045'],
    position: 'Performance Specialist',
    status: 'active',
    mediaPermissions: [
      { id: '7', platform: 'Google Ads', email: 'emma.davis.ads@gmail.com' },
      { id: '8', platform: 'Unity', email: 'emma.davis.unity@gmail.com' }
    ],
    createdAt: '2024-01-12',
    lastUpdated: '2024-01-25 09:30:00'
  },
  // 055部门优化师
  {
    id: '5',
    slackName: '@wang.wu',
    email: 'wang.wu@company.com',
    internalEmail: 'wang.wu@internal.com',
    trainingEmail: 'wang.wu.training@platform.com',
    organizationDepartment: '055',
    permissionDepartments: ['055', '060'],
    position: 'Senior Campaign Manager',
    status: 'active',
    mediaPermissions: [
      { id: '9', platform: 'Google Ads', accountManager: 'Web Campaigns', email: 'wang.wu.ads@gmail.com' },
      { id: '10', platform: 'Facebook', accountManager: 'Facebook Gaming Ad Account', email: 'wang.wu.facebook@gmail.com', facebookUserId: 'FB-USER-005' }
    ],
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-25 11:20:00'
  },
  {
    id: '6',
    slackName: '@michael.chen',
    email: 'michael.chen@company.com',
    internalEmail: 'michael.chen@internal.com',
    trainingEmail: 'michael.chen.training@platform.com',
    organizationDepartment: '055',
    permissionDepartments: ['055'],
    position: 'Digital Marketing Specialist',
    status: 'active',
    mediaPermissions: [
      { id: '11', platform: 'TikTok', accountManager: 'TikTok Main Account', email: 'michael.chen.tiktok@gmail.com' },
      { id: '12', platform: 'AppLovin', accountManager: 'AppLovin MAX Network', email: 'michael.chen.applovin@gmail.com' }
    ],
    createdAt: '2024-01-18',
    lastUpdated: '2024-01-24 15:45:00'
  },
  // 060部门优化师
  {
    id: '7',
    slackName: '@sarah.wilson',
    email: 'sarah.wilson@company.com',
    internalEmail: 'sarah.wilson@internal.com',
    trainingEmail: 'sarah.wilson.training@platform.com',
    organizationDepartment: '060',
    permissionDepartments: ['060'],
    position: 'Lead Optimizer',
    status: 'active',
    mediaPermissions: [
      { id: '13', platform: 'Google Ads', accountManager: 'Web Campaigns', email: 'sarah.wilson.ads@gmail.com' },
      { id: '14', platform: 'Facebook', accountManager: 'Facebook Gaming Ad Account', email: 'sarah.wilson.facebook@gmail.com', facebookUserId: 'FB-USER-007' }
    ],
    createdAt: '2024-01-20',
    lastUpdated: '2024-01-25 13:10:00'
  },
  {
    id: '8',
    slackName: '@alex.johnson',
    email: 'alex.johnson@company.com',
    internalEmail: 'alex.johnson@internal.com',
    trainingEmail: 'alex.johnson.training@platform.com',
    organizationDepartment: '060',
    permissionDepartments: ['060'],
    position: 'Media Analyst',
    status: 'active',
    mediaPermissions: [
      { id: '15', platform: 'Unity', accountManager: 'Unity Desktop Games', email: 'alex.johnson.unity@gmail.com' },
      { id: '16', platform: 'Moloco', accountManager: 'Moloco Retail Media', email: 'alex.johnson.moloco@gmail.com' }
    ],
    createdAt: '2024-01-22',
    lastUpdated: '2024-01-24 17:30:00'
  },
  // 919部门优化师
  {
    id: '9',
    slackName: '@david.kim',
    email: 'david.kim@company.com',
    internalEmail: 'david.kim@internal.com',
    trainingEmail: 'david.kim.training@platform.com',
    organizationDepartment: '919',
    permissionDepartments: ['919'],
    position: 'Growth Marketing Manager',
    status: 'active',
    mediaPermissions: [
      { id: '17', platform: 'TikTok', accountManager: 'TikTok Main Account', email: 'david.kim.tiktok@gmail.com' },
      { id: '18', platform: 'Facebook', accountManager: 'Facebook Business Manager', email: 'david.kim.facebook@gmail.com', facebookUserId: 'FB-USER-009' }
    ],
    createdAt: '2024-01-25',
    lastUpdated: '2024-01-25 16:20:00'
  },
  {
    id: '10',
    slackName: '@lisa.zhang',
    email: 'lisa.zhang@company.com',
    internalEmail: 'lisa.zhang@internal.com',
    trainingEmail: 'lisa.zhang.training@platform.com',
    organizationDepartment: '919',
    permissionDepartments: ['919'],
    position: 'Performance Marketing Lead',
    status: 'closed',
    mediaPermissions: [
      { id: '19', platform: 'TikTok', email: 'lisa.zhang.tiktok@gmail.com' },
      { id: '20', platform: 'Unity', email: 'lisa.zhang.unity@gmail.com' }
    ],
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-23 10:20:00'
  }
];

export const mockPermissions: Permission[] = [
  {
    id: '1',
    platformId: '1',
    accountId: '3',
    level: 'write',
    status: 'approved',
    requestedAt: '2024-01-15',
    approvedAt: '2024-01-16',
    approvedBy: 'admin'
  },
  {
    id: '2',
    platformId: '2',
    accountId: '1',
    level: 'admin',
    status: 'pending',
    requestedAt: '2024-01-24',
    notes: 'Need manager approval'
  }
];

export const mockMainEntities: MainEntity[] = [
  {
    id: '1',
    name: 'Marketing Department',
    type: 'department',
    accounts: ['1'],
    optimizers: ['1'],
    manager: 'admin',
    createdAt: '2024-01-01',
    status: 'active'
  },
  {
    id: '2',
    name: 'Gaming Division',
    type: 'department',
    accounts: ['2'],
    optimizers: ['2'],
    manager: 'admin',
    createdAt: '2024-01-01',
    status: 'active'
  }
];

export const mockOperationLogs: OperationLog[] = [
  {
    id: '1',
    userId: 'admin',
    userName: '系统管理员',
    action: 'create',
    module: 'media',
    objectType: 'MediaAccount',
    objectId: 'new-account-001',
    objectName: 'Gaming Division',
    objectDetails: {
      after: {
        name: 'Gaming Division',
        accountId: 'SUB-001',
        type: 'sub',
        company: 'EY PTE. LTD',
        departments: ['055', '060']
      }
    },
    description: '新增Google Ads子账户',
    timestamp: '2024-01-25 14:30:00',
    ipAddress: '192.168.1.100',
    status: 'success'
  },
  {
    id: '2',
    userId: 'zhang.san',
    userName: '张先生',
    action: 'update',
    module: 'optimizer',
    objectType: 'MediaPermission',
    objectId: 'permission-001',
    objectName: 'Google Ads权限',
    objectDetails: {
      before: {
        platform: 'Google Ads',
        accountManager: 'Main MCC Account',
        email: 'zhang.san.ads@gmail.com'
      },
      after: {
        platform: 'Google Ads',
        accountManager: 'Gaming Division',
        email: 'zhang.san.ads@gmail.com'
      },
      changes: [
        {
          field: 'accountManager',
          oldValue: 'Main MCC Account',
          newValue: 'Gaming Division'
        }
      ]
    },
    description: '修改Google Ads账户管家权限',
    timestamp: '2024-01-25 13:15:00',
    ipAddress: '192.168.1.101',
    status: 'success'
  },
  {
    id: '3',
    userId: 'john.smith',
    userName: 'John Smith',
    action: 'update',
    module: 'optimizer',
    objectType: 'Optimizer',
    objectId: 'optimizer-002',
    objectName: 'John Smith',
    objectDetails: {
      before: {
        trainingEmail: 'john.smith.training@oldplatform.com'
      },
      after: {
        trainingEmail: 'john.smith.training@platform.com'
      },
      changes: [
        {
          field: 'trainingEmail',
          oldValue: 'john.smith.training@oldplatform.com',
          newValue: 'john.smith.training@platform.com'
        }
      ]
    },
    description: '更新培训平台邮箱',
    timestamp: '2024-01-25 12:00:00',
    ipAddress: '192.168.1.102',
    status: 'success'
  },
  {
    id: '4',
    userId: 'admin',
    userName: '系统管理员',
    action: 'refresh',
    module: 'facebook',
    objectType: 'FacebookBM',
    objectId: 'bm-001',
    objectName: 'Facebook Business Manager',
    objectDetails: {
      before: {
        lastUpdated: '2024-01-24 10:00:00'
      },
      after: {
        lastUpdated: '2024-01-25 14:30:00'
      }
    },
    description: '申请Facebook BM数据刷新',
    timestamp: '2024-01-25 14:30:00',
    ipAddress: '192.168.1.100',
    status: 'success'
  },
  {
    id: '5',
    userId: 'li.si',
    userName: '李女士',
    action: 'create',
    module: 'optimizer',
    objectType: 'MediaPermission',
    objectId: 'permission-005',
    objectName: 'TikTok权限',
    objectDetails: {
      after: {
        platform: 'TikTok',
        email: 'li.si.tiktok@gmail.com'
      }
    },
    description: '新增TikTok平台权限',
    timestamp: '2024-01-25 11:30:00',
    ipAddress: '192.168.1.103',
    status: 'success'
  },
  {
    id: '6',
    userId: 'admin',
    userName: '系统管理员',
    action: 'update',
    module: 'media',
    objectType: 'MediaAccount',
    objectId: 'account-002',
    objectName: 'E-commerce Division',
    objectDetails: {
      before: {
        departments: ['010']
      },
      after: {
        departments: ['010', '045']
      },
      changes: [
        {
          field: 'departments',
          oldValue: ['010'],
          newValue: ['010', '045']
        }
      ]
    },
    description: '修改账户所属部门',
    timestamp: '2024-01-25 10:15:00',
    ipAddress: '192.168.1.100',
    status: 'success'
  },
  {
    id: '7',
    userId: 'emma.davis',
    userName: 'Emma Davis',
    action: 'update',
    module: 'optimizer',
    objectType: 'Optimizer',
    objectId: 'optimizer-004',
    objectName: 'Emma Davis',
    objectDetails: {
      before: {
        status: 'active'
      },
      after: {
        status: 'closed'
      },
      changes: [
        {
          field: 'status',
          oldValue: 'active',
          newValue: 'closed'
        }
      ]
    },
    description: '停用优化师账户',
    timestamp: '2024-01-25 09:45:00',
    ipAddress: '192.168.1.104',
    status: 'success'
  },
  {
    id: '8',
    userId: 'admin',
    userName: '系统管理员',
    action: 'refresh',
    module: 'system',
    objectType: 'MediaAccount',
    objectId: 'all-accounts',
    objectName: '所有账户',
    objectDetails: {
      before: {
        lastUpdated: '2024-01-24 18:00:00'
      },
      after: {
        lastUpdated: '2024-01-25 14:30:00'
      }
    },
    description: '申请账户管家数据刷新',
    timestamp: '2024-01-25 14:30:00',
    ipAddress: '192.168.1.100',
    status: 'success'
  }
];

export const mockFacebookBMs: FacebookBM[] = [
  {
    id: '1',
    bmName: 'EWP',
    bmId: 'BM-123456789',
    adAccounts: [
      {
        id: '1',
        bmId: '1',
        accountName: 'EWP Gaming Ads',
        accountId: 'ACT-111111111',
        role: 'Owner',
        lastUpdated: '2024-01-25 14:30:00'
      },
      {
        id: '2',
        bmId: '1',
        accountName: 'EWP Mobile Apps',
        accountId: 'ACT-222222222',
        role: 'Client',
        lastUpdated: '2024-01-25 13:45:00'
      }
    ],
    lastUpdated: '2024-01-25 14:30:00'
  },
  {
    id: '2',
    bmName: 'CD',
    bmId: 'BM-987654321',
    adAccounts: [
      {
        id: '3',
        bmId: '2',
        accountName: 'CD Performance Marketing',
        accountId: 'ACT-333333333',
        role: 'Owner',
        lastUpdated: '2024-01-24 16:20:00'
      },
      {
        id: '4',
        bmId: '2',
        accountName: 'CD Brand Campaigns',
        accountId: 'ACT-444444444',
        role: 'Client',
        lastUpdated: '2024-01-24 15:10:00'
      }
    ],
    lastUpdated: '2024-01-24 16:20:00'
  }
]

// 权限管理 Mock 数据
export const mockPermissionRelations: PermissionRelation[] = [
  // Google Ads 权限关系 - 010部门管理Gaming Division
  {
    id: 'perm-1',
    platform: 'Google Ads',
    container: {
      type: 'MCC',
      id: 'MCC-001',
      name: 'Main MCC Account'
    },
    account: {
      id: 'SUB-001',
      name: 'Gaming Division',
      type: 'Client Account',
      status: 'Active'
    },
    optimizer: {
      id: '1',
      name: 'Zhang San',
      email: 'zhang.san@company.com',
      department: ['010'],
      status: 'Active'
    },
    permissions: {
      googleAds: {
        role: 'ADMIN'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 10:30:00'
  },
  {
    id: 'perm-2',
    platform: 'Google Ads',
    container: {
      type: 'MCC',
      id: 'MCC-001',
      name: 'Main MCC Account'
    },
    account: {
      id: 'SUB-001',
      name: 'Gaming Division',
      type: 'Client Account',
      status: 'Active'
    },
    optimizer: {
      id: '2',
      name: 'John Smith',
      email: 'john.smith@company.com',
      department: ['010'],
      status: 'Active'
    },
    permissions: {
      googleAds: {
        role: 'STANDARD'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 14:20:00'
  },

  // Google Ads 权限关系 - 045部门管理E-commerce Division
  {
    id: 'perm-3',
    platform: 'Google Ads',
    container: {
      type: 'MCC',
      id: 'MCC-001', 
      name: 'Main MCC Account'
    },
    account: {
      id: 'SUB-002',
      name: 'E-commerce Division',
      type: 'Client Account',
      status: 'Active'
    },
    optimizer: {
      id: '3',
      name: 'Li Si',
      email: 'li.si@company.com',
      department: ['045'],
      status: 'Active'
    },
    permissions: {
      googleAds: {
        role: 'ADMIN'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 15:45:00'
  },
  {
    id: 'perm-4',
    platform: 'Google Ads',
    container: {
      type: 'MCC',
      id: 'MCC-001',
      name: 'Main MCC Account'
    },
    account: {
      id: 'SUB-002',
      name: 'E-commerce Division',
      type: 'Client Account',
      status: 'Active'
    },
    optimizer: {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@company.com',
      department: ['045'],
      status: 'Active'
    },
    permissions: {
      googleAds: {
        role: 'STANDARD'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 12:30:00'
  },

  // Google Ads 权限关系 - 055部门管理Web Campaigns
  {
    id: 'perm-5',
    platform: 'Google Ads',
    container: {
      type: 'MCC',
      id: 'MCC-002',
      name: 'Secondary MCC Account'
    },
    account: {
      id: 'SUB-004',
      name: 'Web Campaigns',
      type: 'Client Account',
      status: 'Active'
    },
    optimizer: {
      id: '5',
      name: 'Wang Wu',
      email: 'wang.wu@company.com',
      department: ['055'],
      status: 'Active'
    },
    permissions: {
      googleAds: {
        role: 'ADMIN'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 09:15:00'
  },
  {
    id: 'perm-6',
    platform: 'Google Ads',
    container: {
      type: 'MCC',
      id: 'MCC-002',
      name: 'Secondary MCC Account'
    },
    account: {
      id: 'SUB-003',
      name: 'Mobile App Campaigns',
      type: 'Client Account',
      status: 'Active'
    },
    optimizer: {
      id: '7',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: ['060'],
      status: 'Active'
    },
    permissions: {
      googleAds: {
        role: 'STANDARD'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-24 16:20:00'
  },
  
  // Facebook 权限关系 - 010部门
  {
    id: 'perm-7',
    platform: 'Facebook',
    container: {
      type: 'Business Manager',
      id: 'BM-123456',
      name: 'EY Business Manager',
      role: 'Owner'
    },
    account: {
      id: 'AD-789012',
      name: 'Gaming Campaigns',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '1',
      name: 'Zhang San',
      email: 'zhang.san@company.com',
      department: ['010'],
      status: 'Active'
    },
    permissions: {
      facebook: {
        tasks: ['ADVERTISE', 'ANALYZE', 'MANAGE']
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 16:45:00',
    lastSyncTime: '2024-01-25 16:45:00'
  },

  // Facebook 权限关系 - 045部门
  {
    id: 'perm-8',
    platform: 'Facebook',
    container: {
      type: 'Business Manager',
      id: 'BM-789123',
      name: 'Client BM Account',
      role: 'Partner'
    },
    account: {
      id: 'AD-345678',
      name: 'E-commerce Ads',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '3',
      name: 'Li Si',
      email: 'li.si@company.com',
      department: ['045'],
      status: 'Active'
    },
    permissions: {
      facebook: {
        tasks: ['ADVERTISE', 'ANALYZE']
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 12:30:00',
    lastSyncTime: '2024-01-25 12:30:00'
  },

  // Facebook 权限关系 - 055部门
  {
    id: 'perm-9',
    platform: 'Facebook',
    container: {
      type: 'Business Manager',
      id: 'BM-555777',
      name: 'Growth BM Account',
      role: 'Owner'
    },
    account: {
      id: 'AD-555999',
      name: 'Performance Campaigns',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '5',
      name: 'Wang Wu',
      email: 'wang.wu@company.com',
      department: ['055'],
      status: 'Active'
    },
    permissions: {
      facebook: {
        tasks: ['ADVERTISE', 'ANALYZE']
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 11:15:00',
    lastSyncTime: '2024-01-25 11:15:00'
  },

  // Facebook 权限关系 - 060部门
  {
    id: 'perm-10',
    platform: 'Facebook',
    container: {
      type: 'Business Manager',
      id: 'BM-606080',
      name: 'Analytics BM Account',
      role: 'Owner'
    },
    account: {
      id: 'AD-606080',
      name: 'Analytics Campaigns',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '7',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: ['060'],
      status: 'Active'
    },
    permissions: {
      facebook: {
        tasks: ['ADVERTISE', 'ANALYZE', 'MANAGE']
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 13:20:00',
    lastSyncTime: '2024-01-25 13:20:00'
  },
  
  // TikTok 权限关系 - 919部门
  {
    id: 'perm-11',
    platform: 'TikTok',
    container: {
      type: 'Business Center',
      id: 'BC-919001',
      name: 'Growth Marketing BC'
    },
    account: {
      id: 'TT-ADV-001',
      name: 'TikTok Growth Ads',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '9',
      name: 'David Kim',
      email: 'david.kim@company.com',
      department: ['919'],
      status: 'Active'
    },
    permissions: {
      tiktok: {
        businessCenter: {
          role: 'STANDARD'
        },
        advertiser: {
          role: 'ADMIN'
        }
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-25 09:15:00',
    lastSyncTime: '2024-01-25 09:15:00'
  },
  {
    id: 'perm-12',
    platform: 'TikTok',
    container: {
      type: 'Business Center',
      id: 'BC-919001',
      name: 'Growth Marketing BC'
    },
    account: {
      id: 'TT-ADV-002',
      name: 'TikTok Performance Ads',
      type: 'Ad Account',
      status: 'Closed'
    },
    optimizer: {
      id: '10',
      name: 'Lisa Zhang',
      email: 'lisa.zhang@company.com',
      department: ['919'],
      status: 'Inactive'
    },
    permissions: {
      tiktok: {
        businessCenter: {
          role: 'STANDARD'
        },
        advertiser: {
          role: 'VIEWER'
        }
      }
    },
    dataSource: 'Manual',
    syncStatus: 'Error',
    lastUpdated: '2024-01-20 15:20:00'
  },

  // Unity 权限关系 - 045部门
  {
    id: 'perm-13',
    platform: 'Unity',
    container: {
      type: 'Platform',
      id: 'UNITY-ORG-045',
      name: 'Unity Performance Org'
    },
    account: {
      id: 'UNITY-ADV-001',
      name: 'Unity E-commerce Ads',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@company.com',
      department: ['045'],
      status: 'Active'
    },
    permissions: {
      other: {
        role: 'ADMIN',
        level: 'Full'
      }
    },
    dataSource: 'Manual',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-24 11:30:00'
  },

  // Unity 权限关系 - 060部门
  {
    id: 'perm-14',
    platform: 'Unity',
    container: {
      type: 'Platform',
      id: 'UNITY-ORG-060',
      name: 'Unity Analytics Org'
    },
    account: {
      id: 'UNITY-ADV-002',
      name: 'Unity Analytics Ads',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '8',
      name: 'Alex Johnson',
      email: 'alex.johnson@company.com',
      department: ['060'],
      status: 'Active'
    },
    permissions: {
      other: {
        role: 'STANDARD',
        level: 'Limited'
      }
    },
    dataSource: 'Manual',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-24 14:15:00'
  },

  // Applovin 权限关系 - 055部门
  {
    id: 'perm-15',
    platform: 'Applovin',
    container: {
      type: 'Platform',
      id: 'APPLOVIN-ORG-055',
      name: 'Applovin Growth Org'
    },
    account: {
      id: 'APPLOVIN-ADV-001',
      name: 'Applovin Performance Ads',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '6',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: ['055'],
      status: 'Active'
    },
    permissions: {
      other: {
        role: 'ADMIN',
        level: 'Full'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-24 16:45:00'
  },

  // Moloco 权限关系 - 060部门
  {
    id: 'perm-16',
    platform: 'Moloco',
    container: {
      type: 'Platform',
      id: 'MOLOCO-ORG-060',
      name: 'Moloco Analytics Org'
    },
    account: {
      id: 'MOLOCO-ADV-001',
      name: 'Moloco DSP Campaigns',
      type: 'Ad Account',
      status: 'Active'
    },
    optimizer: {
      id: '8',
      name: 'Alex Johnson',
      email: 'alex.johnson@company.com',
      department: ['060'],
      status: 'Active'
    },
    permissions: {
      other: {
        role: 'STANDARD',
        level: 'ReadOnly'
      }
    },
    dataSource: 'API',
    syncStatus: 'Synced',
    lastUpdated: '2024-01-24 17:30:00'
  }
];

// 权限模板
export const mockPermissionTemplates: PermissionTemplate[] = [
  {
    id: 'template-1',
    name: '标准优化师权限',
    description: '适用于大部分优化师的标准权限配置',
    permissions: {
      googleAds: {
        role: 'STANDARD'
      },
      facebook: {
        tasks: ['ADVERTISE', 'ANALYZE']
      },
      tiktok: {
        businessCenter: {
          role: 'STANDARD'
        },
        advertiser: {
          role: 'ADMIN'
        }
      }
    }
  },
  {
    id: 'template-2',
    name: '数据分析师权限',
    description: '只读权限，适用于数据分析人员',
    permissions: {
      googleAds: {
        role: 'READ_ONLY'
      },
      facebook: {
        tasks: ['ANALYZE']
      },
      tiktok: {
        businessCenter: {
          role: 'STANDARD'
        },
        advertiser: {
          role: 'VIEWER'
        }
      }
    }
  },
  {
    id: 'template-3',
    name: '高级管理员权限',
    description: '完整权限，适用于团队负责人',
    permissions: {
      googleAds: {
        role: 'ADMIN'
      },
      facebook: {
        tasks: ['ADVERTISE', 'ANALYZE', 'MANAGE']
      },
      tiktok: {
        businessCenter: {
          role: 'ADMIN'
        },
        advertiser: {
          role: 'ADMIN'
        }
      }
    }
  }
];

// 权限审计数据
export const mockPermissionAudits: PermissionAudit[] = [
  {
    type: 'orphaned_accounts',
    title: '孤立账户',
    description: '有账户但无优化师分配的权限关系',
    severity: 'warning',
    count: 3,
    items: ['FACEBOOK-AD-999888', 'UNITY-ADV-003', 'APPLOVIN-ADV-002'],
    affectedRelations: []
  },
  {
    type: 'inactive_optimizers',
    title: '非活跃优化师',
    description: '优化师状态为非活跃但仍有权限分配',
    severity: 'error',
    count: 1,
    items: ['Lisa Zhang (lisa.zhang@company.com)'],
    affectedRelations: ['perm-12']
  },
  {
    type: 'sync_failures',
    title: '同步失败',
    description: 'API同步失败的权限关系',
    severity: 'error',
    count: 1,
    items: ['TikTok BC-919001 同步失败'],
    affectedRelations: ['perm-12']
  },
  {
    type: 'permission_conflicts',
    title: '权限冲突',
    description: '同一优化师在不同平台权限级别不一致',
    severity: 'info',
    count: 2,
    items: ['Sarah Wilson: Google Ads STANDARD vs Facebook MANAGE', 'Alex Johnson: Unity LIMITED vs Moloco READONLY'],
    affectedRelations: ['perm-6', 'perm-10', 'perm-14', 'perm-16']
  }
];

// 产品组管理数据
export const mockProductGroups: ProductGroup[] = [
  { id: '1', name: '包F10', code: 'F10' },
  { id: '2', name: '包F45', code: 'F45' },
  { id: '3', name: '包F55', code: 'F55' },
  { id: '4', name: '包F60', code: 'F60' },
  { id: '5', name: '包F75', code: 'F75' },
  { id: '6', name: '包F89', code: 'F89' },
  { id: '7', name: '包F919', code: 'F919' },
  { id: '8', name: '包F41', code: 'F41' },
  { id: '9', name: '包F42', code: 'F42' },
  { id: '10', name: '包F35', code: 'F35' },
  { id: '11', name: 'UGC', code: 'UGC' }
];

export const mockBusinessInfo: BusinessInfo[] = [
  {
    id: '1',
    productGroup: mockProductGroups[0],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f10',
    tiktokIndustryId: 'TIK001'
  },
  {
    id: '2',
    productGroup: mockProductGroups[1],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f45',
    tiktokIndustryId: 'TIK002'
  },
  {
    id: '3',
    productGroup: mockProductGroups[2],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f55',
    tiktokIndustryId: 'TIK003'
  },
  {
    id: '4',
    productGroup: mockProductGroups[3],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f60',
    tiktokIndustryId: 'TIK004'
  },
  {
    id: '5',
    productGroup: mockProductGroups[4],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f75',
    tiktokIndustryId: 'TIK005'
  },
  {
    id: '6',
    productGroup: mockProductGroups[5],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f89',
    tiktokIndustryId: 'TIK006'
  },
  {
    id: '7',
    productGroup: mockProductGroups[6],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f919',
    tiktokIndustryId: 'TIK007'
  },
  {
    id: '8',
    productGroup: mockProductGroups[7],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f41',
    tiktokIndustryId: 'TIK008'
  },
  {
    id: '9',
    productGroup: mockProductGroups[8],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f42',
    tiktokIndustryId: 'TIK009'
  },
  {
    id: '10',
    productGroup: mockProductGroups[9],
    tiktokPromotionLink: 'https://tiktok.com/promotion/f35',
    tiktokIndustryId: 'TIK010'
  },
  {
    id: '11',
    productGroup: mockProductGroups[10],
    tiktokPromotionLink: 'https://tiktok.com/promotion/ugc',
    tiktokIndustryId: 'TIK011'
  }
];

export const mockNotificationConfig: NotificationConfig[] = [
  {
    id: '1',
    productGroup: mockProductGroups[0],
    approvalAM: ['zhang.san@company.com', 'li.si@company.com'],
    growthManager: ['wang.wu@company.com', 'zhao.liu@company.com'],
    teamLead: ['sun.qi@company.com'],
    accountApprovalPerson: 'zhang.san@company.com',
    permissionApprovalPerson: 'li.si@company.com',
    balanceNotificationPerson: ['wang.wu@company.com', 'zhao.liu@company.com'],
    balanceNotificationChannel: '#f10-balance-alert',
    rechargeNotificationPerson: ['sun.qi@company.com', 'zhang.san@company.com']
  },
  {
    id: '2',
    productGroup: mockProductGroups[1],
    approvalAM: ['emma.davis@company.com'],
    growthManager: ['john.smith@company.com'],
    teamLead: ['michael.brown@company.com'],
    accountApprovalPerson: 'emma.davis@company.com',
    permissionApprovalPerson: 'john.smith@company.com',
    balanceNotificationPerson: ['michael.brown@company.com'],
    balanceNotificationChannel: '#f45-balance-alert',
    rechargeNotificationPerson: ['emma.davis@company.com', 'john.smith@company.com']
  },
  {
    id: '3',
    productGroup: mockProductGroups[2],
    approvalAM: ['sarah.wilson@company.com', 'david.miller@company.com'],
    growthManager: ['lisa.anderson@company.com'],
    teamLead: ['james.taylor@company.com', 'emily.white@company.com'],
    accountApprovalPerson: 'sarah.wilson@company.com',
    permissionApprovalPerson: 'david.miller@company.com',
    balanceNotificationPerson: ['lisa.anderson@company.com', 'james.taylor@company.com'],
    balanceNotificationChannel: '#f55-balance-alert',
    rechargeNotificationPerson: ['emily.white@company.com']
  },
  {
    id: '4',
    productGroup: mockProductGroups[3],
    approvalAM: ['robert.johnson@company.com'],
    growthManager: ['jennifer.garcia@company.com', 'thomas.martinez@company.com'],
    teamLead: ['christopher.rodriguez@company.com'],
    accountApprovalPerson: 'robert.johnson@company.com',
    permissionApprovalPerson: 'jennifer.garcia@company.com',
    balanceNotificationPerson: ['thomas.martinez@company.com'],
    balanceNotificationChannel: '#f60-balance-alert',
    rechargeNotificationPerson: ['christopher.rodriguez@company.com', 'robert.johnson@company.com']
  },
  {
    id: '5',
    productGroup: mockProductGroups[4],
    approvalAM: ['daniel.lee@company.com', 'ashley.gonzalez@company.com'],
    growthManager: ['matthew.perez@company.com'],
    teamLead: ['jessica.turner@company.com'],
    accountApprovalPerson: 'daniel.lee@company.com',
    permissionApprovalPerson: 'ashley.gonzalez@company.com',
    balanceNotificationPerson: ['matthew.perez@company.com', 'jessica.turner@company.com'],
    balanceNotificationChannel: '#f75-balance-alert',
    rechargeNotificationPerson: ['daniel.lee@company.com']
  },
  {
    id: '6',
    productGroup: mockProductGroups[5],
    approvalAM: ['andrew.campbell@company.com'],
    growthManager: ['nicole.mitchell@company.com', 'kevin.carter@company.com'],
    teamLead: ['stephanie.roberts@company.com'],
    accountApprovalPerson: 'andrew.campbell@company.com',
    permissionApprovalPerson: 'nicole.mitchell@company.com',
    balanceNotificationPerson: ['kevin.carter@company.com'],
    balanceNotificationChannel: '#f89-balance-alert',
    rechargeNotificationPerson: ['stephanie.roberts@company.com', 'andrew.campbell@company.com']
  },
  {
    id: '7',
    productGroup: mockProductGroups[6],
    approvalAM: ['rachel.phillips@company.com', 'tyler.evans@company.com'],
    growthManager: ['amanda.edwards@company.com'],
    teamLead: ['brandon.collins@company.com', 'melissa.stewart@company.com'],
    accountApprovalPerson: 'rachel.phillips@company.com',
    permissionApprovalPerson: 'tyler.evans@company.com',
    balanceNotificationPerson: ['amanda.edwards@company.com', 'brandon.collins@company.com'],
    balanceNotificationChannel: '#f919-balance-alert',
    rechargeNotificationPerson: ['melissa.stewart@company.com']
  },
  {
    id: '8',
    productGroup: mockProductGroups[7],
    approvalAM: ['nathan.sanchez@company.com'],
    growthManager: ['samantha.morris@company.com', 'ryan.rogers@company.com'],
    teamLead: ['lauren.reed@company.com'],
    accountApprovalPerson: 'nathan.sanchez@company.com',
    permissionApprovalPerson: 'samantha.morris@company.com',
    balanceNotificationPerson: ['ryan.rogers@company.com'],
    balanceNotificationChannel: '#f41-balance-alert',
    rechargeNotificationPerson: ['lauren.reed@company.com', 'nathan.sanchez@company.com']
  },
  {
    id: '9',
    productGroup: mockProductGroups[8],
    approvalAM: ['katherine.cook@company.com', 'eric.morgan@company.com'],
    growthManager: ['heather.bell@company.com'],
    teamLead: ['adam.murphy@company.com'],
    accountApprovalPerson: 'katherine.cook@company.com',
    permissionApprovalPerson: 'eric.morgan@company.com',
    balanceNotificationPerson: ['heather.bell@company.com', 'adam.murphy@company.com'],
    balanceNotificationChannel: '#f42-balance-alert',
    rechargeNotificationPerson: ['katherine.cook@company.com']
  },
  {
    id: '10',
    productGroup: mockProductGroups[9],
    approvalAM: ['victoria.bailey@company.com'],
    growthManager: ['christopher.rivera@company.com', 'danielle.cooper@company.com'],
    teamLead: ['patrick.richardson@company.com'],
    accountApprovalPerson: 'victoria.bailey@company.com',
    permissionApprovalPerson: 'christopher.rivera@company.com',
    balanceNotificationPerson: ['danielle.cooper@company.com'],
    balanceNotificationChannel: '#f35-balance-alert',
    rechargeNotificationPerson: ['patrick.richardson@company.com', 'victoria.bailey@company.com']
  },
  {
    id: '11',
    productGroup: mockProductGroups[10],
    approvalAM: ['alexandra.cox@company.com', 'sean.ward@company.com'],
    growthManager: ['rebecca.torres@company.com'],
    teamLead: ['gregory.peterson@company.com', 'hannah.gray@company.com'],
    accountApprovalPerson: 'alexandra.cox@company.com',
    permissionApprovalPerson: 'sean.ward@company.com',
    balanceNotificationPerson: ['rebecca.torres@company.com', 'gregory.peterson@company.com'],
    balanceNotificationChannel: '#ugc-balance-alert',
    rechargeNotificationPerson: ['hannah.gray@company.com']
  }
];