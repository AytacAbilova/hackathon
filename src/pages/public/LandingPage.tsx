import heroImg from '../../assets/hero.png'

export default function LandingPage() {
  const courses = [
    { title: 'Frontend (React)', meta: '12 dərs · Praktika', level: 'Beginner' },
    { title: 'Backend (Node.js)', meta: '10 dərs · API', level: 'Intermediate' },
    { title: 'UI/UX Design', meta: '8 dərs · Figma', level: 'Beginner' },
    { title: 'Data Basics', meta: '6 dərs · Analitika', level: 'Starter' },
  ]

  const features = [
    { title: 'Dərs cədvəli', desc: 'Cədvələ 1 yerdən sürətli çıxış' },
    { title: 'Elanlar', desc: 'Müəllim elan yaradır, admin təsdiqləyir' },
    { title: 'Eventlər', desc: 'Workshop və meetup-lar bir yerdə' },
    { title: 'Team Finder', desc: 'Skill-lərlə komanda qurmaq' },
    { title: 'Lost & Found', desc: 'Əlaqə ilə itmiş əşyaları tap' },
    { title: 'Vakansiyalar', desc: 'Karyera imkanlarını izləmək' },
  ]

  const stats = [
    { label: 'Aktiv istifadəçi', value: '1K+' },
    { label: 'Elan & event', value: '250+' },
    { label: 'Komanda elanları', value: '120+' },
  ]

  return (
    <div className="landing">
      <section className="landingHero">
        <div className="landingHeroLeft">
          <div className="landingKicker">Education platform</div>
          <h1 className="landingTitle">
            Akademiyada bütün məlumatlar <span className="accentText">vahid platformada</span>
          </h1>
          <p className="landingLead">
            Dərs cədvəli, elanlar, eventlər, vakansiyalar, komanda qurmaq və lost &amp; found
            funksionallığı — hamısı bir yerdə.
          </p>
          <div className="landingCtas">
            <a className="ctaPrimary" href="#/login">
              Login
            </a>
            <a className="ctaSecondary" href="#/register">
              Qeydiyyat
            </a>
          </div>

          <div className="landingStats">
            {stats.map((s) => (
              <div key={s.label} className="statMini">
                <div className="statMiniValue">{s.value}</div>
                <div className="statMiniLabel">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="landingHeroRight">
          <div className="heroCardFloat">
            <div className="heroCardFloatTop">
              <div className="heroDot" />
              <div className="heroDot heroDot2" />
              <div className="heroDot heroDot3" />
            </div>
            <div className="heroCardFloatBody">
              <div className="heroBadge">New</div>
              <div className="heroCardTitle">Academy Hub</div>
              <div className="heroCardDesc">İdarəetmə + tələbə bölmələri + elanlar</div>
            </div>
          </div>

          <div className="heroVisual">
            <img className="heroImg" src={heroImg} alt="" />
          </div>
        </div>
      </section>

      <section className="landingSection">
        <div className="sectionHeader">
          <div>
            <div className="sectionKicker">Popular</div>
            <h2 className="sectionTitle">İstiqamətlər</h2>
          </div>
          <a className="sectionLink" href="#/login">
            Platformaya keç
          </a>
        </div>

        <div className="cardsGrid">
          {courses.map((c) => (
            <div key={c.title} className="courseCard">
              <div className="courseTop">
                <div className="courseIcon" />
                <span className="pill pillInfo">{c.level}</span>
              </div>
              <div className="courseTitle">{c.title}</div>
              <div className="courseMeta">{c.meta}</div>
              <div className="courseActions">
                <a className="miniLink" href="#/login">
                  Bax
                </a>
                <a className="miniCta" href="#/register">
                  Qeydiyyat
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landingSection">
        <div className="sectionHeader">
          <div>
            <div className="sectionKicker">Why us</div>
            <h2 className="sectionTitle">Sürətli və rahat çıxış</h2>
          </div>
        </div>

        <div className="featuresGrid">
          {features.map((f) => (
            <div key={f.title} className="featureCard">
              <div className="featureIcon" />
              <div className="featureTitle">{f.title}</div>
              <div className="featureDesc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landingSection landingCtaSection">
        <div className="ctaBlock">
          <div>
            <div className="ctaKicker">Get started</div>
            <h2 className="ctaTitle">İndi daxil ol və platformanı istifadə et</h2>
            <p className="ctaDesc">Admin, müəllim və tələbə rolları ilə səlis idarəetmə.</p>
          </div>
          <div className="ctaButtons">
            <a className="ctaPrimary" href="#/login">
              Login
            </a>
            <a className="ctaSecondary" href="#/register">
              Qeydiyyat
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
