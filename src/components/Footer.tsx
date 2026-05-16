export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerBrand">
          <div className="footerLogo">
            <span className="brandMark">A</span>
            <span className="brandText">Academy Hub</span>
          </div>
          <div className="footerDesc">
            Vahid platforma: dərs cədvəli, elanlar, eventlər, vakansiyalar, komanda qurmaq və lost &amp;
            found.
          </div>
        </div>

        <div className="footerCols">
          <div className="footerCol">
            <div className="footerColTitle">Platforma</div>
            <a className="footerLink" href="#/login">
              Login
            </a>
            <a className="footerLink" href="#/register">
              Qeydiyyat
            </a>
          </div>

          <div className="footerCol">
            <div className="footerColTitle">Bölmələr</div>
            <a className="footerLink" href="#/login">
              Elanlar
            </a>
            <a className="footerLink" href="#/login">
              Eventlər
            </a>
            <a className="footerLink" href="#/login">
              Team Finder
            </a>
            <a className="footerLink" href="#/login">
              Lost &amp; Found
            </a>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <div className="footerBottomInner">
          <span className="muted">© {new Date().getFullYear()} Academy Hub</span>
          <span className="muted">Education · Community · Events</span>
        </div>
      </div>
    </footer>
  )
}
