import { http } from '@/lib/http/axios'

export interface UserProfile {
  id: number
  address: string
  role: string
  nickname: string | null
  avatar_url: string | null
  preferences: string | null
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  nickname?: string
  avatar_url?: string
  preferences?: string
}

export class UserAPI {
  /**
   * 获取用户资料
   */
  static async getProfile(): Promise<UserProfile> {
    const response = await http.get<UserProfile>('/users/profile')
    return response.data
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await http.put<UserProfile>('/users/profile', data)
    return response.data
  }

  /**
   * 检查认证状态
   */
  static async checkAuthStatus(): Promise<{
    authenticated: boolean
    address?: string
    role?: string
  }> {
    const response = await http.get('/auth/status')
    return response.data as {
      authenticated: boolean
      address?: string
      role?: string
    }
  }

  /**
   * 验证Token有效性
   */
  static async validateToken(): Promise<{
    valid: boolean
    address?: string
    role?: string
  }> {
    const response = await http.post('/auth/validate')
    return response.data as {
      valid: boolean
      address?: string
      role?: string
    }
  }
}