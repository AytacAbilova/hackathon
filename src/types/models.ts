export type Role = 'admin' | 'teacher' | 'student'

export type User = {
  id: string
  fullName: string
  email: string
  password: string
  role: Role
  createdAt: string
}

export type AnnouncementStatus = 'pending' | 'approved'

export type Announcement = {
  id: string
  title: string
  content: string
  status: AnnouncementStatus
  createdAt: string
  createdByUserId: string
}

export type EventItem = {
  id: string
  title: string
  location: string
  startsAt: string
  description: string
  createdAt: string
  createdByUserId: string
}

export type LostFoundType = 'lost' | 'found'

export type LostFoundPost = {
  id: string
  type: LostFoundType
  itemTitle: string
  location: string
  description: string
  contact: string
  createdAt: string
  createdByUserId: string
}

export type TeamPost = {
  id: string
  title: string
  description: string
  skills: string[]
  contact: string
  createdAt: string
  createdByUserId: string
}

export type Stats = {
  usersTotal: number
  usersByRole: Record<Role, number>
  announcementsPending: number
  announcementsApproved: number
  eventsTotal: number
  lostFoundTotal: number
  teamPostsTotal: number
}