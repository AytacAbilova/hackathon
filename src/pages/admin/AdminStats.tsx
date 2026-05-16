import type { Stats } from '../../types/models'

export default function AdminStats(props: { stats: Stats }) {
  return (
    <div className="adminPage">
      <div className="adminStatsGrid">
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Total Users</span>
          </div>
          <div className="adminStatValue">{props.stats.usersTotal}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Approved Announcements</span>
          </div>
          <div className="adminStatValue">{props.stats.announcementsApproved}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Pending Announcements</span>
          </div>
          <div className="adminStatValue">{props.stats.announcementsPending}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Events</span>
          </div>
          <div className="adminStatValue">{props.stats.eventsTotal}</div>
        </div>
      </div>

      <div className="adminMainGrid">
        <section className="adminWideCard">
          <div className="adminWideCardHeader">
            <div className="adminWideCardTitle">User Growth</div>
            <div className="adminMeta">
              Admin: {props.stats.usersByRole.admin} · Teacher: {props.stats.usersByRole.teacher} · Student:{' '}
              {props.stats.usersByRole.student}
            </div>
          </div>
          <div className="adminChart adminChartTall" aria-hidden="true" />
        </section>

        <aside className="adminSideStack">
          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">Student Modules</div>
                <div className="adminCardSubtitle">Lost &amp; Found and Team Finder activity</div>
              </div>
            </div>
            <div className="adminMiniGrid">
              <div className="adminMiniKpi">
                <div className="adminMiniKpiLabel">Lost &amp; Found</div>
                <div className="adminMiniKpiValue">{props.stats.lostFoundTotal}</div>
              </div>
              <div className="adminMiniKpi">
                <div className="adminMiniKpiLabel">Team Finder</div>
                <div className="adminMiniKpiValue">{props.stats.teamPostsTotal}</div>
              </div>
            </div>
          </section>

          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">System Notes</div>
                <div className="adminCardSubtitle">Operational summary</div>
              </div>
            </div>
            <div className="adminHintBox">
              Real-time monitoring and alerting can be connected later via backend endpoints.
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
