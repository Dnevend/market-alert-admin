import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { http } from '@/lib/http/axios'

/**
 * 检查用户是否已认证
 * @param redirectTo 重定向路径（默认为钱包登录页）
 * @returns 用户信息
 * @throws 如果未认证则重定向到登录页
 */
export function requireAuth(redirectTo = '/wallet-sign-in') {
  const { auth } = useAuthStore.getState()

  // 检查用户是否已登录
  if (!auth.user || !auth.accessToken) {
    throw redirect({
      to: redirectTo,
      search: { redirect: window.location.pathname }
    })
  }

  // 检查访问令牌是否过期（JWT exp字段是秒，需要转换为毫秒）
  if (auth.user.exp && auth.user.exp * 1000 < Date.now()) {
    useAuthStore.getState().auth.reset()
    throw redirect({
      to: redirectTo,
      search: { redirect: window.location.pathname }
    })
  }

  return auth.user
}

/**
 * 检查用户是否具有特定角色
 * @param roles 允许的角色列表
 * @param redirectTo 重定向路径
 * @returns 用户信息
 */
export function requireRole(roles: string[], redirectTo = '/wallet-sign-in') {
  const user = requireAuth(redirectTo)

  // 检查用户角色
  const hasRequiredRole = roles.some(role => user.role.includes(role))

  if (!hasRequiredRole) {
    throw redirect({
      to: '/403', // 权限不足页面
    })
  }

  return user
}

/**
 * 检查用户是否为管理员
 * @param redirectTo 重定向路径
 * @returns 用户信息
 */
export function requireAdmin(redirectTo = '/wallet-sign-in') {
  return requireRole(['admin'], redirectTo)
}

/**
 * 检查用户是否为普通用户或更高权限
 * @param redirectTo 重定向路径
 * @returns 用户信息
 */
export function requireUser(redirectTo = '/wallet-sign-in') {
  return requireRole(['user', 'admin'], redirectTo)
}

/**
 * 检查用户是否为访客或更高权限
 * @param redirectTo 重定向路径
 * @returns 用户信息
 */
export function requireGuest(redirectTo = '/wallet-sign-in') {
  return requireRole(['guest', 'user', 'admin'], redirectTo)
}

/**
 * 检查是否为钱包登录用户
 * @param redirectTo 重定向路径
 * @returns 用户信息
 */
export function requireWalletAuth(redirectTo = '/wallet-sign-in') {
  const user = requireAuth(redirectTo)

  // 检查是否有钱包地址（表明是钱包登录）
  if (!user.walletAddress) {
    throw redirect({
      to: redirectTo,
      search: { redirect: window.location.pathname }
    })
  }

  return user
}

/**
 * 服务端令牌验证（可选的额外安全措施）
 * @param token JWT令牌
 * @returns 验证结果
 */
export async function validateTokenWithServer(token: string) {
  try {
    const response = await http.post('/auth/validate', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Token validation failed:', error)
    return null
  }
}