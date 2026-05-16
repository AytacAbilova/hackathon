type HeaderProps = {
  title: string
  userName: string
  userRole: string | null
  onLogoClick: () => void
  onLogout?: () => void
}

export default function Header(props: HeaderProps) {
  const isAuthed = Boolean(props.onLogout)
  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={props.onLogoClick}>
        <span className="brandMark">A</span>
        <span className="brandText">Academy Hub</span>
      </button>

      <div className="topbarTitle">{props.title}</div>

      <div className="topbarRight">
        {!isAuthed ? (
          <nav className="topNav" aria-label="Primary">
            <a className="topNavLink" href="#/">
              Home
            </a>
            <a className="topNavLink" href="#/login">
              Login
            </a>
            <a className="topNavCta" href="#/register">
              Qeydiyyat
            </a>
          </nav>
        ) : (
          <>
            {props.userRole ? <span className="pill pillInfo">{props.userRole}</span> : null}
            <button type="button" className="btn btnSecondary" onClick={props.onLogout}>
              Çıxış
            </button>
          </>
        )}
      </div>
    </header>
  )
}
