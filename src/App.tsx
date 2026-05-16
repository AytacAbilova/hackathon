import { useEffect, useMemo, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/public/LandingPage'
import LoginView from './pages/auth/LoginView'
import RegisterView from './pages/auth/RegisterView'
import AdminHome from './pages/admin/AdminHome'
import AdminUsers from './pages/admin/AdminUsers'
import AdminStats from "./pages/admin/AdminStats"
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import TeacherHome from './pages/teacher/TeacherHome'
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements'
import TeacherEvents from './pages/teacher/TeacherEvents'
import StudentHome from './pages/student/StudentHome'
import StudentLostFound from './pages/student/StudentLostFound'
import StudentTeamFinder from './pages/student/StudentTeamFinder'
import ChatbotPage from './pages/chatbot/ChatbotPage'
import AdminSidebar from './components/admin/AdminSidebar'
import AdminTopbar from './components/admin/AdminTopbar'
import StudentSidebar from './components/student/StudentSidebar'
import useHashRoute from './hooks/useHashRoute'
import { getApiErrorMessage, getStoredTokens } from './lib/api'
import { getSessionFromAccessToken } from './lib/jwt'
import * as authService from './services/auth'
import * as announcementsService from './services/announcements'
import * as lostFoundService from './services/lostFound'
import * as teamFinderService from './services/teamFinder'
import * as adminUsersService from './services/adminUsers'
import type {
  Announcement,
  AnnouncementCategory,
  EventItem,
  LostFoundPost,
  LostFoundStatus,
  Role,
  Stats,
  TeamPost,
  User,
} from './types/models'
import { storageKeys, readJson, writeJson } from './lib/storage'
import { runSeedOnceInBrowser } from './lib/seed'
import {
  canAccess,
  canCreateAnnouncement,
  getRoleHome,
  makeId,
  nowIso,
  roleLabel,
  sortByCreatedAtDesc,
} from './lib/utils'
import './App.css'

runSeedOnceInBrowser()

function App() {
  const { route, navigate } = useHashRoute()

  const [users, setUsers] = useState<User[]>(() => {
    const baseUsers = readJson<User[]>(storageKeys.users, [])
    const tokens = getStoredTokens()
    const session = tokens ? getSessionFromAccessToken(tokens.accessToken) : null
    if (!session) return baseUsers

    const exists = baseUsers.some((u) => u.id === session.userId)
    if (exists) return baseUsers

    const localUser: User = {
      id: session.userId,
      fullName: session.fullName || '—',
      email: session.email || '—',
      password: '',
      role: session.role,
      createdAt: nowIso(),
    }
    return [localUser, ...baseUsers]
  })
  const [approvedAnnouncements, setApprovedAnnouncements] = useState<Announcement[]>([])
  const [pendingAnnouncements, setPendingAnnouncements] = useState<Announcement[]>([])
  const [events, setEvents] = useState<EventItem[]>(() => readJson<EventItem[]>(storageKeys.events, []))
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundPost[]>([])
  const [teamFinderItems, setTeamFinderItems] = useState<TeamPost[]>([])
  const [adminUsersItems, setAdminUsersItems] = useState<User[]>([])

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const stored = localStorage.getItem(storageKeys.currentUserId)
    if (stored) return stored
    const tokens = getStoredTokens()
    const session = tokens ? getSessionFromAccessToken(tokens.accessToken) : null
    if (!session) return null
    localStorage.setItem(storageKeys.currentUserId, session.userId)
    return session.userId
  })

  const currentUser = useMemo(() => {
    if (!currentUserId) return null
    return users.find((u) => u.id === currentUserId) ?? null
  }, [currentUserId, users])

  useEffect(() => {
    writeJson(storageKeys.users, users)
  }, [users])

  useEffect(() => {
    writeJson(storageKeys.events, events)
  }, [events])

  useEffect(() => {
    if (!currentUser) {
      if (
        route.startsWith('/admin') ||
        route.startsWith('/teacher') ||
        route.startsWith('/student')
      ) {
        navigate('/login')
      }
      return
    }

    if (route === '/' || route === '/login' || route === '/register') {
      navigate(getRoleHome(currentUser.role))
      return
    }

    if (!canAccess(route, currentUser.role)) {
      navigate(getRoleHome(currentUser.role))
      return
    }

    if (currentUser.role === 'student') {
      const ok =
        route === '/student' ||
        route === '/student/lost-found' ||
        route === '/student/team-finder' ||
        route === '/student/chatbot'
      if (route.startsWith('/student') && !ok) {
        navigate('/student')
      }
    }
  }, [currentUser, navigate, route])

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem(storageKeys.currentUserId)
      setCurrentUserId(null)
      setApprovedAnnouncements([])
      setPendingAnnouncements([])
      setLostFoundItems([])
      setTeamFinderItems([])
      setAdminUsersItems([])
      toast.success('Çıxış edildi')
      navigate('/login')
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => {
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [navigate])

  const logout = () => {
    void authService.revoke()
  }

  useEffect(() => {
    if (currentUser?.role !== 'student') return
    let cancelled = false

    Promise.all([
      lostFoundService.list({ page: 1, pageSize: 50, status: 0 }),
      lostFoundService.list({ page: 1, pageSize: 50, status: 1 }),
      lostFoundService.list({ page: 1, pageSize: 50, status: 2 }),
    ])
      .then((res) => {
        if (cancelled) return
        const merged = [...res[0].items, ...res[1].items, ...res[2].items]
        setLostFoundItems(sortByCreatedAtDesc(merged))
      })
      .catch((e) => {
        if (cancelled) return
        toast.error(getApiErrorMessage(e))
      })

    return () => {
      cancelled = true
    }
  }, [currentUser?.role])

  const loadTeamFinder = async (skillSearch?: string) => {
    try {
      const res = await teamFinderService.list({ page: 1, pageSize: 50, ...(skillSearch ? { skillSearch } : {}) })
      setTeamFinderItems(sortByCreatedAtDesc(res.items))
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  useEffect(() => {
    if (!currentUser) return
    let cancelled = false

    teamFinderService
      .list({ page: 1, pageSize: 50 })
      .then((res) => {
        if (cancelled) return
        setTeamFinderItems(sortByCreatedAtDesc(res.items))
      })
      .catch((e) => {
        if (cancelled) return
        toast.error(getApiErrorMessage(e))
      })

    return () => {
      cancelled = true
    }
  }, [currentUser, currentUserId])

  const loadAdminUsers = async () => {
    if (currentUser?.role !== 'admin') return
    const res = await adminUsersService.list({ page: 1, limit: 100 })
    setAdminUsersItems(sortByCreatedAtDesc(res.items))
    setUsers(res.items)
  }

  useEffect(() => {
    if (currentUser?.role !== 'admin') return

    let cancelled = false
    adminUsersService
      .list({ page: 1, limit: 100 })
      .then((res) => {
        if (cancelled) return
        setAdminUsersItems(sortByCreatedAtDesc(res.items))
        setUsers(res.items)
      })
      .catch((e) => {
        if (cancelled) return
        toast.error(getApiErrorMessage(e))
      })

    return () => {
      cancelled = true
    }
  }, [currentUser?.role])

  const login = async (email: string, password: string) => {
    try {
      const auth = await authService.login({ email, password })
      const session = getSessionFromAccessToken(auth.accessToken)
      const userId = session?.userId ?? String(auth.userId)
      const role = session?.role ?? 'student'

      const exists = users.some((u) => u.id === userId)
      if (!exists) {
        const localUser: User = {
          id: userId,
          fullName: auth.fullName,
          email: auth.email,
          password: '',
          role,
          createdAt: nowIso(),
        }
        setUsers((prev) => [localUser, ...prev])
      }

      localStorage.setItem(storageKeys.currentUserId, userId)
      setCurrentUserId(userId)
      toast.success(`Xoş gəldin, ${auth.fullName}`)
      navigate(getRoleHome(role))
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const registerStudent = async (fullName: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    try {
      const auth = await authService.register({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
      })
      const session = getSessionFromAccessToken(auth.accessToken)
      const userId = session?.userId ?? String(auth.userId)
      const role = session?.role ?? 'student'

      const exists = users.some((u) => u.id === userId)
      if (!exists) {
        const localUser: User = {
          id: userId,
          fullName: auth.fullName,
          email: auth.email,
          password: '',
          role,
          createdAt: nowIso(),
        }
        setUsers((prev) => [localUser, ...prev])
      }

      localStorage.setItem(storageKeys.currentUserId, userId)
      setCurrentUserId(userId)
      toast.success('Qeydiyyat uğurla tamamlandı')
      navigate(getRoleHome(role))
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const loadApprovedAnnouncements = async (category?: AnnouncementCategory) => {
    try {
      const res = await announcementsService.listApproved({ page: 1, pageSize: 50, category })
      setApprovedAnnouncements(sortByCreatedAtDesc(res.items))
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const loadPendingAnnouncements = async () => {
    try {
      const res = await announcementsService.listPending({ page: 1, pageSize: 50 })
      setPendingAnnouncements(sortByCreatedAtDesc(res.items))
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  useEffect(() => {
    let cancelled = false

    announcementsService
      .listApproved({ page: 1, pageSize: 50 })
      .then((res) => {
        if (cancelled) return
        setApprovedAnnouncements(sortByCreatedAtDesc(res.items))
      })
      .catch((e) => {
        if (cancelled) return
        toast.error(getApiErrorMessage(e))
      })

    if (currentUser?.role === 'admin') {
      announcementsService
        .listPending({ page: 1, pageSize: 50 })
        .then((res) => {
          if (cancelled) return
          setPendingAnnouncements(sortByCreatedAtDesc(res.items))
        })
        .catch((e) => {
          if (cancelled) return
          toast.error(getApiErrorMessage(e))
        })
    }

    return () => {
      cancelled = true
    }
  }, [currentUser?.role])

  const createAnnouncement = async (
    title: string,
    content: string,
    category: AnnouncementCategory,
  ) => {
    if (!currentUser) return
    if (!canCreateAnnouncement(currentUser.role)) {
      toast.error('Elanı yalnız müəllim və admin yarada bilər')
      return
    }
    if (!title.trim() || !content.trim()) {
      toast.error('Başlıq və mətn mütləqdir')
      return
    }

    try {
      await announcementsService.create({
        title: title.trim(),
        content: content.trim(),
        category,
      })
      toast.success('Elan göndərildi')
      await loadApprovedAnnouncements()
      if (currentUser.role === 'admin') await loadPendingAnnouncements()
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const approveAnnouncement = async (id: string) => {
    if (currentUser?.role !== 'admin') return
    try {
      await announcementsService.approve(id)
      toast.success('Elan təsdiqləndi')
      await loadApprovedAnnouncements()
      await loadPendingAnnouncements()
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const deleteAnnouncement = async (id: string) => {
    if (currentUser?.role !== 'admin') return
    try {
      await announcementsService.remove(id)
      toast.success('Elan silindi')
      await loadApprovedAnnouncements()
      await loadPendingAnnouncements()
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const createEvent = (
    title: string,
    location: string,
    startsAt: string,
    description: string,
  ) => {
    if (!currentUser) return
    if (currentUser.role !== 'teacher') {
      toast.error('Tədbiri yalnız müəllim əlavə edə bilər')
      return
    }
    if (!title.trim() || !location.trim() || !startsAt) {
      toast.error('Başlıq, məkan və tarix mütləqdir')
      return
    }
    const newEvent: EventItem = {
      id: makeId('evt'),
      title: title.trim(),
      location: location.trim(),
      startsAt,
      description: description.trim(),
      createdAt: nowIso(),
      createdByUserId: currentUser.id,
    }
    setEvents((prev) => [newEvent, ...prev])
    toast.success('Tədbir əlavə olundu')
  }

  const createLostFound = (
    status: LostFoundStatus,
    title: string,
    location: string,
    description: string,
    contact: string,
    imageUrl: string,
  ) => {
    if (!currentUser) return
    if (currentUser.role !== 'student') {
      toast.error('İtirilən/tapılan yalnız tələbə üçün aktivdir')
      return
    }
    if (!title.trim() || !location.trim() || !contact.trim()) {
      toast.error('Əşya adı, yer və əlaqə məlumatı mütləqdir')
      return
    }
    void lostFoundService
      .create({
        title: title.trim(),
        description: `Yer: ${location.trim()}\n${description.trim()}`.trim(),
        contact: contact.trim(),
        imageUrl: imageUrl.trim(),
        status,
      })
      .then(() =>
        Promise.all([
          lostFoundService.list({ page: 1, pageSize: 50, status: 0 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 1 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 2 }),
        ]),
      )
      .then((res) => {
        const merged = [...res[0].items, ...res[1].items, ...res[2].items]
        setLostFoundItems(sortByCreatedAtDesc(merged))
        toast.success('Paylaşım əlavə olundu')
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
  }

  const updateLostFound = (
    id: string,
    title: string,
    location: string,
    description: string,
    contact: string,
    imageUrl: string,
  ) => {
    if (!currentUser) return
    void lostFoundService
      .update(id, {
        title: title.trim(),
        description: `Yer: ${location.trim()}\n${description.trim()}`.trim(),
        contact: contact.trim(),
        imageUrl: imageUrl.trim(),
      })
      .then(() =>
        Promise.all([
          lostFoundService.list({ page: 1, pageSize: 50, status: 0 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 1 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 2 }),
        ]),
      )
      .then((res) => {
        const merged = [...res[0].items, ...res[1].items, ...res[2].items]
        setLostFoundItems(sortByCreatedAtDesc(merged))
        toast.success('Yeniləndi')
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
  }

  const changeLostFoundStatus = (id: string, status: LostFoundStatus) => {
    if (!currentUser) return
    void lostFoundService
      .setStatus(id, status)
      .then(() =>
        Promise.all([
          lostFoundService.list({ page: 1, pageSize: 50, status: 0 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 1 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 2 }),
        ]),
      )
      .then((res) => {
        const merged = [...res[0].items, ...res[1].items, ...res[2].items]
        setLostFoundItems(sortByCreatedAtDesc(merged))
        toast.success('Status yeniləndi')
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
  }

  const deleteLostFound = (id: string) => {
    if (!currentUser) return
    void lostFoundService
      .remove(id)
      .then(() =>
        Promise.all([
          lostFoundService.list({ page: 1, pageSize: 50, status: 0 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 1 }),
          lostFoundService.list({ page: 1, pageSize: 50, status: 2 }),
        ]),
      )
      .then((res) => {
        const merged = [...res[0].items, ...res[1].items, ...res[2].items]
        setLostFoundItems(sortByCreatedAtDesc(merged))
        toast.success('Silindi')
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
  }

  const createTeamPost = (
    title: string,
    description: string,
    skillsRaw: string,
    contact: string,
  ) => {
    if (!currentUser) return
    if (currentUser.role !== 'student') {
      toast.error('Komanda tapıcı yalnız tələbə üçün aktivdir')
      return
    }
    const skills = skillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (!title.trim() || !description.trim()) {
      toast.error('Başlıq və təsvir mütləqdir')
      return
    }
    if (skills.length === 0) {
      toast.error('Komanda elanında ən az 1 bacarıq qeyd olunmalıdır')
      return
    }
    if (!contact.trim()) {
      toast.error('Əlaqə məlumatı mütləqdir')
      return
    }
    void teamFinderService
      .create({
        title: title.trim(),
        skillsNeeded: skills.join(', '),
        description: `${description.trim()}\nƏlaqə: ${contact.trim()}`.trim(),
      })
      .then(async () => {
        toast.success('Komanda elanı əlavə olundu')
        await loadTeamFinder()
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
  }

  const updateTeamPost = (id: string, title: string, description: string, skillsRaw: string, contact: string) => {
    if (!currentUser) return
    const skills = skillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (!title.trim() || !description.trim() || skills.length === 0 || !contact.trim()) {
      toast.error('Bütün sahələr mütləqdir')
      return
    }
    void teamFinderService
      .update(id, {
        title: title.trim(),
        skillsNeeded: skills.join(', '),
        description: `${description.trim()}\nƏlaqə: ${contact.trim()}`.trim(),
      })
      .then(async () => {
        toast.success('Yeniləndi')
        await loadTeamFinder()
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
  }

  const deleteTeamPost = (id: string) => {
    if (!currentUser) return
    void teamFinderService
      .remove(id)
      .then(async () => {
        toast.success('Silindi')
        await loadTeamFinder()
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
  }

  const eventsSorted = useMemo(() => sortByCreatedAtDesc(events), [events])
  const lostFoundSorted = useMemo(() => sortByCreatedAtDesc(lostFoundItems), [lostFoundItems])
  const teamPostsSorted = useMemo(() => sortByCreatedAtDesc(teamFinderItems), [teamFinderItems])

  const stats = useMemo(() => {
    const byRole = users.reduce(
      (acc, u) => {
        acc[u.role] += 1
        return acc
      },
      { admin: 0, teacher: 0, student: 0 } as Record<Role, number>,
    )
    const s: Stats = {
      usersTotal: users.length,
      usersByRole: byRole,
      announcementsPending: pendingAnnouncements.length,
      announcementsApproved: approvedAnnouncements.length,
      eventsTotal: events.length,
      lostFoundTotal: lostFoundItems.length,
      teamPostsTotal: teamFinderItems.length,
    }
    return s
  }, [
    approvedAnnouncements.length,
    events.length,
    lostFoundItems.length,
    pendingAnnouncements.length,
    teamFinderItems.length,
    users,
  ])

  const sidebarItems = useMemo(() => {
    if (!currentUser) return []
    if (currentUser.role === 'admin') {
      return [
        { to: '/admin', label: 'İdarə paneli' },
        { to: '/admin/users', label: 'İstifadəçi siyahısı' },
        { to: '/admin/announcements', label: 'Elanlar' },
        { to: '/admin/stats', label: 'Statistika' },
      ]
    }
    if (currentUser.role === 'teacher') {
      return [
        { to: '/teacher', label: 'İdarə paneli' },
        { to: '/teacher/announcements', label: 'Elan yarat' },
        { to: '/teacher/events', label: 'Tədbir əlavə et' },
        { to: '/teacher/chatbot', label: 'Chatbot' },
      ]
    }
    return [
      { to: '/student', label: 'İdarə paneli' },
      { to: '/student/lost-found', label: 'İtirilən və tapılan' },
      { to: '/student/team-finder', label: 'Komanda tapıcı' },
      { to: '/student/chatbot', label: 'Chatbot' },
    ]
  }, [currentUser])

  const title = useMemo(() => {
    if (route === '/') return 'Əsas səhifə'
    if (route.startsWith('/admin/users')) return 'İstifadəçi siyahısı'
    if (route.startsWith('/admin/announcements')) return 'Elanlar'
    if (route.startsWith('/admin/stats')) return 'Analitika'
    if (route.startsWith('/admin/chatbot')) return 'Chatbot'
    if (route.startsWith('/admin')) return 'Admin konsolu'
    if (route.startsWith('/teacher/announcements')) return 'Elan yaratma'
    if (route.startsWith('/teacher/events')) return 'Tədbir əlavə etmə'
    if (route.startsWith('/teacher/chatbot')) return 'Chatbot'
    if (route.startsWith('/teacher')) return 'Müəllim idarə paneli'
    if (route.startsWith('/student/lost-found')) return 'İtirilən və tapılan'
    if (route.startsWith('/student/team-finder')) return 'Komanda tapıcı'
    if (route.startsWith('/student/chatbot')) return 'Chatbot'
    if (route.startsWith('/student')) return 'Tələbə idarə paneli'
    if (route === '/register') return 'Qeydiyyat'
    if (route === '/login') return 'Daxil ol'
    return 'Daxil ol'
  }, [route])

  const userName = currentUser?.fullName ?? 'Qonaq'
  const userRole = currentUser?.role ?? null
  const userRoleText = userRole ? roleLabel(userRole) : null

  const adminCreateUser = async (data: {
    fullName: string
    email: string
    password: string
    role: Role
  }) => {
    if (currentUser?.role !== 'admin') return
    const normalizedEmail = data.email.trim().toLowerCase()
    if (!data.fullName.trim() || !normalizedEmail || !data.password) {
      toast.error('Bütün sahələr doldurulmalıdır')
      return
    }

    try {
      await adminUsersService.create({
        fullName: data.fullName.trim(),
        email: normalizedEmail,
        password: data.password,
        role: data.role,
      })
      toast.success('İstifadəçi yaradıldı')
      await loadAdminUsers()
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const adminUpdateUser = async (
    id: string,
    patch: { fullName: string; email: string; password?: string; role: Role },
  ) => {
    if (currentUser?.role !== 'admin') return
    const normalizedEmail = patch.email.trim().toLowerCase()
    if (!patch.fullName.trim() || !normalizedEmail) {
      toast.error('Ad və email mütləqdir')
      return
    }

    try {
      await adminUsersService.update(id, {
        fullName: patch.fullName.trim(),
        email: normalizedEmail,
        role: patch.role,
      })
      toast.success('İstifadəçi yeniləndi')
      await loadAdminUsers()
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const adminDeleteUser = async (id: string) => {
    if (currentUser?.role !== 'admin') return
    if (id === currentUserId) {
      toast.error('Öz hesabını silə bilməzsən')
      return
    }
    try {
      await adminUsersService.remove(id)
      toast.success('İstifadəçi silindi')
      await loadAdminUsers()
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  return (
    <>
      <div
        className={
          currentUser?.role === 'student'
            ? 'appShell studentShell'
            : currentUser?.role === 'admin'
              ? 'appShell adminShell'
              : 'appShell'
        }
      >
        {currentUser?.role !== 'student' && currentUser?.role !== 'admin' ? (
          <Header
            title={title}
            userName={userName}
            userRole={userRoleText}
            onLogoClick={() => {
              if (!currentUser) navigate('/')
              else navigate(getRoleHome(currentUser.role))
            }}
            onLogout={currentUser ? logout : undefined}
          />
        ) : null}

        <div className={currentUser ? 'appBody' : 'appBody appBodyPublic'}>
          {currentUser && currentUser.role !== 'student' && currentUser.role !== 'admin' ? (
            <aside className="sidebar" aria-label="Naviqasiya">
              <div className="sidebarSection">
                <div className="sidebarRole">
                  <div className="avatar">{userName.trim().slice(0, 1).toUpperCase()}</div>
                  <div className="sidebarRoleMeta">
                    <div className="sidebarName">{userName}</div>
                    <div className="sidebarBadge">{userRoleText}</div>
                  </div>
                </div>
              </div>

              <nav className="sidebarNav">
                {sidebarItems.map((item) => (
                  <a
                    key={item.to}
                    className={route === item.to ? 'navItem navItemActive' : 'navItem'}
                    href={`#${item.to}`}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.to)
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>
          ) : null}

          {currentUser?.role === 'admin' ? (
            <AdminSidebar user={currentUser} route={route} onNavigate={navigate} onLogout={logout} />
          ) : null}

          {currentUser?.role === 'student' ? (
            <StudentSidebar user={currentUser} route={route} onNavigate={navigate} onLogout={logout} />
          ) : null}

          <main className="content">
            {currentUser?.role === 'admin' ? (
              <AdminTopbar
                title={title}
                subtitle="Akademiyanın fəaliyyətinə və sistem sağlamlığına ümumi baxış."
                placeholder="İstifadəçi axtar..."
              />
            ) : null}

            {!currentUser && route === '/' ? <LandingPage /> : null}

            {!currentUser && route !== '/register' && route !== '/' ? (
              <LoginView onLogin={login} onGoRegister={() => navigate('/register')} />
            ) : null}

            {!currentUser && route === '/register' ? (
              <RegisterView
                onRegister={registerStudent}
                onGoLogin={() => navigate('/login')}
              />
            ) : null}

            {currentUser?.role === 'admin' && route === '/admin' ? (
              <AdminHome
                stats={stats}
                pendingCount={pendingAnnouncements.length}
                onGoUsers={() => navigate('/admin/users')}
                onGoAnnouncements={() => navigate('/admin/announcements')}
                onGoStats={() => navigate('/admin/stats')}
              />
            ) : null}

            {currentUser?.role === 'admin' && route === '/admin/users' ? (
              <AdminUsers
                users={adminUsersItems}
                onCreate={adminCreateUser}
                onUpdate={adminUpdateUser}
                onDelete={adminDeleteUser}
              />
            ) : null}

            {currentUser?.role === 'admin' && route === '/admin/announcements' ? (
              <AdminAnnouncements
                pending={pendingAnnouncements}
                approved={approvedAnnouncements}
                users={users}
                onApprove={approveAnnouncement}
                onDelete={deleteAnnouncement}
                onCreate={createAnnouncement}
              />
            ) : null}

            {currentUser?.role === 'admin' && route === '/admin/stats' ? (
              <AdminStats stats={stats} />
            ) : null}

            {currentUser?.role === 'admin' && route === '/admin/chatbot' ? (
              <ChatbotPage variant="admin" />
            ) : null}

            {currentUser?.role === 'teacher' && route === '/teacher' ? (
              <TeacherHome
                approvedAnnouncements={approvedAnnouncements.slice(0, 5)}
                events={eventsSorted.slice(0, 5)}
              />
            ) : null}

            {currentUser?.role === 'teacher' && route === '/teacher/announcements' ? (
              <TeacherAnnouncements onCreate={createAnnouncement} />
            ) : null}

            {currentUser?.role === 'teacher' && route === '/teacher/events' ? (
              <TeacherEvents onCreate={createEvent} />
            ) : null}

            {currentUser?.role === 'teacher' && route === '/teacher/chatbot' ? (
              <ChatbotPage variant="teacher" />
            ) : null}

            {currentUser?.role === 'student' && route === '/student' ? (
              <StudentHome
                announcements={approvedAnnouncements.slice(0, 6)}
                events={eventsSorted.slice(0, 6)}
                lostFound={lostFoundSorted.slice(0, 4)}
                teamPosts={teamPostsSorted.slice(0, 4)}
                onGoLostFound={() => navigate('/student/lost-found')}
                onGoTeamFinder={() => navigate('/student/team-finder')}
              />
            ) : null}

            {currentUser?.role === 'student' && route === '/student/lost-found' ? (
              <StudentLostFound
                posts={lostFoundSorted}
                users={users}
                currentUserId={currentUser.id}
                onCreate={createLostFound}
                onUpdate={updateLostFound}
                onSetStatus={changeLostFoundStatus}
                onDelete={deleteLostFound}
              />
            ) : null}

            {currentUser?.role === 'student' && route === '/student/team-finder' ? (
              <StudentTeamFinder
                posts={teamPostsSorted}
                users={users}
                onCreate={createTeamPost}
                onUpdate={updateTeamPost}
                onDelete={deleteTeamPost}
                currentUserId={currentUser.id}
                onSearch={(q) => loadTeamFinder(q)}
              />
            ) : null}

            {currentUser?.role === 'student' && route === '/student/chatbot' ? (
              <ChatbotPage variant="student" />
            ) : null}

            {currentUser && route === '/login' ? null : null}
          </main>
        </div>

        {currentUser?.role !== 'student' && currentUser?.role !== 'admin' ? <Footer /> : null}
      </div>

      <ToastContainer position="bottom-right" autoClose={2500} theme="colored" />
    </>
  )
}

export default App
