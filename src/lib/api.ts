import axios, { AxiosError, type AxiosInstance } from 'axios'
import { storageKeys } from './storage'
import { isTokenExpired } from './jwt'

const API_BASE_URL = 'https://hackathon-production-5123.up.railway.app'

export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  errors: unknown
  statusCode: number
  timestamp: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  expiresAt?: string
}

export function getStoredTokens(): AuthTokens | null {
  const accessToken = localStorage.getItem(storageKeys.accessToken)
  const refreshToken = localStorage.getItem(storageKeys.refreshToken)
  const expiresAt = localStorage.getItem(storageKeys.expiresAt) ?? undefined
  if (!accessToken || !refreshToken) return null
  return { accessToken, refreshToken, expiresAt }
}

export function setStoredTokens(tokens: AuthTokens) {
  localStorage.setItem(storageKeys.accessToken, tokens.accessToken)
  localStorage.setItem(storageKeys.refreshToken, tokens.refreshToken)
  if (tokens.expiresAt) localStorage.setItem(storageKeys.expiresAt, tokens.expiresAt)
}

export function clearStoredTokens() {
  localStorage.removeItem(storageKeys.accessToken)
  localStorage.removeItem(storageKeys.refreshToken)
  localStorage.removeItem(storageKeys.expiresAt)
}

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let refreshPromise: Promise<AuthTokens> | null = null

async function refreshTokensOrThrow(): Promise<AuthTokens> {
  const tokens = getStoredTokens()
  if (!tokens) throw new Error('Missing tokens')

  const res = await publicApi.post<
    ApiEnvelope<{ accessToken: string; refreshToken: string; expiresAt?: string }>
  >('/api/Auth/refresh', {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  })

  if (!res.data?.success) {
    throw new Error(res.data?.message || 'Token refresh failed')
  }

  const next: AuthTokens = {
    accessToken: res.data.data.accessToken,
    refreshToken: res.data.data.refreshToken,
    expiresAt: res.data.data.expiresAt,
  }
  setStoredTokens(next)
  return next
}

api.interceptors.request.use(async (config) => {
  const tokens = getStoredTokens()
  if (!tokens) return config

  if (tokens.accessToken && isTokenExpired(tokens.accessToken)) {
    if (!refreshPromise) {
      refreshPromise = refreshTokensOrThrow().finally(() => {
        refreshPromise = null
      })
    }
    await refreshPromise
  }

  const latest = getStoredTokens()
  if (latest?.accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${latest.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined

    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshTokensOrThrow().finally(() => {
          refreshPromise = null
        })
      }
      const refreshed = await refreshPromise
      original.headers = original.headers ?? {}
      original.headers.Authorization = `Bearer ${refreshed.accessToken}`
      return api(original)
    } catch (e) {
      clearStoredTokens()
      window.dispatchEvent(new CustomEvent('auth:logout'))
      return Promise.reject(e)
    }
  },
)

export function getApiErrorMessage(err: unknown) {
  const ax = err as AxiosError<unknown>
  const data = ax.response?.data as unknown

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.message === 'string' && obj.message) return obj.message
    if (typeof obj.title === 'string' && obj.title) return obj.title
  }

  if (typeof ax.message === 'string' && ax.message) return ax.message
  return 'Xəta baş verdi'
}
