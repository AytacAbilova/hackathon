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
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminStats from './pages/admin/AdminStats'
import TeacherHome from './pages/teacher/TeacherHome'
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements'
import TeacherEvents from './pages/teacher/TeacherEvents'
import StudentHome from './pages/student/StudentHome'
import StudentLostFound from './pages/student/StudentLostFound'
import StudentTeamFinder from './pages/student/StudentTeamFinder'
import useHashRoute from './hooks/useHashRoute'
import type {
  Announcement,
  EventItem,
  LostFoundPost,
  LostFoundType,
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

  const [users, setUsers] = useState<User[]>(() => readJson<User[]>(storageKeys.users, []))
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    readJson<Announcement[]>(storageKeys.announcements, []),
  )
  const [events, setEvents] = useState<EventItem[]>(() => readJson<EventItem[]>(storageKeys.events, []))
  const [lostFound, setLostFound] = useState<LostFoundPost[]>(() =>
    readJson<LostFoundPost[]>(storageKeys.lostFound, []),
  )
  const [teamPosts, setTeamPosts] = useState<TeamPost[]>(() => readJson<TeamPost[]>(storageKeys.teamPosts, []))

  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    localStorage.getItem(storageKeys.currentUserId),
  )

  const currentUser = useMemo(() => {
    if (!currentUserId) return null
    return users.find((u) => u.id === currentUserId) ?? null
  }, [currentUserId, users])

  useEffect(() => {
    writeJson(storageKeys.users, users)
  }, [users])

  useEffect(() => {
    writeJson(storageKeys.announcements, announcements)
  }, [announcements])

  useEffect(() => {
    writeJson(storageKeys.events, events)
  }, [events])

  useEffect(() => {
    writeJson(storageKeys.lostFound, lostFound)
  }, [lostFound])

  useEffect(() => {
    writeJson(storageKeys.teamPosts, teamPosts)
  }, [teamPosts])

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
    }
  }, [currentUser, navigate, route])

  const logout = () => {
    localStorage.removeItem(storageKeys.currentUserId)
    setCurrentUserId(null)
    toast.success('Çıxış edildi')
    navigate('/login')
  }

  const login = (email: string, password: string) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )
    if (!found) {
      toast.error('Email və ya şifrə yanlışdır')
      return
    }
    localStorage.setItem(storageKeys.currentUserId, found.id)
    setCurrentUserId(found.id)
    toast.success(`Xoş gəldin, ${found.fullName}`)
    navigate(getRoleHome(found.role))
  }

  const registerStudent = (fullName: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!fullName.trim() || !normalizedEmail || !password) {
      toast.error('Bütün sahələr doldurulmalıdır')
      return
    }
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail)
    if (exists) {
      toast.error('Bu email artıq qeydiyyatdan keçib')
      return
    }
    const newUser: User = {
      id: makeId('usr'),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role: 'student',
      createdAt: nowIso(),
    }
    setUsers((prev) => [newUser, ...prev])
    localStorage.setItem(storageKeys.currentUserId, newUser.id)
    setCurrentUserId(newUser.id)
    toast.success('Qeydiyyat uğurla tamamlandı')
    navigate(getRoleHome(newUser.role))
  }

  const createAnnouncement = (title: string, content: string) => {
    if (!currentUser) return
    if (!canCreateAnnouncement(currentUser.role)) {
      toast.error('Elanı yalnız müəllim və admin yarada bilər')
      return
    }
    if (!title.trim() || !content.trim()) {
      toast.error('Başlıq və mətn mütləqdir')
      return
    }
    const newAnn: Announcement = {
      id: makeId('ann'),
      title: title.trim(),
      content: content.trim(),
      status: currentUser.role === 'admin' ? 'approved' : 'pending',
      createdAt: nowIso(),
      createdByUserId: currentUser.id,
    }
    setAnnouncements((prev) => [newAnn, ...prev])
    toast.success(
      newAnn.status === 'approved' ? 'Elan dərc olundu' : 'Elan təsdiqə göndərildi',
    )
  }

  const approveAnnouncement = (id: string) => {
    if (currentUser?.role !== 'admin') return
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)),
    )
    toast.success('Elan təsdiqləndi')
  }

  const deleteAnnouncement = (id: string) => {
    if (currentUser?.role !== 'admin') return
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    toast.success('Elan silindi')
  }

  const createEvent = (
    title: string,
    location: string,
    startsAt: string,
    description: string,
  ) => {
    if (!currentUser) return
    if (currentUser.role !== 'teacher') {
      toast.error('Event yalnız müəllim tərəfindən əlavə edilə bilər')
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
    toast.success('Event əlavə olundu')
  }

  const createLostFound = (
    type: LostFoundType,
    itemTitle: string,
    location: string,
    description: string,
    contact: string,
  ) => {
    if (!currentUser) return
    if (currentUser.role !== 'student') {
      toast.error('Lost & Found yalnız tələbə üçün aktivdir')
      return
    }
    if (!itemTitle.trim() || !location.trim() || !contact.trim()) {
      toast.error('Əşya adı, yer və əlaqə məlumatı mütləqdir')
      return
    }
    const post: LostFoundPost = {
      id: makeId('lf'),
      type,
      itemTitle: itemTitle.trim(),
      location: location.trim(),
      description: description.trim(),
      contact: contact.trim(),
      createdAt: nowIso(),
      createdByUserId: currentUser.id,
    }
    setLostFound((prev) => [post, ...prev])
    toast.success('Paylaşım əlavə olundu')
  }

  const createTeamPost = (
    title: string,
    description: string,
    skillsRaw: string,
    contact: string,
  ) => {
    if (!currentUser) return
    if (currentUser.role !== 'student') {
      toast.error('Team Finder yalnız tələbə üçün aktivdir')
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
      toast.error('Komanda elanında ən az 1 skill qeyd olunmalıdır')
      return
    }
    if (!contact.trim()) {
      toast.error('Əlaqə məlumatı mütləqdir')
      return
    }

    const post: TeamPost = {
      id: makeId('team'),
      title: title.trim(),
      description: description.trim(),
      skills,
      contact: contact.trim(),
      createdAt: nowIso(),
      createdByUserId: currentUser.id,
    }
    setTeamPosts((prev) => [post, ...prev])
    toast.success('Komanda elanı əlavə olundu')
  }

  const approvedAnnouncements = useMemo(() => {
    return sortByCreatedAtDesc(announcements.filter((a) => a.status === 'approved'))
  }, [announcements])

  const pendingAnnouncements = useMemo(() => {
    return sortByCreatedAtDesc(announcements.filter((a) => a.status === 'pending'))
  }, [announcements])

  const eventsSorted = useMemo(() => sortByCreatedAtDesc(events), [events])
  const lostFoundSorted = useMemo(() => sortByCreatedAtDesc(lostFound), [lostFound])
  const teamPostsSorted = useMemo(() => sortByCreatedAtDesc(teamPosts), [teamPosts])

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
      lostFoundTotal: lostFound.length,
      teamPostsTotal: teamPosts.length,
    }
    return s
  }, [
    approvedAnnouncements.length,
    events.length,
    lostFound.length,
    pendingAnnouncements.length,
    teamPosts.length,
    users,
  ])

  const sidebarItems = useMemo(() => {
    if (!currentUser) return []
    if (currentUser.role === 'admin') {
      return [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/users', label: 'User list' },
        { to: '/admin/announcements', label: 'Elanlar' },
        { to: '/admin/stats', label: 'Statistika' },
      ]
    }
    if (currentUser.role === 'teacher') {
      return [
        { to: '/teacher', label: 'Dashboard' },
        { to: '/teacher/announcements', label: 'Elan yarat' },
        { to: '/teacher/events', label: 'Event əlavə et' },
      ]
    }
    return [
      { to: '/student', label: 'Dashboard' },
      { to: '/student/lost-found', label: 'Lost & Found' },
      { to: '/student/team-finder', label: 'Team Finder' },
    ]
  }, [currentUser])

  const title = useMemo(() => {
    if (route === '/') return 'Home'
    if (route.startsWith('/admin/users')) return 'User list'
    if (route.startsWith('/admin/announcements')) return 'Elanlar'
    if (route.startsWith('/admin/stats')) return 'Statistik dashboard'
    if (route.startsWith('/admin')) return 'Admin dashboard'
    if (route.startsWith('/teacher/announcements')) return 'Elan yaratma'
    if (route.startsWith('/teacher/events')) return 'Event əlavə etmə'
    if (route.startsWith('/teacher')) return 'Müəllim dashboard'
    if (route.startsWith('/student/lost-found')) return 'Lost & Found'
    if (route.startsWith('/student/team-finder')) return 'Team Finder'
    if (route.startsWith('/student')) return 'Tələbə dashboard'
    if (route === '/register') return 'Qeydiyyat'
    if (route === '/login') return 'Login'
    return 'Login'
  }, [route])

  const userName = currentUser?.fullName ?? 'Qonaq'
  const userRole = currentUser?.role ?? null
  const userRoleText = userRole ? roleLabel(userRole) : null

  const adminCreateUser = (data: {
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
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail)
    if (exists) {
      toast.error('Bu email artıq mövcuddur')
      return
    }
    const newUser: User = {
      id: makeId('usr'),
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      password: data.password,
      role: data.role,
      createdAt: nowIso(),
    }
    setUsers((prev) => [newUser, ...prev])
    toast.success('User yaradıldı')
  }

  const adminUpdateUser = (
    id: string,
    patch: { fullName: string; email: string; password?: string; role: Role },
  ) => {
    if (currentUser?.role !== 'admin') return
    const normalizedEmail = patch.email.trim().toLowerCase()
    if (!patch.fullName.trim() || !normalizedEmail) {
      toast.error('Ad və email mütləqdir')
      return
    }
    const exists = users.some(
      (u) => u.id !== id && u.email.toLowerCase() === normalizedEmail,
    )
    if (exists) {
      toast.error('Bu email artıq mövcuddur')
      return
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              fullName: patch.fullName.trim(),
              email: normalizedEmail,
              role: patch.role,
              ...(patch.password ? { password: patch.password } : {}),
            }
          : u,
      ),
    )
    toast.success('User yeniləndi')
  }

  const adminDeleteUser = (id: string) => {
    if (currentUser?.role !== 'admin') return
    if (id === currentUserId) {
      toast.error('Öz hesabını silə bilməzsən')
      return
    }
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success('User silindi')
  }

  return (
    <>
      <div className="appShell">
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

        <div className={currentUser ? 'appBody' : 'appBody appBodyPublic'}>
          {currentUser ? (
            <aside className="sidebar" aria-label="Navigation">
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

          <main className="content">
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
                users={sortByCreatedAtDesc(users)}
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
                onCreate={createLostFound}
              />
            ) : null}

            {currentUser?.role === 'student' && route === '/student/team-finder' ? (
              <StudentTeamFinder
                posts={teamPostsSorted}
                users={users}
                onCreate={createTeamPost}
              />
            ) : null}

            {currentUser && route === '/login' ? null : null}
          </main>
        </div>

        <Footer />
      </div>

      <ToastContainer position="bottom-right" autoClose={2500} theme="colored" />
    </>
  )
}

export default App
