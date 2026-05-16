import type { Role } from '../types/models'

type JwtPayload = Record<string, unknown>

function base64UrlToBase64(input: string) {
  return input.replace(/-/g, '+').replace(/_/g, '/')
}

function decodeBase64Url(input: string) {
  const base64 = base64UrlToBase64(input)
  const pad = '='.repeat((4 - (base64.length % 4)) % 4)
  const str = atob(base64 + pad)
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(str, (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
  } catch {
    return str
  }
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const json = decodeBase64Url(parts[1])
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

const claims = {
  userId: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
} as const

function normalizeRole(raw: string): Role {
  const v = raw.trim().toLowerCase()
  if (v === 'admin') return 'admin'
  if (v === 'teacher') return 'teacher'
  if (v === 'student') return 'student'
  if (v === 'müəllim' || v === 'muellim') return 'teacher'
  if (v === 'tələbə' || v === 'telebe') return 'student'
  return 'student'
}

export function getSessionFromAccessToken(accessToken: string) {
  const payload = parseJwt(accessToken)
  if (!payload) return null

  const userId = String(payload[claims.userId] ?? payload['sub'] ?? '')
  const email = String(payload[claims.email] ?? payload['email'] ?? '')
  const fullName = String(payload[claims.name] ?? payload['name'] ?? '')
  const roleRaw = String(payload[claims.role] ?? payload['role'] ?? 'student')
  const role = normalizeRole(roleRaw)

  const exp = Number(payload['exp'] ?? 0)
  const expiresAtMs = exp ? exp * 1000 : 0

  if (!userId) return null

  return {
    userId,
    email,
    fullName,
    role,
    expiresAtMs,
  }
}

export function isTokenExpired(accessToken: string, skewSeconds = 20) {
  const session = getSessionFromAccessToken(accessToken)
  if (!session?.expiresAtMs) return false
  return Date.now() + skewSeconds * 1000 >= session.expiresAtMs
}
