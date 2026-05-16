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
          <div className="adminWelcome">Welcome, Platform Admin.</div>
          <div className="adminWelcomeSub">
            Here is an overview of the academy’s real-time performance and system health.
          </div>
        </div>
        <div className="adminHeroActions">
          <button type="button" className="adminCta" onClick={props.onGoUsers}>
            User List
          </button>
          <button type="button" className="adminCta adminCtaGhost" onClick={props.onGoAnnouncements}>
            Announcements {props.pendingCount > 0 ? <span className="adminBadge">{props.pendingCount}</span> : null}
          </button>
          <button type="button" className="adminCta adminCtaGhost" onClick={props.onGoStats}>
            Analytics
          </button>
        </div>
      </div>

      <div className="adminStatsGrid">
        <button type="button" className="adminStatCard" onClick={props.onGoUsers}>
          <div className="adminStatTop">
            <span className="adminStatLabel">Total Users</span>
            <span className="adminStatDelta">+12%</span>
          </div>
          <div className="adminStatValue">{totalUsers}</div>
        </button>

        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Approved Announcements</span>
            <span className="adminStatDot adminDotOk" />
          </div>
          <div className="adminStatValue">{approved}</div>
        </div>

        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Pending Announcements</span>
            <span className="adminStatDot adminDotWarn" />
          </div>
          <div className="adminStatValue">{pending}</div>
        </div>

        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Active Events</span>
            <span className="adminStatDot adminDotInfo" />
          </div>
          <div className="adminStatValue">{activeEvents}</div>
        </div>
      </div>

      <div className="adminMainGrid">
        <section className="adminWideCard">
          <div className="adminWideCardHeader">
            <div className="adminWideCardTitle">Quick Look: System Health</div>
            <button type="button" className="adminLinkBtn">
              Download Report
            </button>
          </div>
          <div className="adminHealthGrid">
            <div className="adminHealthMetric">
              <div className="adminHealthLabel">Uptime</div>
              <div className="adminHealthValue">99.98%</div>
              <div className="adminBar">
                <div className="adminBarFill adminBarFillOk" style={{ width: '92%' }} />
              </div>
            </div>
            <div className="adminHealthMetric">
              <div className="adminHealthLabel">Server Load</div>
              <div className="adminHealthValue">24%</div>
              <div className="adminBar">
                <div className="adminBarFill adminBarFillInfo" style={{ width: '24%' }} />
              </div>
            </div>
            <div className="adminHealthMetric">
              <div className="adminHealthLabel">API Status</div>
              <div className="adminHealthValue">Operational</div>
              <div className="adminPill adminPillOk">All systems are green</div>
            </div>
          </div>
        </section>

        <aside className="adminSideStack">
          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">Advisory</div>
                <div className="adminCardSubtitle">
                  Upcoming system maintenance scheduled for Sunday at 02:00 AM UTC.
                </div>
              </div>
            </div>
            <button type="button" className="adminCta adminCtaGhost adminCtaFull">
              Notify Now
            </button>
          </section>

          <section className="adminCard">
            <div className="adminCardHeader">
              <div>
                <div className="adminCardTitle">User Growth</div>
                <div className="adminCardSubtitle">Weekly overview</div>
              </div>
            </div>
            <div className="adminChart" aria-hidden="true" />
          </section>
        </aside>
      </div>
    </div>
  )
}
