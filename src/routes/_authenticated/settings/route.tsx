import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/auth-guard'
import { Settings } from '@/features/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
  // 设置页面的额外认证检查
  beforeLoad: () => {
    // 基本认证检查
    requireAuth()

    // 这里可以添加特定的角色检查
    // 例如：只允许管理员角色访问设置
    // const user = requireAuth()
    // if (!user.role.includes('admin')) {
    //   throw redirect({ to: '/403' })
    // }
  }
})
