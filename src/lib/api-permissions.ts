import { UserRole } from './permissions'

// API端点权限定义
export const ApiEndpoint = {
  // 交易符号相关API
  SYMBOLS_GET: 'GET:/admin/symbols',
  SYMBOLS_CREATE: 'POST:/admin/symbols',
  SYMBOLS_UPDATE: 'PUT:/admin/symbols/*',
  SYMBOLS_DELETE: 'DELETE:/admin/symbols/*',

  // 系统设置相关API
  SETTINGS_GET: 'GET:/admin/settings',
  SETTINGS_UPDATE: 'PUT:/admin/settings',

  // 警报相关API
  ALERTS_GET: 'GET:/admin/alerts',
  ALERTS_CREATE: 'POST:/admin/alerts',
  ALERTS_UPDATE: 'PUT:/admin/alerts/*',
  ALERTS_DELETE: 'DELETE:/admin/alerts/*',

  // 用户管理相关API
  USERS_GET: 'GET:/admin/users',
  USERS_CREATE: 'POST:/admin/users',
  USERS_UPDATE: 'PUT:/admin/users/*',
  USERS_DELETE: 'DELETE:/admin/users/*',

  // 任务管理相关API
  TASKS_GET: 'GET:/admin/tasks',
  TASKS_CREATE: 'POST:/admin/tasks',
  TASKS_UPDATE: 'PUT:/admin/tasks/*',
  TASKS_DELETE: 'DELETE:/admin/tasks/*',

  // 应用管理相关API
  APPS_GET: 'GET:/admin/apps',
  APPS_CREATE: 'POST:/admin/apps',
  APPS_UPDATE: 'PUT:/admin/apps/*',
  APPS_DELETE: 'DELETE:/admin/apps/*',

  // 聊天相关API
  CHATS_GET: 'GET:/admin/chats',
  CHATS_CREATE: 'POST:/admin/chats',
  CHATS_UPDATE: 'PUT:/admin/chats/*',
  CHATS_DELETE: 'DELETE:/admin/chats/*',

  // 通用管理API
  ADMIN_STATS: 'GET:/admin/stats',
  ADMIN_TRIGGER: 'POST:/admin/trigger',
  ADMIN_SCHEDULED: 'GET:/admin/scheduled',
} as const

export type ApiEndpoint = typeof ApiEndpoint[keyof typeof ApiEndpoint]

// API端点权限映射 - 哪些角色可以访问哪些API
export const apiPermissions: Record<ApiEndpoint, UserRole[]> = {
  // 交易符号API - 只有admin和user可以访问
  [ApiEndpoint.SYMBOLS_GET]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.SYMBOLS_CREATE]: [UserRole.ADMIN],
  [ApiEndpoint.SYMBOLS_UPDATE]: [UserRole.ADMIN],
  [ApiEndpoint.SYMBOLS_DELETE]: [UserRole.ADMIN],

  // 系统设置API - 只有admin可以访问
  [ApiEndpoint.SETTINGS_GET]: [UserRole.ADMIN],
  [ApiEndpoint.SETTINGS_UPDATE]: [UserRole.ADMIN],

  // 警报API - admin和user可以查看，只有admin可以管理
  [ApiEndpoint.ALERTS_GET]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.ALERTS_CREATE]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.ALERTS_UPDATE]: [UserRole.ADMIN],
  [ApiEndpoint.ALERTS_DELETE]: [UserRole.ADMIN],

  // 用户管理API - 只有admin可以访问
  [ApiEndpoint.USERS_GET]: [UserRole.ADMIN],
  [ApiEndpoint.USERS_CREATE]: [UserRole.ADMIN],
  [ApiEndpoint.USERS_UPDATE]: [UserRole.ADMIN],
  [ApiEndpoint.USERS_DELETE]: [UserRole.ADMIN],

  // 任务管理API - admin和user都可以访问
  [ApiEndpoint.TASKS_GET]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.TASKS_CREATE]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.TASKS_UPDATE]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.TASKS_DELETE]: [UserRole.ADMIN],

  // 应用管理API - admin和user都可以访问
  [ApiEndpoint.APPS_GET]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.APPS_CREATE]: [UserRole.ADMIN],
  [ApiEndpoint.APPS_UPDATE]: [UserRole.ADMIN],
  [ApiEndpoint.APPS_DELETE]: [UserRole.ADMIN],

  // 聊天API - admin和user都可以访问
  [ApiEndpoint.CHATS_GET]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.CHATS_CREATE]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.CHATS_UPDATE]: [UserRole.ADMIN, UserRole.USER],
  [ApiEndpoint.CHATS_DELETE]: [UserRole.ADMIN],

  // 通用管理API - 只有admin可以访问
  [ApiEndpoint.ADMIN_STATS]: [UserRole.ADMIN],
  [ApiEndpoint.ADMIN_TRIGGER]: [UserRole.ADMIN],
  [ApiEndpoint.ADMIN_SCHEDULED]: [UserRole.ADMIN],
}

/**
 * 检查用户是否有权限访问指定API端点
 */
export function hasApiPermission(userRoles: string[] | undefined, method: string, url: string): boolean {
  // 如果用户没有角色，则没有权限
  if (!userRoles || userRoles.length === 0) {
    return false
  }

  // 如果用户是guest，拒绝所有API访问
  if (userRoles.includes(UserRole.GUEST)) {
    return false
  }

  // 构造API端点标识
  const apiEndpoint = `${method}:${url}`

  // 查找匹配的API权限规则
  for (const [endpoint, allowedRoles] of Object.entries(apiPermissions)) {
    if (matchApiEndpoint(apiEndpoint, endpoint)) {
      // 检查用户是否有任一允许的角色
      return allowedRoles.some(role => userRoles.includes(role))
    }
  }

  // 如果没有找到明确的权限规则，默认拒绝（安全优先）
  console.warn(`No API permission rule found for ${apiEndpoint}, denying access`)
  return false
}

/**
 * 匹配API端点规则
 * 支持通配符匹配，例如 PUT:/admin/symbols/* 可以匹配 PUT:/admin/symbols/BTCUSDT
 */
function matchApiEndpoint(requestEndpoint: string, ruleEndpoint: string): boolean {
  // 如果规则不包含通配符，直接匹配
  if (!ruleEndpoint.includes('*')) {
    return requestEndpoint === ruleEndpoint
  }

  // 将通配符规则转换为正则表达式
  const regexPattern = ruleEndpoint
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
    .replace(/\\\*/g, '.*') // 将 * 转换为 .* 匹配任意字符

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(requestEndpoint)
}

/**
 * 获取用户无权限访问的API错误信息
 */
export function getApiPermissionError(method: string, url: string) {
  return {
    error: 'API_ACCESS_DENIED',
    message: `Access denied. You don't have permission to access ${method} ${url}`,
    code: 403,
  }
}