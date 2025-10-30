import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuthStore } from '@/stores/auth-store'
import { UserRole } from '@/lib/permissions'

export function RoleSwitcher() {
  const { auth } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<string>(auth.user?.role?.[0] || UserRole.USER)

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)

    // 创建测试用户数据
    const testUser = {
      accountNo: 'TEST123',
      email: 'test@example.com',
      role: [role],
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
      walletAddress: '0x1234567890123456789012345678901234567890',
      signature: 'test-signature'
    }

    auth.setUser(testUser)
  }

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>权限测试工具</CardTitle>
        <CardDescription>
          切换用户角色来测试侧边栏权限渲染效果
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>当前角色: {auth.user?.role?.join(', ') || '未登录'}</Label>
          <RadioGroup value={selectedRole} onValueChange={handleRoleChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={UserRole.ADMIN} id="admin" />
              <Label htmlFor="admin">管理员 (Admin) - 所有权限</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={UserRole.USER} id="user" />
              <Label htmlFor="user">普通用户 (User) - 基础权限</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={UserRole.VIEWER} id="viewer" />
              <Label htmlFor="viewer">查看者 (Viewer) - 只读权限</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>角色权限说明：</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>管理员：可以访问所有页面和功能</li>
            <li>普通用户：可以访问基础功能，不能管理用户和系统设置</li>
            <li>查看者：只能查看页面，不能进行编辑操作</li>
          </ul>
        </div>

        <Button
          onClick={() => auth.setUser(null)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          清除用户数据（未登录状态）
        </Button>
      </CardContent>
    </Card>
  )
}