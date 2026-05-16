import type { Role, User } from '../../types/models'

type NavItem = { to: string; label: string; icon: string; enabled?: boolean }

export default function StudentSidebar(props: {
  user: User
  route: string
  onNavigate: (to: string) => void
  onLogout: () => void
}) {
  const items: NavItem[] = [
    { to: '/student', label: 'Dashboard', icon: 'grid' },
    { to: '/student/schedule', label: 'Schedule', icon: 'calendar', enabled: false },
    { to: '/student/announcements', label: 'Announcements', icon: 'megaphone', enabled: false },
    { to: '/student/events', label: 'Events', icon: 'spark', enabled: false },
    { to: '/student/vacancies', label: 'Vacancies', icon: 'briefcase', enabled: false },
    { to: '/student/team-finder', label: 'Team Finder', icon: 'users' },
    { to: '/student/lost-found', label: 'Lost & Found', icon: 'search' },
  ]

  const initials = props.user.fullName.trim().slice(0, 1).toUpperCase()
  const roleText: Record<Role, string> = { admin: 'Admin', teacher: 'Müəllim', student: 'Tələbə' }

  return (
    <aside className="studentSidebar" aria-label="Student navigation">
      <div className="studentBrand" role="button" tabIndex={0} onClick={() => props.onNavigate('/student')}>
        <span className="studentBrandIcon">A</span>
        <div className="studentBrandText">
          <div className="studentBrandName">Academy Hub</div>
          <div className="studentBrandTag">The sophisticated guide</div>
        </div>
      </div>

      <nav className="studentNav">
        {items.map((it) => {
          const active = props.route === it.to
          const disabled = it.enabled === false
          const cls = disabled
            ? 'studentNavItem studentNavItemDisabled'
            : active
              ? 'studentNavItem studentNavItemActive'
              : 'studentNavItem'
          return (
            <button
              key={it.to}
              type="button"
              className={cls}
              onClick={() => {
                if (disabled) return
                props.onNavigate(it.to)
              }}
              disabled={disabled}
            >
              <span className={`studentNavIcon studentNavIcon_${it.icon}`} aria-hidden="true" />
              <span className="studentNavLabel">{it.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="studentSidebarBottom">
        <div className="studentProfile">
          <div className="studentAvatar">{initials}</div>
          <div className="studentProfileMeta">
            <div className="studentProfileName">{props.user.fullName}</div>
            <div className="studentProfileRole">{roleText[props.user.role]}</div>
          </div>
        </div>
        <button type="button" className="studentLogout" onClick={props.onLogout}>
          Çıxış
        </button>
      </div>
    </aside>
  )
}
