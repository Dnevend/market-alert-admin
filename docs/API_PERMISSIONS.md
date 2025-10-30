# API权限控制系统

本文档介绍了项目中实现的基于角色的API权限控制系统。

## 概述

该系统提供了细粒度的API访问控制，确保不同角色的用户只能访问其权限范围内的API接口。

## 用户角色

### 1. 管理员 (admin)
- **权限**: 可以访问所有API接口
- **范围**: 完全的系统管理权限
- **示例**: 用户管理、系统设置、所有CRUD操作

### 2. 普通用户 (user)
- **权限**: 可以访问部分API接口
- **范围**: 基础功能的使用权限
- **示例**: 查看和创建自己的数据，但不能管理系统设置

### 3. 查看者 (viewer)
- **权限**: 只读API访问权限
- **范围**: 只能查看数据，不能修改
- **示例**: 查看系统状态，但不能进行任何修改操作

### 4. 访客 (guest)
- **权限**: 无任何API权限
- **范围**: 只能访问公开页面
- **示例**: 未登录用户或受限用户

## API权限配置

### 权限映射规则

每个API端点都配置了允许访问的角色列表：

```typescript
// 示例：交易符号API权限配置
{
  'GET:/admin/symbols': ['admin', 'user'],      // 管理员和普通用户可访问
  'POST:/admin/symbols': ['admin'],             // 只有管理员可创建
  'PUT:/admin/symbols/*': ['admin'],            // 只有管理员可修改
  'DELETE:/admin/symbols/*': ['admin'],         // 只有管理员可删除
}
```

### 通配符支持

权限规则支持通配符匹配：

```typescript
// 匹配所有用户删除操作
'DELETE:/admin/users/*': ['admin']

// 匹配所有系统设置更新操作
'PUT:/admin/settings/*': ['admin']
```

## 使用方法

### 1. HTTP客户端自动权限检查

系统会自动在HTTP请求前进行权限检查：

```typescript
// 如果用户没有权限，请求会被拦截并返回403错误
try {
  const response = await http.get('/admin/symbols')
  // 有权限，请求正常执行
} catch (error) {
  if (error.response?.status === 403) {
    // 无权限访问
    console.error('Access denied:', error.response.data.message)
  }
}
```

### 2. 编程式权限检查

使用Hook检查API权限：

```typescript
import { useApiPermissions } from '@/hooks/use-api-permissions'

function MyComponent() {
  const { checkApiPermission, isGuest, isAdmin } = useApiPermissions()

  const canDeleteUsers = checkApiPermission('DELETE', '/admin/users/123')

  if (isGuest) {
    return <div>请登录后使用</div>
  }

  if (isAdmin) {
    return <AdminPanel />
  }

  return <UserPanel />
}
```

### 3. 快速权限检查

使用便捷Hook进行权限检查：

```typescript
import { useCanAccess } from '@/hooks/use-api-permissions'

function DeleteButton({ userId }) {
  const canDelete = useCanAccess('DELETE', `/admin/users/${userId}`)

  if (!canDelete) {
    return null // 无权限时不显示按钮
  }

  return <Button onClick={() => deleteUser(userId)}>删除用户</Button>
}
```

## 测试权限

### 权限测试页面

访问 `/permissions-test` 页面可以：

1. 切换不同用户角色
2. 测试各种API端点的权限
3. 观察权限拦截效果
4. 查看详细的权限说明

### 测试用例

系统提供了多个测试API端点：

- `GET:/admin/symbols` - 测试读取权限
- `POST:/admin/symbols` - 测试创建权限
- `GET:/admin/settings` - 测试管理员权限
- `GET:/admin/alerts` - 测试用户权限
- `DELETE:/admin/users/123` - 测试删除权限

## 错误处理

### 403权限错误

当用户无权限访问API时，系统会返回：

```json
{
  "error": "API_ACCESS_DENIED",
  "message": "Access denied. You don't have permission to access GET /admin/settings",
  "code": 403
}
```

### 错误处理最佳实践

```typescript
try {
  const response = await http.get('/admin/symbols')
  // 处理成功响应
} catch (error) {
  if (error.response?.status === 403) {
    // 权限不足的处理
    toast.error('您没有权限执行此操作')
    // 可以重定向到权限说明页面
    navigate('/permissions-test')
  } else {
    // 其他错误的处理
    toast.error('请求失败')
  }
}
```

## 安全特性

### 1. 前端权限拦截
- 所有API请求在发送前都会进行权限检查
- 无权限请求会被直接拦截，不会发送到服务器

### 2. 默认拒绝策略
- 未明确配置权限的API端点默认拒绝访问
- 确保系统安全性，防止权限遗漏

### 3. 角色继承
- 高级角色自动拥有低级角色的权限
- 简化权限配置，提高可维护性

### 4. 实时权限检查
- 权限检查基于当前用户状态
- 用户角色变更后权限立即生效

## 扩展权限

### 添加新角色

1. 在 `UserRole` 中添加新角色
2. 在 `rolePermissions` 中配置页面权限
3. 在 `apiPermissions` 中配置API权限

### 添加新API权限

1. 在 `ApiEndpoint` 中定义新的端点
2. 在 `apiPermissions` 中配置允许的角色
3. 更新相关组件的权限检查

## 最佳实践

1. **最小权限原则**: 只给用户必需的权限
2. **定期权限审查**: 定期检查权限配置的合理性
3. **权限测试**: 充分测试各种角色的权限边界
4. **错误处理**: 妥善处理权限错误，提供友好的用户体验
5. **日志记录**: 记录权限检查日志，便于安全审计