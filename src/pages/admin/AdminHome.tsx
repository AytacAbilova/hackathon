import type { Stats } from '../../types/models'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'

export default function AdminHome(props: {
  stats: Stats
  pendingCount: number
  onGoUsers: () => void
  onGoAnnouncements: () => void
  onGoStats: () => void
}) {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Platforma idarəetməsi</h2>
          <p className="pageSubtitle">İstifadəçilər, elanlar və statistik göstəricilər</p>
        </div>
        <div className="actionsRow">
          <Button variant="secondary" onClick={props.onGoUsers}>
            User list
          </Button>
          <Button variant="secondary" onClick={props.onGoAnnouncements}>
            Elanlar{' '}
            {props.pendingCount > 0 ? <span className="chip">{props.pendingCount}</span> : null}
          </Button>
          <Button variant="primary" onClick={props.onGoStats}>
            Statistik dashboard
          </Button>
        </div>
      </div>

      <div className="grid">
        <StatCard
          title="İstifadəçilər"
          value={props.stats.usersTotal}
          meta={`Admin: ${props.stats.usersByRole.admin} · Müəllim: ${props.stats.usersByRole.teacher} · Tələbə: ${props.stats.usersByRole.student}`}
        />
        <StatCard
          title="Elanlar"
          value={props.stats.announcementsApproved + props.stats.announcementsPending}
          meta={`Təsdiqlənən: ${props.stats.announcementsApproved} · Gözləyən: ${props.stats.announcementsPending}`}
        />
        <StatCard
          title="Eventlər"
          value={props.stats.eventsTotal}
          meta="Müəllimlər tərəfindən əlavə olunur"
        />
        <StatCard
          title="Tələbə bölmələri"
          value={props.stats.lostFoundTotal + props.stats.teamPostsTotal}
          meta={`Lost&Found: ${props.stats.lostFoundTotal} · Team: ${props.stats.teamPostsTotal}`}
        />
      </div>
    </div>
  )
}