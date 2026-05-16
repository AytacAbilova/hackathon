import {
  api,
  clearStoredTokens,
  getApiErrorMessage,
  publicApi,
  setStoredTokens,
  type ApiEnvelope,
} from '../lib/api'
import { getSessionFromAccessToken } from '../lib/jwt'
import { storageKeys } from '../lib/storage'

type AuthData = {
  userId: number
  accessToken: string
  refreshToken: string
  expiresAt: string
  fullName: string
  email: string
}

async function unwrapAuth(res: ApiEnvelope<AuthData>) {
  if (!res?.success) {
    throw new Error(res?.message || 'Auth error')
  }
  return res.data
}

export async function register(data: { fullName: string; email: string; password: string }) {
  const res = await publicApi.post<ApiEnvelope<AuthData>>('/api/Auth/register', data)
  const auth = await unwrapAuth(res.data)
  setStoredTokens({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, expiresAt: auth.expiresAt })
  return auth
}

export async function login(data: { email: string; password: string }) {
  const res = await publicApi.post<ApiEnvelope<AuthData>>('/api/Auth/login', data)
  const auth = await unwrapAuth(res.data)
  setStoredTokens({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, expiresAt: auth.expiresAt })
  return auth
}

export async function refresh(data: { accessToken: string; refreshToken: string }) {
  const res = await publicApi.post<ApiEnvelope<AuthData>>('/api/Auth/refresh', data)
  const auth = await unwrapAuth(res.data)
  setStoredTokens({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, expiresAt: auth.expiresAt })
  return auth
}

export async function revoke() {
  try {
    await api.post('/api/Auth/revoke')
  } catch (e) {
    getApiErrorMessage(e)
  } finally {
    clearStoredTokens()
    window.dispatchEvent(new CustomEvent('auth:logout'))
  }
}

export function getSessionFromStoredAccessToken() {
  const accessToken = localStorage.getItem(storageKeys.accessToken)
  if (!accessToken) return null
  return getSessionFromAccessToken(accessToken)
}
