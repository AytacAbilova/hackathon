import type { Role } from '../types/models'

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

export function canAccess(route: string, role: Role) {
  if (route.startsWith('/admin')) return role === 'admin'
  if (route.startsWith('/teacher')) return role === 'teacher'
  if (route.startsWith('/student')) return role === 'student'
  return true
}
