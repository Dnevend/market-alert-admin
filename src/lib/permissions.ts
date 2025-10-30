// 用户角色定义
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
  GUEST: 'guest',
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

// 权限定义
export const Permission = {
  // 仪表盘权限
  DASHBOARD_VIEW: 'dashboard:view',

  // 用户管理权限
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',

  // 任务管理权限
  TASKS_VIEW: 'tasks:view',
  TASKS_CREATE: 'tasks:create',
  TASKS_EDIT: 'tasks:edit',
  TASKS_DELETE: 'tasks:delete',

  // 应用管理权限
  APPS_VIEW: 'apps:view',
  APPS_CREATE: 'apps:create',
  APPS_EDIT: 'apps:edit',
  APPS_DELETE: 'apps:delete',

  // 聊天权限
  CHATS_VIEW: 'chats:view',
  CHATS_CREATE: 'chats:create',

  // 交易符号权限
  SYMBOLS_VIEW: 'symbols:view',
  SYMBOLS_CREATE: 'symbols:create',
  SYMBOLS_EDIT: 'symbols:edit',
  SYMBOLS_DELETE: 'symbols:delete',

  // 警报权限
  ALERTS_VIEW: 'alerts:view',
  ALERTS_CREATE: 'alerts:create',
  ALERTS_EDIT: 'alerts:edit',
  ALERTS_DELETE: 'alerts:delete',

  // 系统设置权限
  SYSTEM_SETTINGS_VIEW: 'system_settings:view',
  SYSTEM_SETTINGS_EDIT: 'system_settings:edit',

  // 设置页面权限
  SETTINGS_PROFILE: 'settings:profile',
  SETTINGS_ACCOUNT: 'settings:account',
  SETTINGS_APPEARANCE: 'settings:appearance',
  SETTINGS_NOTIFICATIONS: 'settings:notifications',
  SETTINGS_DISPLAY: 'settings:display',

  // 错误页面权限
  ERRORS_VIEW: 'errors:view',

  // 帮助中心权限
  HELP_VIEW: 'help:view',
} as const

export type Permission = typeof Permission[keyof typeof Permission]

// 角色权限映射
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // 管理员拥有所有权限
    Permission.DASHBOARD_VIEW,
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.USERS_DELETE,
    Permission.TASKS_VIEW,
    Permission.TASKS_CREATE,
    Permission.TASKS_EDIT,
    Permission.TASKS_DELETE,
    Permission.APPS_VIEW,
    Permission.APPS_CREATE,
    Permission.APPS_EDIT,
    Permission.APPS_DELETE,
    Permission.CHATS_VIEW,
    Permission.CHATS_CREATE,
    Permission.SYMBOLS_VIEW,
    Permission.SYMBOLS_CREATE,
    Permission.SYMBOLS_EDIT,
    Permission.SYMBOLS_DELETE,
    Permission.ALERTS_VIEW,
    Permission.ALERTS_CREATE,
    Permission.ALERTS_EDIT,
    Permission.ALERTS_DELETE,
    Permission.SYSTEM_SETTINGS_VIEW,
    Permission.SYSTEM_SETTINGS_EDIT,
    Permission.SETTINGS_PROFILE,
    Permission.SETTINGS_ACCOUNT,
    Permission.SETTINGS_APPEARANCE,
    Permission.SETTINGS_NOTIFICATIONS,
    Permission.SETTINGS_DISPLAY,
    Permission.ERRORS_VIEW,
    Permission.HELP_VIEW,
  ],
  [UserRole.USER]: [
    // 普通用户权限
    Permission.DASHBOARD_VIEW,
    Permission.TASKS_VIEW,
    Permission.TASKS_CREATE,
    Permission.TASKS_EDIT,
    Permission.APPS_VIEW,
    Permission.CHATS_VIEW,
    Permission.CHATS_CREATE,
    Permission.SYMBOLS_VIEW,
    Permission.ALERTS_VIEW,
    Permission.ALERTS_CREATE,
    Permission.SETTINGS_PROFILE,
    Permission.SETTINGS_ACCOUNT,
    Permission.SETTINGS_APPEARANCE,
    Permission.SETTINGS_NOTIFICATIONS,
    Permission.SETTINGS_DISPLAY,
    Permission.HELP_VIEW,
  ],
  [UserRole.VIEWER]: [
    // 只读用户权限
    Permission.DASHBOARD_VIEW,
    Permission.TASKS_VIEW,
    Permission.APPS_VIEW,
    Permission.CHATS_VIEW,
    Permission.SYMBOLS_VIEW,
    Permission.ALERTS_VIEW,
    Permission.SETTINGS_PROFILE,
    Permission.SETTINGS_ACCOUNT,
    Permission.SETTINGS_APPEARANCE,
    Permission.SETTINGS_NOTIFICATIONS,
    Permission.SETTINGS_DISPLAY,
    Permission.HELP_VIEW,
  ],
  [UserRole.GUEST]: [
    // 访客没有任何权限，只能查看公开页面
    // 不分配任何API权限
  ],
}

// 检查用户是否有指定权限
export function hasPermission(
  userRoles: string[] | undefined,
  requiredPermission: Permission
): boolean {
  if (!userRoles || userRoles.length === 0) {
    return false
  }

  return userRoles.some((role) => {
    const permissions = rolePermissions[role as UserRole]
    return permissions?.includes(requiredPermission) || false
  })
}

// 检查用户是否有任一权限
export function hasAnyPermission(
  userRoles: string[] | undefined,
  requiredPermissions: Permission[]
): boolean {
  if (!userRoles || userRoles.length === 0 || requiredPermissions.length === 0) {
    return false
  }

  return requiredPermissions.some((permission) =>
    hasPermission(userRoles, permission)
  )
}

// 检查用户是否有所有权限
export function hasAllPermissions(
  userRoles: string[] | undefined,
  requiredPermissions: Permission[]
): boolean {
  if (!userRoles || userRoles.length === 0 || requiredPermissions.length === 0) {
    return false
  }

  return requiredPermissions.every((permission) =>
    hasPermission(userRoles, permission)
  )
}