import { api, publicApi, type ApiEnvelope } from '../lib/api'
import type { LostFoundPost, LostFoundStatus } from '../types/models'

type ApiLostFound = {
  id: number
  title: string
  description: string
  contact: string
  imageUrl: string
  status: LostFoundStatus
  userId: number
  userName: string
  createdAt: string
  updatedAt: string | null
}

type Paged<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

function mapPost(p: ApiLostFound): LostFoundPost {
  return {
    id: String(p.id),
    title: p.title,
    description: p.description,
    contact: p.contact,
    imageUrl: p.imageUrl,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt ?? undefined,
    createdByUserId: String(p.userId),
    createdByName: p.userName,
  }
}

export async function list(params: { page: number; pageSize: number; status: LostFoundStatus }) {
  const res = await publicApi.get<ApiEnvelope<Paged<ApiLostFound>>>('/api/LostFound', {
    params,
  })
  const items = (res.data.data.items ?? []).map(mapPost)
  return { ...res.data.data, items }
}

export async function create(data: {
  title: string
  description: string
  contact: string
  imageUrl: string
  status: LostFoundStatus
}) {
  await api.post('/api/LostFound', data)
}

export async function update(
  id: string,
  data: { title: string; description: string; contact: string; imageUrl: string },
) {
  await api.put(`/api/LostFound/${Number(id)}`, data)
}

export async function setStatus(id: string, status: LostFoundStatus) {
  await api.put(`/api/LostFound/${Number(id)}/status`, null, { params: { status } })
}

export async function remove(id: string) {
  await api.delete(`/api/LostFound/${Number(id)}`)
}

