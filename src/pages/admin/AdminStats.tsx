import type { Stats } from '../../types/models'

export default function AdminHome(props: {
  stats: Stats
  pendingCount: number
  onGoUsers: () => void
  onGoAnnouncements: () => void
  onGoStats: () => void
}) {
  const totalUsers = props.stats.usersTotal
  const approved = props.stats.announcementsApproved
  const pending = props.stats.announcementsPending
  const activeEvents = props.stats.eventsTotal

  return (
    <div className="adminPage">
      <div className="adminHero">
        <div>
          <div className="adminWelcome">Xoş gəldiniz, Platform Administratoru.</div>
          <div className="adminWelcomeSub">
            Akademiyanın real vaxt performansı və sistem sağlamlığına ümumi baxış.
          </div>
        </div>
        <div className="adminHeroActions">
          <button type="button" className="adminCta" onClick={props.onGoUsers}>
            İstifadəçi Siyahısı
          </button>
          <button type="button" className="adminCta adminCtaGhost" onClick={props.onGoAnnouncements}>
            Elanlar {props.pendingCount > 0 ? <span className="adminBadge">{props.pendingCount}</span> : null}
          </button>
          <button type="button" className="adminCta adminCtaGhost" onClick={props.onGoStats}>
            Analitika
          </button>
        </div>
      </div>

      <div className="adminStatsGrid">
        <button type="button" className="adminStatCard" onClick={props.onGoUsers}>
          <div className="adminStatTop">
            <span className="adminStatLabel">Ümumi İstifadəçilər</span>
            <span className="adminStatDelta">+12%</span>
          </div>
          <div className="adminStatValue">{totalUsers}</div>
        </button>

        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Təsdiqlənmiş Elanlar</span>
            <span className="adminStatDot adminDotOk" />
          </div>
          <div className="adminStatValue">{approved}</div>
        </div>

        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Gözləyən Elanlar</span>
            <span className="adminStatDot adminDotWarn" />
          </div>
          <div className="adminStatValue">{pending}</div>
        </div>

        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Aktiv Tədbirlər</span>
            <span className="adminStatDot adminDotInfo" />
          </div>
          <div className="adminStatValue">{activeEvents}</div>
        </div>
      </div>

      <div className="adminMainGrid">
        <section className="adminWideCard">
          <div className="adminWideCardHeader">
            <div className="adminWideCardTitle">Sürətli Baxış: Sistem Sağlamlığı</div>
            <button type="button" className="adminLinkBtn">
              Hesabatı Yüklə
            </button>
          </div>
          <div className="adminHealthGrid">
            <div className="adminHealthMetric">
              <div className="adminHealthLabel">İş Vaxtı</div>
              <div className="adminHealthValue">99.98%</div>
              <div className="adminBar">
                <div className="adminBarFill adminBarFillOk" style={{ width: '92%' }} />
              </div>
            </div>
            <div className="adminHealthMetric">
              <div className="adminHealthLabel">Server Yükü</div>
              <div className="adminHealthValue">24%</div>
              <div className="adminBar">
                <div className="adminBarFill adminBarFillInfo" style={{ width: '24%' }} />
              </div>
            </div>
            <div className="adminHealthMetric">
              <div className="adminHealthLabel">API Statusu</div>
              <div className="adminHealthValue">İşlək</div>
              <div className="adminPill adminPillOk">Bütün sistemlər işlək vəziyyətdədir</div>
            </div>
          </div>
        </section>

        <aside className="adminSideStack">
          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">Xəbərdarlıq</div>
                <div className="adminCardSubtitle">
                  Növbəti sistem texniki xidməti bazar günü saat 02:00 UTC-də planlaşdırılıb.
                </div>
              </div>
            </div>
            <button type="button" className="adminCta adminCtaGhost adminCtaFull">
              İndi Bildiriş Göndər
            </button>
          </section>

          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">İstifadəçi Artımı</div>
                <div className="adminCardSubtitle">Həftəlik icmal</div>
              </div>
            </div>
            <div className="adminChart" aria-hidden="true" />
          </section>
        </aside>
      </div>
    </div>
  )
}