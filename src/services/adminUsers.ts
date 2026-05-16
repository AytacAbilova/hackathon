import { api, type ApiEnvelope } from '../lib/api'
import type { Role, User } from '../types/models'
import { nowIso } from '../lib/utils'

export type ApiRole = 1 | 2 | 3

function roleToApi(role: Role): ApiRole {
  if (role === 'student') return 1
  if (role === 'teacher') return 2
  return 3
}

function roleFromApi(role: ApiRole): Role {
  if (role === 1) return 'student'
  if (role === 2) return 'teacher'
  return 'admin'
}

type ApiUser = {
  id: number
  fullName: string
  email: string
  role: ApiRole
  createdAt?: string
}

type Paged<T> = {
  items: T[]
  total: number
  page: number
  limit: number
}

function mapUser(u: ApiUser): User {
  return {
    id: String(u.id),
    fullName: u.fullName,
    email: u.email,
    password: '',
    role: roleFromApi(u.role),
    createdAt: u.createdAt ?? nowIso(),
  }
}

export async function list(params?: { page?: number; limit?: number; role?: Role }) {
  const res = await api.get<ApiEnvelope<Paged<ApiUser>>>('/api/admin/users', {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      ...(params?.role ? { role: roleToApi(params.role) } : {}),
    },
  })
  const items = (res.data.data.items ?? []).map(mapUser)
  return { ...res.data.data, items }
}

export async function create(data: { fullName: string; email: string; password: string; role: Role }) {
  await api.post('/api/admin/users', {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: roleToApi(data.role),
  })
}

export async function update(id: string, data: { fullName: string; email: string; role: Role }) {
  await api.put(`/api/admin/users/${Number(id)}`, {
    fullName: data.fullName,
    email: data.email,
    role: roleToApi(data.role),
  })
}

export async function remove(id: string) {
  await api.delete(`/api/admin/users/${Number(id)}`)
}

