import { useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { hasApiPermission } from '@/lib/api-permissions'

/**
 * 返回用户API权限相关的Hook
 */
export function useApiPermissions() {
  const { user } = useAuthStore((state) => state.auth)
  const userRoles = user?.role

  // 检查用户是否有指定API权限
  const checkApiPermission = useMemo(() =>
    (method: string, url: string) => hasApiPermission(userRoles, method, url),
    [userRoles]
  )

  // 检查用户是否有访客身份（无API权限）
  const isGuest = useMemo(() => {
    return !userRoles || userRoles.includes('guest')
  }, [userRoles])

  // 检查用户是否是管理员
  const isAdmin = useMemo(() => {
    return userRoles?.includes('admin') || false
  }, [userRoles])

  // 检查用户是否是普通用户
  const isUser = useMemo(() => {
    return userRoles?.includes('user') || false
  }, [userRoles])

  return {
    userRoles,
    checkApiPermission,
    isGuest,
    isAdmin,
    isUser,
  }
}

/**
 * 快速检查权限的工具函数
 */
export function useCanAccess(method: string, url: string): boolean {
  const { checkApiPermission } = useApiPermissions()
  return checkApiPermission(method, url)
}