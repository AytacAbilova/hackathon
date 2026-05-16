import type { Announcement, EventItem, LostFoundPost, TeamPost, User } from '../types/models'
import { storageKeys, readJson, writeJson } from './storage'
import { makeId, nowIso } from './utils'

export function seedIfEmpty() {
  const existingUsers = readJson<User[]>(storageKeys.users, [])
  if (existingUsers.length > 0) return

  const adminId = makeId('usr')
  const teacherId = makeId('usr')
  const studentId = makeId('usr')

  const users: User[] = [
    {
      id: adminId,
      fullName: 'Platform Admin',
      email: 'admin@academy.az',
      password: 'admin123',
      role: 'admin',
      createdAt: nowIso(),
    },
    {
      id: teacherId,
      fullName: 'Nümunə Müəllim',
      email: 'teacher@academy.az',
      password: 'teacher123',
      role: 'teacher',
      createdAt: nowIso(),
    },
    {
      id: studentId,
      fullName: 'Nümunə Tələbə',
      email: 'student@academy.az',
      password: 'student123',
      role: 'student',
      createdAt: nowIso(),
    },
  ]

  const announcements: Announcement[] = [
    {
      id: makeId('ann'),
      title: 'Akademiya elanları platforması istifadəyə verildi',
      content:
        'Bu platformada dərs cədvəli, elanlar, eventlər, vakansiyalar və daha çoxu olacaq.',
      category: 2,
      status: 'approved',
      createdAt: nowIso(),
      createdByUserId: teacherId,
    },
    {
      id: makeId('ann'),
      title: 'Hackathon komandası axtarışı',
      content:
        'Komanda qurmaq üçün Team Finder bölməsindən istifadə edin. Skill-ləri qeyd etməyi unutmayın.',
      category: 1,
      status: 'approved',
      createdAt: nowIso(),
      createdByUserId: adminId,
    },
  ]

  const events: EventItem[] = [
    {
      id: makeId('evt'),
      title: 'Frontend Workshop',
      location: 'A zalı',
      startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'React + TypeScript üzrə praktiki sessiya.',
      createdAt: nowIso(),
      createdByUserId: teacherId,
    },
  ]

  writeJson(storageKeys.users, users)
  writeJson(storageKeys.announcements, announcements)
  writeJson(storageKeys.events, events)
  writeJson(storageKeys.lostFound, [] as LostFoundPost[])
  writeJson(storageKeys.teamPosts, [] as TeamPost[])
}

export function runSeedOnceInBrowser() {
  if (typeof window === 'undefined') return
  seedIfEmpty()
}
