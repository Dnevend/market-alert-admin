export interface TradingSymbol {
  id: number
  symbol: string
  enabled: boolean
  threshold_percent: number
  cooldown_minutes: number
  webhook_url?: string
  created_at: string
  updated_at: string
}

export interface CreateTradingSymbolRequest {
  symbol: string
  enabled: boolean
  threshold_percent: number
  cooldown_minutes: number
  webhook_url?: string
}

export interface UpdateTradingSymbolRequest {
  enabled?: boolean
  threshold_percent?: number
  cooldown_minutes?: number
  webhook_url?: string
}

export interface SystemSettings {
  id: number
  default_threshold_percent: number
  window_minutes: number
  default_cooldown_minutes: number
  binance_base_url: string
  created_at: string
  updated_at: string
}

export interface UpdateSystemSettingsRequest {
  default_threshold_percent?: number
  window_minutes?: number
  default_cooldown_minutes?: number
  binance_base_url?: string
}

export interface AlertHistory {
  id: number
  symbol: string
  change_percent: number
  direction: 'UP' | 'DOWN'
  window_start: number
  window_end: number
  idempotency_key: string
  status: 'SENT' | 'FAILED' | 'SKIPPED'
  response_code?: number
  response_body?: string
  created_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface SymbolsQueryParams {
  page?: number
  pageSize?: number
  enabled?: boolean
}

export interface AlertsQueryParams {
  symbol?: string
  since?: number
  status?: 'SENT' | 'FAILED' | 'SKIPPED'
  limit?: number
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

export interface TriggerRequest {
  symbols?: string[]
}

export interface TriggerResponse {
  message: string
  results: {
    processed: number
    alerts: number
  }
}

export interface ScheduledResponse {
  message: string
  results: {
    processed: number
    alerts: number
    errors: number
  }
  timestamp: string
}