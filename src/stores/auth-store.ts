import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_DATA = 'market_alert_user_data'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  walletAddress?: string
  signature?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    isWalletConnected: boolean
    setIsWalletConnected: (connected: boolean) => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  // 从cookie恢复token和用户数据
  const cookieToken = getCookie(ACCESS_TOKEN)
  const cookieUser = getCookie(USER_DATA)
  const initToken = cookieToken ? JSON.parse(cookieToken) : ''
  const initUser = cookieUser ? JSON.parse(cookieUser) : null

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          // 同时更新内存状态和cookie
          if (user) {
            setCookie(USER_DATA, JSON.stringify(user))
          } else {
            removeCookie(USER_DATA)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(USER_DATA)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', isWalletConnected: false },
          }
        }),
      isWalletConnected: false,
      setIsWalletConnected: (connected) =>
        set((state) => ({ ...state, auth: { ...state.auth, isWalletConnected: connected } })),
    },
  }
})
