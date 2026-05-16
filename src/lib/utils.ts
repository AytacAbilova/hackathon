import type { AnnouncementCategory, LostFoundStatus, Role } from '../types/models'

export function nowIso() {
  return new Date().toISOString()
}

export function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('az-AZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function sortByCreatedAtDesc<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  )
}

export function getRoleHome(role: Role) {
  if (role === 'admin') return '/admin'
  if (role === 'teacher') return '/teacher'
  return '/student'
}

export function roleLabel(role: Role) {
  if (role === 'admin') return 'Admin'
  if (role === 'teacher') return 'Müəllim'
  return 'Tələbə'
}

export function canCreateAnnouncement(role: Role) {
  return role === 'admin' || role === 'teacher'
}

export function announcementCategoryLabel(category: AnnouncementCategory) {
  if (category === 1) return 'General'
  if (category === 2) return 'Academic'
  if (category === 3) return 'Social'
  return 'Career'
}

export function lostFoundStatusLabel(status: LostFoundStatus) {
  if (status === 0) return 'İtmiş'
  if (status === 1) return 'Tapılmış'
  return 'Həll olundu'
}

export function extractLostFoundLocation(description: string) {
  const line = description.split('\n')[0] ?? ''
  const m = line.match(/^\s*(yer|location)\s*:\s*(.+)\s*$/i)
  if (!m) return ''
  return m[2] ?? ''
}

export function extractTeamContact(description: string) {
  const lines = description.split('\n')
  for (const line of lines) {
    const m = line.match(/^\s*(\u0259laq\u0259|elaqe|contact)\s*:\s*(.+)\s*$/i)
    if (m?.[2]) return m[2].trim()
  }
  return ''
}

export function stripTeamContactLine(description: string) {
  return description
    .split('\n')
    .filter((line) => !/^\s*(\u0259laq\u0259|elaqe|contact)\s*:/i.test(line))
    .join('\n')
    .trim()
}

export function canAccess(route: string, role: Role) {
  if (route.startsWith('/admin')) return role === 'admin'
  if (route.startsWith('/teacher')) return role === 'teacher'
  if (route.startsWith('/student')) return role === 'student'
  return true
}
