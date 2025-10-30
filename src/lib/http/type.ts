export interface HttpResponse<D = unknown> {
  data: D
  success: boolean
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface HttpErrorResponse {
  code: number
  msg?: string
  message?: string
}
