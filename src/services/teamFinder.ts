import { api, publicApi, type ApiEnvelope } from '../lib/api'
import type { TeamPost } from '../types/models'
import { extractTeamContact, stripTeamContactLine } from '../lib/utils'

type ApiTeamFinder = {
  id: number
  title: string
  skillsNeeded: string
  description: string
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

function splitSkills(raw: string) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function mapPost(p: ApiTeamFinder): TeamPost {
  const contact = extractTeamContact(p.description)
  const description = stripTeamContactLine(p.description)
  return {
    id: String(p.id),
    title: p.title,
    description: description || p.description,
    skills: splitSkills(p.skillsNeeded ?? ''),
    contact,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt ?? undefined,
    createdByUserId: String(p.userId),
    createdByName: p.userName,
  }
}

export async function list(params: { page: number; pageSize: number; skillSearch?: string }) {
  const res = await publicApi.get<ApiEnvelope<Paged<ApiTeamFinder>>>('/api/TeamFinder', {
    params,
  })
  const items = (res.data.data.items ?? []).map(mapPost)
  return { ...res.data.data, items }
}

export async function create(data: { title: string; skillsNeeded: string; description: string }) {
  await api.post('/api/TeamFinder', data)
}

export async function update(id: string, data: { title: string; skillsNeeded: string; description: string }) {
  await api.put(`/api/TeamFinder/${Number(id)}`, data)
}

export async function remove(id: string) {
  await api.delete(`/api/TeamFinder/${Number(id)}`)
}

