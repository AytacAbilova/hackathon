import type { User } from '../../types/models'

type NavItem = { to: string; label: string; icon: string }

export default function AdminSidebar(props: {
  user: User
  route: string
  onNavigate: (to: string) => void
  onLogout: () => void
}) {
  const items: NavItem[] = [
    { to: '/admin', label: 'İdarə Paneli', icon: 'grid' },
    { to: '/admin/users', label: 'İstifadəçi Siyahısı', icon: 'users' },
    { to: '/admin/announcements', label: 'Elanlar', icon: 'megaphone' },
    { to: '/admin/stats', label: 'Analitika', icon: 'chart' },
    { to: '/admin/chatbot', label: 'Chatbot', icon: 'spark' },
  ]

  const initials = props.user.fullName.trim().slice(0, 1).toUpperCase()

  return (
    <aside className="adminSidebar" aria-label="Admin naviqasiyası">
      <div className="adminBrand" role="button" tabIndex={0} onClick={() => props.onNavigate('/admin')}>
        <span className="adminBrandIcon">C</span>
        <div className="adminBrandText">
          <div className="adminBrandName">CampusConnect</div>
          <div className="adminBrandTag">Akademiya Mərkəzi</div>
        </div>
      </div>

      <nav className="adminNav">
        {items.map((it) => {
          const active = props.route === it.to
          const cls = active ? 'adminNavItem adminNavItemActive' : 'adminNavItem'
          return (
            <button
              key={it.to}
              type="button"
              className={cls}
              onClick={() => props.onNavigate(it.to)}
            >
              <span className={`adminNavIcon adminNavIcon_${it.icon}`} aria-hidden="true" />
              <span className="adminNavLabel">{it.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="adminSidebarBottom">
        <button type="button" className="adminQuickAction" onClick={() => props.onNavigate('/admin/announcements')}>
          + Sürətli Əməliyyat
        </button>

        <div className="adminProfile">
          <div className="adminAvatar">{initials}</div>
          <div className="adminProfileMeta">
            <div className="adminProfileName">{props.user.fullName}</div>
            <div className="adminProfileRole">Platform Administratoru</div>
          </div>
        </div>

        <button type="button" className="adminLogout" onClick={props.onLogout}>
          Çıxış
        </button>
      </div>
    </aside>
  )
}
