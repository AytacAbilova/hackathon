import type { Stats } from '../../types/models'

export default function AdminStats(props: { stats: Stats }) {
  return (
    <div className="adminPage">
      <div className="adminStatsGrid">
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Ümumi İstifadəçilər</span>
          </div>
          <div className="adminStatValue">{props.stats.usersTotal}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Təsdiqlənmiş Elanlar</span>
          </div>
          <div className="adminStatValue">{props.stats.announcementsApproved}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Gözləyən Elanlar</span>
          </div>
          <div className="adminStatValue">{props.stats.announcementsPending}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Tədbirlər</span>
          </div>
          <div className="adminStatValue">{props.stats.eventsTotal}</div>
        </div>
      </div>

      <div className="adminMainGrid">
        <section className="adminWideCard">
          <div className="adminWideCardHeader">
            <div className="adminWideCardTitle">İstifadəçi Artımı</div>
            <div className="adminMeta">
              Admin: {props.stats.usersByRole.admin} · Müəllim: {props.stats.usersByRole.teacher} · Tələbə:{' '}
              {props.stats.usersByRole.student}
            </div>
          </div>
          <div className="adminChart adminChartTall" aria-hidden="true" />
        </section>

        <aside className="adminSideStack">
          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">Tələbə Modulları</div>
                <div className="adminCardSubtitle">İtirilmiş &amp; Tapılmış və Komanda Tapıcı fəaliyyəti</div>
              </div>
            </div>
            <div className="adminMiniGrid">
              <div className="adminMiniKpi">
                <div className="adminMiniKpiLabel">İtirilmiş &amp; Tapılmış</div>
                <div className="adminMiniKpiValue">{props.stats.lostFoundTotal}</div>
              </div>
              <div className="adminMiniKpi">
                <div className="adminMiniKpiLabel">Komanda Tapıcı</div>
                <div className="adminMiniKpiValue">{props.stats.teamPostsTotal}</div>
              </div>
            </div>
          </section>

          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">Sistem Qeydləri</div>
                <div className="adminCardSubtitle">Əməliyyat xülasəsi</div>
              </div>
            </div>
            <div className="adminHintBox">
              Real vaxt monitorinqi və xəbərdarlıq sistemi sonradan backend endpointləri vasitəsilə qoşula bilər.
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}