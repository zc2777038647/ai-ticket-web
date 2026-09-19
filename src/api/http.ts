import axios, { type AxiosError, type AxiosInstance } from 'axios'
import type { ApiResponse } from '../types/api'

const TOKEN_KEY = 'ai-ticket-access-token'

export class ApiError extends Error {
  readonly status?: number
  readonly code?: number
  constructor(message: string, status?: number, code?: number) { super(message); this.name = 'ApiError'; this.status = status; this.code = code }
}

export const http: AxiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/', timeout: 12000, headers: { 'Content-Type': 'application/json' } })
http.interceptors.request.use((config) => { const token = localStorage.getItem(TOKEN_KEY); if (token) config.headers.Authorization = `Bearer ${token}`; return config })
http.interceptors.response.use((response) => response, (error: AxiosError<ApiResponse<unknown>>) => {
  const status = error.response?.status
  if (status === 401) { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('ai-ticket-user'); if (window.location.pathname !== '/login') window.location.assign('/login') }
  const payload = error.response?.data
  const message = payload?.message || (status === 503 ? 'AI 服务暂时不可用，核心工单业务仍可使用' : '请求失败，请稍后重试')
  return Promise.reject(new ApiError(message, status, payload?.code))
})

export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  const payload = response.data
  if (payload.code !== 0 || payload.data === null) throw new ApiError(payload.message, undefined, payload.code)
  return payload.data
}
export function getErrorMessage(error: unknown, fallback = '请求失败，请稍后重试'): string { if (error instanceof ApiError) return error.message; if (axios.isAxiosError(error)) return error.message || fallback; if (error instanceof Error) return error.message; return fallback }
export { TOKEN_KEY }
