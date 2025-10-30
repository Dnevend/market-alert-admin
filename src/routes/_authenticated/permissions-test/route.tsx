import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RoleSwitcher } from '@/components/debug/role-switcher'
import { useAuthStore } from '@/stores/auth-store'
import { http } from '@/lib/http/axios'

function ApiTestButton({
  method,
  url,
  description
}: {
  method: string;
  url: string;
  description: string;
}) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const testApi = async () => {
    setLoading(true)
    setResult(null)

    try {
      switch (method.toLowerCase()) {
        case 'get':
          await http.get(url)
          break
        case 'post':
          await http.post(url)
          break
        case 'put':
          await http.put(url)
          break
        case 'delete':
          await http.delete(url)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      setResult({
        success: true,
        message: `✅ API调用成功 - 权限验证通过`
      })
    } catch (error: any) {
      const status = error.response?.status || 'Network Error'
      const message = error.response?.data?.message || error.message || '请求失败'

      setResult({
        success: false,
        message: `❌ API调用失败 (${status}): ${message}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant={method === 'GET' ? 'secondary' : 'destructive'}>
            {method}
          </Badge>
          <code className="text-sm font-mono">{url}</code>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {result && (
          <p className={`text-sm mt-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.message}
          </p>
        )}
      </div>
      <Button
        onClick={testApi}
        disabled={loading}
        size="sm"
        variant="outline"
      >
        {loading ? '测试中...' : '测试'}
      </Button>
    </div>
  )
}

function PermissionsTest() {
  const { auth } = useAuthStore()
  const currentRole = auth.user?.role?.[0] || '未登录'

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">权限测试页面</h1>
        <p className="text-muted-foreground mt-2">
          使用下面的工具切换用户角色，观察侧边栏菜单和API权限的变化
        </p>
        <div className="mt-2">
          <Badge variant="outline">当前角色: {currentRole}</Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">角色切换器</h2>
          <RoleSwitcher />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">API权限测试</h2>
          <Card>
            <CardHeader>
              <CardTitle>测试不同角色的API访问权限</CardTitle>
              <CardDescription>
                点击测试按钮，观察不同角色对API的访问权限差异
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ApiTestButton
                method="GET"
                url="/admin/symbols"
                description="获取交易符号列表 - Admin和User可访问"
              />
              <ApiTestButton
                method="POST"
                url="/admin/symbols"
                description="创建交易符号 - 仅Admin可访问"
              />
              <ApiTestButton
                method="GET"
                url="/admin/settings"
                description="获取系统设置 - 仅Admin可访问"
              />
              <ApiTestButton
                method="GET"
                url="/admin/alerts"
                description="获取警报列表 - Admin和User可访问"
              />
              <ApiTestButton
                method="DELETE"
                url="/admin/users/123"
                description="删除用户 - 仅Admin可访问"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">权限详情说明</h2>
        <div className="prose prose-sm max-w-none">
          <h3>页面权限</h3>
          <ul>
            <li><strong>管理员 (admin)</strong>：可以看到所有菜单项，包括用户管理、系统设置等</li>
            <li><strong>普通用户 (user)</strong>：可以看到基础功能，但无法访问用户管理和系统设置</li>
            <li><strong>查看者 (viewer)</strong>：只能查看页面，无法访问需要编辑权限的功能</li>
            <li><strong>访客 (guest)</strong>：只能查看基础页面，无法访问任何管理功能</li>
          </ul>

          <h3>API权限</h3>
          <ul>
            <li><strong>管理员</strong>：可以调用所有API接口</li>
            <li><strong>普通用户</strong>：可以调用读取和部分创建API，但不能调用管理API</li>
            <li><strong>查看者</strong>：只能调用部分读取API</li>
            <li><strong>访客</strong>：无任何API权限，所有API调用都会被拒绝</li>
          </ul>

          <h3>使用说明</h3>
          <ol>
            <li>选择不同的用户角色</li>
            <li>观察左侧侧边栏菜单项的变化</li>
            <li>测试API权限，不同角色对API的访问权限不同</li>
            <li>没有权限的菜单项将不会显示</li>
            <li>无权限的API调用将被拦截并返回403错误</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/permissions-test')({
  component: PermissionsTest,
})