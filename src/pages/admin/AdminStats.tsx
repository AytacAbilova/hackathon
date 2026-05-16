import type { Stats } from '../../types/models'
import StatCard from '../../components/ui/StatCard'

export default function AdminStats(props: { stats: Stats }) {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Statistik dashboard</h2>
          <p className="pageSubtitle">Platforma üzrə ümumi göstəricilər</p>
        </div>
      </div>

      <div className="grid">
        <StatCard
          title="İstifadəçi sayı"
          value={props.stats.usersTotal}
          meta={`Admin: ${props.stats.usersByRole.admin} · Müəllim: ${props.stats.usersByRole.teacher} · Tələbə: ${props.stats.usersByRole.student}`}
        />
        <StatCard title="Elan (Approved)" value={props.stats.announcementsApproved} meta="Tələbələrə görünən" />
        <StatCard title="Elan (Pending)" value={props.stats.announcementsPending} meta="Admin təsdiqi gözləyir" />
        <StatCard title="Event sayı" value={props.stats.eventsTotal} meta="Müəllimlər tərəfindən" />
        <StatCard title="Lost & Found" value={props.stats.lostFoundTotal} meta="Tələbə paylaşımları" />
        <StatCard title="Team Finder" value={props.stats.teamPostsTotal} meta="Komanda elanları" />
      </div>
    </div>
  )
}