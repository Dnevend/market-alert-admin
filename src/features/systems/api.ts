import { http } from '@/lib/http/axios'
import type {
  TradingSymbol,
  CreateTradingSymbolRequest,
  UpdateTradingSymbolRequest,
  SystemSettings,
  UpdateSystemSettingsRequest,
  AlertHistory,
  PaginatedResponse,
  SymbolsQueryParams,
  AlertsQueryParams,
  TriggerRequest,
  TriggerResponse,
  ScheduledResponse,
} from './types'

// Trading Symbols API
export const symbolsApi = {
  // Get all symbols with pagination
  async getAll(params?: SymbolsQueryParams): Promise<PaginatedResponse<TradingSymbol>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    if (params?.enabled !== undefined) searchParams.append('enabled', params.enabled.toString())

    const query = searchParams.toString()
    const endpoint = `/admin/symbols${query ? `?${query}` : ''}`

    const response = await http.get<PaginatedResponse<TradingSymbol>>(endpoint)
    return response.data
  },

  // Create new symbol
  async create(data: CreateTradingSymbolRequest): Promise<TradingSymbol> {
    const response = await http.post<TradingSymbol>('/admin/symbols', data)
    return response.data
  },

  // Update symbol
  async update(symbol: string, data: UpdateTradingSymbolRequest): Promise<TradingSymbol> {
    const response = await http.put<TradingSymbol>(`/admin/symbols/${symbol}`, data)
    return response.data
  },

  // Disable/delete symbol
  async disable(symbol: string): Promise<TradingSymbol> {
    const response = await http.delete<TradingSymbol>(`/admin/symbols/${symbol}`)
    return response.data
  },
}

// System Settings API
export const settingsApi = {
  // Get system settings
  async get(): Promise<SystemSettings> {
    const response = await http.get<SystemSettings>('/admin/settings')
    return response.data
  },

  // Update system settings
  async update(data: UpdateSystemSettingsRequest): Promise<SystemSettings> {
    const response = await http.put<SystemSettings>('/admin/settings', data)
    return response.data
  },
}

// Alerts History API
export const alertsApi = {
  // Get alerts history
  async getAll(params?: AlertsQueryParams): Promise<AlertHistory[]> {
    const searchParams = new URLSearchParams()
    if (params?.symbol) searchParams.append('symbol', params.symbol)
    if (params?.since) searchParams.append('since', params.since.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const query = searchParams.toString()
    const endpoint = `/admin/alerts${query ? `?${query}` : ''}`

    const response = await http.get<AlertHistory[]>(endpoint)
    return response.data
  },
}

// Admin Actions API
export const adminApi = {
  // Manual trigger monitoring
  async trigger(data?: TriggerRequest): Promise<TriggerResponse> {
    const response = await http.post<TriggerResponse>('/trigger', data || {})
    return response.data
  },

  // Manual trigger scheduled task
  async triggerScheduled(): Promise<ScheduledResponse> {
    const response = await http.post<ScheduledResponse>('/admin/scheduled')
    return response.data
  },
}