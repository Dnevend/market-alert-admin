import { useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { hasAnyPermission } from '@/lib/permissions'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import type { NavGroup, NavItem } from '@/components/layout/types'

/**
 * 过滤导航项，只返回用户有权限的项目
 */
function filterNavItem(item: NavItem, userRoles: string[] | undefined): NavItem | null {
  // 如果项目没有权限要求，直接返回
  if (!item.permissions || item.permissions.length === 0) {
    return item
  }

  // 检查用户是否有权限访问此项目
  if (hasAnyPermission(userRoles, item.permissions)) {
    // 如果是可折叠项目，需要递归过滤子项目
    if ('items' in item && item.items) {
      const filteredItems = item.items
        .map((subItem) => filterNavItem(subItem, userRoles))
        .filter((subItem): subItem is NavItem => subItem !== null)

      // 如果所有子项目都被过滤掉了，则返回null
      if (filteredItems.length === 0) {
        return null
      }

      return {
        ...item,
        items: filteredItems as NavItem['items'],
      }
    }

    return item
  }

  // 用户没有权限访问此项目
  return null
}

/**
 * 过滤导航组，只返回用户有权限的组
 */
function filterNavGroup(group: NavGroup, userRoles: string[] | undefined): NavGroup | null {
  // 如果组没有权限要求，检查项目
  if (!group.permissions || group.permissions.length === 0) {
    // 过滤组内的项目
    const filteredItems = group.items
      .map((item) => filterNavItem(item, userRoles))
      .filter((item): item is NavItem => item !== null)

    // 如果所有项目都被过滤掉了，则返回null
    if (filteredItems.length === 0) {
      return null
    }

    return {
      ...group,
      items: filteredItems,
    }
  }

  // 检查用户是否有权限访问此组
  if (hasAnyPermission(userRoles, group.permissions)) {
    // 过滤组内的项目
    const filteredItems = group.items
      .map((item) => filterNavItem(item, userRoles))
      .filter((item): item is NavItem => item !== null)

    // 如果所有项目都被过滤掉了，则返回null
    if (filteredItems.length === 0) {
      return null
    }

    return {
      ...group,
      items: filteredItems,
    }
  }

  // 用户没有权限访问此组
  return null
}

/**
 * 返回根据用户权限过滤后的sidebar数据
 */
export function useSidebarData() {
  const { user } = useAuthStore((state) => state.auth)

  const filteredSidebarData = useMemo(() => {
    const userRoles = user?.role

    // 过滤导航组
    const filteredNavGroups = sidebarData.navGroups
      .map((group) => filterNavGroup(group, userRoles))
      .filter((group): group is NavGroup => group !== null)

    return {
      ...sidebarData,
      navGroups: filteredNavGroups,
    }
  }, [user])

  return filteredSidebarData
}