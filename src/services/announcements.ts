import { api, publicApi, type ApiEnvelope } from '../lib/api'
import type { Announcement, AnnouncementCategory } from '../types/models'

type ApiAnnouncement = {
  id: number
  title: string
  content: string
  category: AnnouncementCategory
  isApproved: boolean
  userName: string
  userId: number
  createdAt: string
  updatedAt: string
}

type Paged<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

function mapAnnouncement(a: ApiAnnouncement): Announcement {
  return {
    id: String(a.id),
    title: a.title,
    content: a.content,
    category: a.category,
    status: a.isApproved ? 'approved' : 'pending',
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    createdByUserId: String(a.userId),
    createdByName: a.userName,
  }
}

export async function listApproved(params?: {
  page?: number
  pageSize?: number
  category?: AnnouncementCategory
}) {
  const res = await publicApi.get<ApiEnvelope<Paged<ApiAnnouncement>>>('/api/Announcements', {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      ...(params?.category ? { category: params.category } : {}),
    },
  })
  const items = (res.data.data.items ?? []).map(mapAnnouncement)
  return { ...res.data.data, items }
}

export async function listPending(params?: { page?: number; pageSize?: number }) {
  const res = await api.get<ApiEnvelope<Paged<ApiAnnouncement>>>('/api/Announcements/pending', {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    },
  })
  const items = (res.data.data.items ?? []).map(mapAnnouncement)
  return { ...res.data.data, items }
}

export async function create(data: { title: string; content: string; category: AnnouncementCategory }) {
  await api.post('/api/Announcements', data)
}

export async function approve(id: string) {
  await api.put(`/api/Announcements/${Number(id)}/approve`)
}

export async function remove(id: string) {
  await api.delete(`/api/Announcements/${Number(id)}`)
}

export async function update(
  id: string,
  data: { title: string; content: string; category: AnnouncementCategory },
) {
  await api.put(`/api/Announcements/${Number(id)}`, data)
}

