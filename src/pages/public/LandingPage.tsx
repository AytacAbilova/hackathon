import styles from "./LandingPage.module.css"

export default function LandingPage() {
  const courses = [
    { title: "Frontend (React)", meta: "12 dərs · Praktika", level: "Beginner" },
    { title: "Backend (Node.js)", meta: "10 dərs · API", level: "Intermediate" },
    { title: "UI/UX Design", meta: "8 dərs · Figma", level: "Beginner" },
    { title: "Data Basics", meta: "6 dərs · Analitika", level: "Starter" },
  ]

  const stats = [
    { label: "Aktiv istifadəçi", value: "1K+" },
    { label: "Elan & event", value: "250+" },
    { label: "Komanda elanları", value: "120+" },
  ]

  const badgeClass: Record<string, string> = {
    Beginner: styles.badgeBeginner,
    Intermediate: styles.badgeIntermediate,
    Starter: styles.badgeStarter,
  }

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        {/* Left content */}
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Yeni Nəsil Öyrənmə
          </div>

          <h1 className={styles.heroTitle}>
            Akademiyada bütün məlumatlar{" "}
            <span className={styles.heroAccent}>vahid platformada</span>
          </h1>

          <p className={styles.heroDesc}>
            Dərs cədvəli, elanlar, eventlər, vakansiyalar, komanda qurmaq və
            lost &amp; found funksionallığı — hamısı bir yerdə.
          </p>

          <div className={styles.heroCta}>
            <a href="#/login" className={styles.btnPrimary}>Login</a>
            <a href="#/register" className={styles.btnOutline}>Qeydiyyat</a>
          </div>

          <div className={styles.heroStats}>
            {stats.map((s) => (
              <div key={s.label}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual card */}
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardChrome}>
              <span className={`${styles.chromeDot} ${styles.chromeDotRed}`} />
              <span className={`${styles.chromeDot} ${styles.chromeDotYellow}`} />
              <span className={`${styles.chromeDot} ${styles.chromeDotGreen}`} />
              <span className={styles.chromeNewBadge}>New</span>
            </div>

            <div className={styles.heroCardPreview}>
              <div className={styles.previewRow}>
                <div className={styles.previewBlockBlue} />
                <div className={styles.previewBlockTeal} />
              </div>
              <div className={styles.previewRow}>
                <div className={styles.previewBlockWhiteShort} />
                <div className={styles.previewBlockWhiteFlex} />
              </div>
              <div className={styles.previewBlockCta} />
            </div>

            <div className={styles.heroCardFooter}>
              <div className={styles.heroCardTitle}>Academy Hub</div>
              <div className={styles.heroCardSub}>
                İdarəetmə + tələbə bölmələri + elanlar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className={styles.section}>
        <div className={styles.coursesHeader}>
          <div>
            <div className={styles.sectionLabel}>Popular</div>
            <h2 className={styles.sectionTitle}>İstiqamətlər</h2>
          </div>

          <a href="#/login" className={styles.coursesLink}>
            Platformaya keç <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((c) => (
            <div key={c.title} className={styles.courseCard}>
              <div className={styles.courseCardTop}>
                <div className={styles.courseIcon} />
                <span className={`${styles.badge} ${badgeClass[c.level] ?? ""}`}>
                  {c.level}
                </span>
              </div>

              <div>
                <div className={styles.courseTitle}>{c.title}</div>
                <div className={styles.courseMeta}>{c.meta}</div>
              </div>

              <div className={styles.courseActions}>
                <a href="#/login" className={styles.courseActionView}>Bax</a>
                <a href="#/register" className={styles.courseActionReg}>Qeydiyyat</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.section}>
        <div className={styles.featuresIntro}>
          <div className={styles.sectionLabel}>Why us</div>
          <h2 className={styles.sectionTitle}>Sürətli və rahat çıxış</h2>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCardFeatured}>
            <div className={styles.featureIconFeatured} />
            <div className={styles.featureTitleFeatured}>Dərs cədvəli</div>
            <div className={styles.featureDescFeatured}>
              Cədvələ 1 yerdən sürətli çıxış imkanı ilə planlamanızı asanlaşdırın.
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} />
            <div className={styles.featureTitle}>Elanlar</div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} />
            <div className={styles.featureTitle}>Eventlər</div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} />
            <div className={styles.featureTitle}>Team Finder</div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} />
            <div className={styles.featureTitle}>Lost & Found</div>
          </div>

          <div className={styles.featureCardWide}>
            <div className={styles.featureCardWideText}>
              <div className={styles.featureTitle}>Vakansiyalar</div>
            </div>
            <div className={styles.featureIconWide}>
              <span aria-hidden="true">▣</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
