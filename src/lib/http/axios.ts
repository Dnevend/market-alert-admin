import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { HttpErrorResponse, HttpResponse } from './type.ts'
import { useAuthStore } from '@/stores/auth-store'

export class Http {
  instance: AxiosInstance

  baseConfig: AxiosRequestConfig = {
    // 开发环境默认使用代理，生产环境需要配置 VITE_BASE_URL
    baseURL: import.meta.env.VITE_BASE_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  }

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Get token from Zustand store
        const { auth } = useAuthStore.getState()
        if (auth.accessToken) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse<HttpResponse>) => {
        const { success } = response.data

        if (!success) {
          return Promise.resolve(response)
        }

        return response
      },
      (error: AxiosError<HttpErrorResponse>) => {
        return Promise.reject(error.response)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse<HttpResponse>) => {
        return { ...response, ...response.data }
      }
    )
  }

  public get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.get(url, config)
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.post(url, data, config)
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.put(url, data, config)
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.patch(url, data, config)
  }

  public delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.delete(url, config)
  }
}

export default new Http({ timeout: 30000 })

// Also export a named instance for convenience
export const http = new Http({ timeout: 30000 })
