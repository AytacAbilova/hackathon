type HeaderProps = {
  title: string
  userName: string
  userRole: string | null
  onLogoClick: () => void
  onLogout?: () => void
}

export default function Header(props: HeaderProps) {
  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={props.onLogoClick}>
        <span className="brandMark">A</span>
        <span className="brandText">Academy Hub</span>
      </button>

      <div className="topbarTitle">{props.title}</div>

      <div className="topbarRight">
        {props.userRole ? <span className="pill pillInfo">{props.userRole}</span> : null}
        {props.onLogout ? (
          <button type="button" className="btn btnSecondary" onClick={props.onLogout}>
            Çıxış
          </button>
        ) : null}
      </div>
    </header>
  )
}
