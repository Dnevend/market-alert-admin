import { createFileRoute } from '@tanstack/react-router'
import { RoleSwitcher } from '@/components/debug/role-switcher'

function PermissionsTest() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">权限测试页面</h1>
        <p className="text-muted-foreground mt-2">
          使用下面的工具切换用户角色，观察侧边栏菜单的变化
        </p>
      </div>

      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">角色切换器</h2>
          <RoleSwitcher />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="prose prose-sm max-w-none">
            <ol>
              <li>选择不同的用户角色</li>
              <li>观察左侧侧边栏菜单项的变化</li>
              <li>不同角色将看到不同的菜单项</li>
              <li>没有权限的菜单项将不会显示</li>
            </ol>

            <h3>权限详情</h3>
            <ul>
              <li><strong>管理员 (admin)</strong>：可以看到所有菜单项，包括用户管理、系统设置等</li>
              <li><strong>普通用户 (user)</strong>：可以看到基础功能，但无法访问用户管理和系统设置</li>
              <li><strong>查看者 (viewer)</strong>：只能查看页面，无法访问需要编辑权限的功能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/permissions-test')({
  component: PermissionsTest,
})